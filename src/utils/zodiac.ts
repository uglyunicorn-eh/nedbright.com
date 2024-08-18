import type { APIContext } from 'astro';
import { z } from 'zod';
import * as jose from "jose";

import { authenticate, issueIdentityBadge, issueProfileBadge, issueSignInToken, type IdToken } from 'src/utils/auth';
import { sendgridSend } from 'src/utils/sendgrid';
import { generateReplyboxSSO } from 'src/utils/replybox';


type AstroZodiac<C> = (ctx: C) => Promise<Response>;
type ZodiacMiddleware<C, C2 = C> = (ctx: C, next: AstroZodiac<C2>) => Promise<Response>;

type ProtectedZodiacContext = {
  idToken: IdToken;
}

type GatedZodiacContext = {
  idToken?: IdToken;
}

type ZodiacInputShape<S extends z.Schema> = {
  input: S;
}

type ZodiacPayloadShape<S extends z.Schema> = {
  payload: S;
}

type ZodiacShape<IN extends z.Schema, OUT extends z.Schema> = ZodiacInputShape<IN> & ZodiacPayloadShape<OUT>;

type InputShapedZodiacContext<I> = {
  input: I;
  ok: () => Response;
  deadbeef: () => Response;
  error: (status: number, errors?: z.ZodIssue[]) => Response;
}

type PayloadShapedZodiacContext<P extends {} = {}> = {
  ok: (payload: P) => Response;
}

type ShapedZodiacContext<I, P extends {} = {}> = Omit<InputShapedZodiacContext<I>, 'ok'> & PayloadShapedZodiacContext<P>;

type SendgridTemplate = {
  SIGN_IN: {
    link: string;
  },
};

type ZodiacPackContext = {
  auth: {
    issueSignInToken: ({ sub, iat }: { sub: string, iat?: number }) => Promise<string>;
    signUserIn: (user: User) => Promise<void>;
  },
  sendgrid: {
    sendgridSend: <T extends keyof SendgridTemplate>(email: string, templateId: T, data: SendgridTemplate[T]) => Promise<void>;
  },
  tokens: {
    jwtVerify: <T extends jose.JWTPayload>(tokenValue: string) => Promise<jose.JWTVerifyResult<T>>;
  },
  site: {
    makeUrl: (path: string, query?: Record<string, string>) => string;
    setCookie: (key: string, value: string | Record<string, any>, expires?: Date, maxAge?: number, httpOnly?: boolean) => void;
  },
  replybox: {
    sso: (user: User) => Promise<{ hash: string, payload: string }>;
  }
};

class Zodiac<C extends APIContext> {
  constructor(protected middleware: ZodiacMiddleware<C>[] = []) { }

  gated(): Zodiac<C & GatedZodiacContext> {
    this.middleware.push(async (ctx, next) => {
      let idToken: IdToken | undefined;
      try {
        idToken = await authenticate(ctx);
      } catch {
        return Response.json({ status: 'error' }, { status: 400 });
      }
      return await next({ ...ctx, idToken });
    });
    return this as unknown as Zodiac<C & GatedZodiacContext>;
  }

  protected(): Zodiac<C & ProtectedZodiacContext> {
    this.middleware.push(async (ctx, next) => {
      let idToken: IdToken | undefined;
      try {
        idToken = await authenticate(ctx);
        if (!idToken) {
          return Response.json({ status: 'error' }, { status: 401 });
        }
      } catch {
        return Response.json({ status: 'error' }, { status: 400 });
      }
      return await next({ ...ctx, idToken });
    });
    return this as unknown as Zodiac<C & ProtectedZodiacContext>;
  }

  input<S extends z.Schema>(schema: ZodiacInputShape<S>): Zodiac<C & InputShapedZodiacContext<z.TypeOf<S>>> {
    this.middleware.push(makeShapeMiddleware(schema));
    return this as unknown as Zodiac<C & InputShapedZodiacContext<z.TypeOf<S>>>;
  }

  output<S extends z.Schema>(schema: ZodiacPayloadShape<S>): Zodiac<C & PayloadShapedZodiacContext<z.TypeOf<S>>> {
    this.middleware.push(makeShapeMiddleware(schema));
    return this as unknown as Zodiac<C & PayloadShapedZodiacContext<z.TypeOf<S>>>;
  }

  shape<IN extends z.Schema, OUT extends z.Schema>(schema: ZodiacShape<IN, OUT>): Zodiac<C & ShapedZodiacContext<z.TypeOf<IN>, z.TypeOf<OUT>>> {
    this.middleware.push(makeShapeMiddleware(schema));
    return this as unknown as Zodiac<C & ShapedZodiacContext<z.TypeOf<IN>, z.TypeOf<OUT>>>;
  }

  handle(handler: AstroZodiac<C>): AstroZodiac<C> {
    return async (ctx: C) => await createExecutionChain<C>(this.middleware, handler)(ctx);
  }

  use<P extends keyof ZodiacPackContext>(pack: P): Zodiac<C & ZodiacPackContext[P]> {
    this.middleware.push(async (ctx, next) => {
      const makeUrl = (path: string, query?: Record<string, string>) => `${ctx.url.protocol}//${ctx.url.host}${path}${query ? '?' + new URLSearchParams(query) : ''}`;
      const setCookie = (key: string, value: string | Record<string, any>, expires?: Date, maxAge?: number, httpOnly?: boolean) => {
        const { cookies, locals } = ctx;
        const {
          PUBLIC_DOMAIN,
        } = locals.runtime.env;

        maxAge = maxAge || 60 * 60 * 24 * 30;
        expires = expires || (new Date(Date.now() + maxAge * 1000));

        cookies.set(
          key,
          value,
          import.meta.env.PROD
            ? { httpOnly, secure: true, sameSite: 'strict', domain: PUBLIC_DOMAIN, maxAge, path: '/', expires }
            : { httpOnly, maxAge, path: '/', expires },
        );
      };

      const ext = {
        auth: {
          issueSignInToken: async (user: User) => await issueSignInToken(user, ctx),
          signUserIn: async (user: User) => {
            const maxAge = 60 * 60 * 24 * 30;
            const expires = new Date(Date.now() + maxAge * 1000);

            const name = user.name ?? null;
            const email = user.sub;
            const login_url = makeUrl('/profile/');

            const identity = await issueIdentityBadge(user, ctx);
            const sso = await generateReplyboxSSO({ name, email, login_url }, ctx);
            const profile = await issueProfileBadge({ name: user.name, iat: user.iat, "replybox:sso": sso }, ctx);

            setCookie('X-Identity-Badge', identity, expires, maxAge, true);
            setCookie('X-Profile-Badge', profile, expires, maxAge, false);
          },
        },
        sendgrid: {
          sendgridSend: async <T extends keyof SendgridTemplate = keyof SendgridTemplate>(email: string, template: T, data: SendgridTemplate[T]) => {
            const templateId = ctx.locals.runtime.env[`${template}_TEMPLATE_ID`];
            await sendgridSend(email, templateId, data, ctx);
          },
        },
        tokens: {
          jwtVerify: async <T extends jose.JWTPayload>(tokenValue: string) => {
            const { locals } = ctx;
            const {
              PUBLIC_DOMAIN,
              PUBLIC_KEY,
            } = locals.runtime.env;

            return await jose.jwtVerify<T>(
              tokenValue,
              await jose.importSPKI(PUBLIC_KEY.replaceAll('\\n', '\n'), "RS256"),
              {
                audience: PUBLIC_DOMAIN,
                issuer: PUBLIC_DOMAIN,
                typ: "JWT",
              },
            );
          },
        },
        site: {
          makeUrl,
          setCookie,
        },
        replybox: {
          sso: async (user: User) =>
            await generateReplyboxSSO(
              {
                name: user.name ?? null,
                email: user.sub,
                login_url: makeUrl('/profile/'),
              },
              ctx,
            ),
        },
      }[pack];
      return await next({ ...ctx, ...ext });
    });
    return this as unknown as Zodiac<C & ZodiacPackContext[P]>;
  }
}

function createExecutionChain<C>(middlewares: ZodiacMiddleware<C>[], entry: AstroZodiac<C>) {
  const makeExecutor = <C>(middleware: ZodiacMiddleware<C>, next: AstroZodiac<C>): AstroZodiac<C> => {
    return async (ctx: C) => middleware(ctx, next);
  };

  return middlewares.reduceRight<AstroZodiac<C>>((next, middleware) => makeExecutor(middleware, next), entry);
}

async function extractInputFromRequest(request: Request) {
  if (request.method === 'GET') {
    return Object.fromEntries(new URLSearchParams(request.url.split('?')[1] || ''));
  }
  return await request.json();
}

const ok = <P>(payload?: P) => Response.json({ status: 'ok', payload });
const error = (status: number, errors?: z.ZodIssue[]) => Response.json({ status: 'error', errors }, { status });
const deadbeef = () => Response.json({ status: '0xdeadbeef' }, { status: 500 });

function makeShapeMiddleware<IN extends z.Schema, OUT extends z.Schema, C extends APIContext>(
  schema: ZodiacInputShape<IN> | ZodiacPayloadShape<OUT> | ZodiacShape<IN, OUT>,
) {
  return async (ctx: C, next: AstroZodiac<C>) => {
    const input = 'input' in schema ? schema.input.parse(await extractInputFromRequest(ctx.request)) : undefined
    try {
      return await next({
        ...ctx,
        input,
        ok,
        error,
        deadbeef,
      });
    }
    catch (err) {
      if (err instanceof z.ZodError) {
        return error(400, err.errors);
      }

      return deadbeef();
    }
  };
}

export const zodiac = () => new Zodiac();
