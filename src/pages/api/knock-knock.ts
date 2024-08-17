import { Buffer } from 'node:buffer';
import * as jose from "jose";
import { z, ZodError } from "zod";
import type { APIContext } from 'astro';
import { createHmac } from 'node:crypto';
import { issueIdentityBadge, issueSignInToken } from 'src/utils/auth';
import { sendgridSend } from 'src/utils/sendgrid';

export const prerender = false;

const Query = z.object({
  token: z.string(),
});

const KnockKnock = z.object({
  cty: z.literal("X-Knock-Knock"),
  sub: z.string().email(),
});

type User = {
  iat: number;
  sub: string;
  name?: string;
  'replybox:sso'?: {
    hash: string;
    payload: string;
  },
};

export async function GET({ request, locals, cookies, redirect, url }: APIContext) {
  const {
    DOMAIN,
  } = locals.runtime.env;
  const SITE_URL = `${url.protocol}//${url.host}`;

  const contentType = request.headers.get('Content-Type');
  const isJsonResponse = contentType === 'application/json';

  try {
    const PRIVATE_KEY = await jose.importPKCS8(locals.runtime.env.PRIVATE_KEY.replaceAll('\\n', '\n'), "RS256");
    const PUBLIC_KEY = await jose.importSPKI(locals.runtime.env.PUBLIC_KEY.replaceAll('\\n', '\n'), "RS256");
    const { token } = Query.parse({ token: new URL(request.url).searchParams.get('token') });

    const knockKnockToken = await jose.jwtVerify(
      token,
      PUBLIC_KEY,
      {
        audience: DOMAIN,
        issuer: DOMAIN,
        typ: "JWT",
      },
    );

    const knockKnockRequest = KnockKnock.parse({
      cty: knockKnockToken.protectedHeader.cty,
      sub: knockKnockToken.payload.sub,
    });

    const iat = Math.floor(Date.now() / 1000);
    const sub = knockKnockRequest.sub;

    const { Users } = locals.runtime.env;

    let user: User | null = await Users.get(sub, { type: 'json' });

    if (!user) {
      user = { iat, sub, name: undefined, 'replybox:sso': undefined };

      await Users.put(sub, JSON.stringify(user));
    }

    const identity = await issueIdentityBadge({ sub, iat }, { locals });

    const payload = Buffer.from(JSON.stringify({
      user: {
        name: "Pavel Reznikov",
        email: "pashka.reznikov@gmail.com",
      },
      login_url: `${SITE_URL}/profile/`,
    })).toString('base64');

    const profile = (
      await new jose
        .SignJWT({
          iss: DOMAIN,
          aud: DOMAIN,
          iat,
          name: user.name ?? "Pavel Reznikov",
          "replybox:sso": user['replybox:sso'] ?? {
            hash: createHmac('sha256', locals.runtime.env.REPLYBOX_SECRET_KEY).update(payload).digest('hex'),
            payload,
          },
        })
        .setProtectedHeader({
          alg: "RS256",
          typ: "JWT",
          cty: "X-Profile-Badge",
        })
        .sign(PRIVATE_KEY)
    );

    const maxAge = 60 * 60 * 24 * 30;
    const expires = new Date(Date.now() + maxAge * 1000);

    cookies.set(
      'X-Identity-Badge',
      identity,
      import.meta.env.PROD
        ? { httpOnly: true, secure: true, sameSite: 'strict', domain: DOMAIN, maxAge, path: '/', expires }
        : { httpOnly: true, maxAge, path: '/', expires },
    );

    if (isJsonResponse)
      return Response.json({ status: 'ok', profile });

    cookies.set(
      'X-Profile-Badge',
      profile,
      import.meta.env.PROD
        ? { httpOnly: false, secure: true, sameSite: 'strict', domain: DOMAIN, maxAge, path: '/', expires }
        : { httpOnly: false, maxAge, path: '/', expires },
    );

    return redirect(user.name ? "/" : "/profile/", 307);
  }
  catch (error) {
    console.error(error);

    if (!isJsonResponse) {
      return Response.redirect(`${SITE_URL}/401/`, 307);
    }

    if (error instanceof ZodError) {
      return Response.json({ status: 'error', errors: error.errors }, { status: 400 });
    }

    return Response.json({ status: '0xdeadbeef' }, { status: 400 });
  }
}

export async function POST(ctx: APIContext) {
  const Input = z.object({
    email: z.string().email(),
  }).strict();

  const { request, locals, url } = ctx;
  const {
    SIGN_IN_TEMPLATE_ID,
  } = locals.runtime.env;

  try {
    const { email } = Input.parse(await request.json());

    const token = await issueSignInToken({ sub: email }, ctx);

    await sendgridSend(
      SIGN_IN_TEMPLATE_ID,
      email,
      {
        link: `${url.protocol}//${url.host}/api/knock-knock/?token=${token}`,
      },
      ctx,
    );

    return Response.json({ status: 'ok' });
  }
  catch (error) {
    if (error instanceof ZodError) {
      return Response.json({ status: 'error', errors: error.errors }, { status: 400 });
    }
    return Response.json({ status: '0xdeadbeef' }, { status: 400 });
  }
}
