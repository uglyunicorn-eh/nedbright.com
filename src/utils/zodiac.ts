import type { APIContext } from 'astro';
import { z } from 'zod';

import { authenticate, type IdToken } from 'src/utils/auth';


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

class Zodiac<C extends APIContext> {
  constructor(protected middleware: ZodiacMiddleware<C>[] = []) { }

  gated(): Zodiac<C & GatedZodiacContext> {
    this.middleware.push(async (ctx, next) => {
      const idToken = await authenticate(ctx);
      return await next({ ...ctx, idToken });
    });
    return this as unknown as Zodiac<C & GatedZodiacContext>;
  }

  protected(): Zodiac<C & ProtectedZodiacContext> {
    this.middleware.push(async (ctx, next) => {
      const idToken = await authenticate(ctx);
      if (!idToken) {
        return Response.json({ status: 'error' }, { status: 401 });
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
