import * as jose from "jose";
import { z, ZodError } from "zod";
import type { APIContext } from 'astro';

export const prerender = false;

const SITE_URL = import.meta.env.SITE_URL.replace(/\/$/, '');
const DOMAIN = new URL(import.meta.env.SITE_URL).host;
const PRIVATE_KEY = await jose.importPKCS8(import.meta.env.PRIVATE_KEY.replaceAll('\\n', '\n'), "RS256");
const PUBLIC_KEY = await jose.importSPKI(import.meta.env.PUBLIC_KEY.replaceAll('\\n', '\n'), "RS256");

const Query = z.object({
  token: z.string(),
});

const KnockKnock = z.object({
  cty: z.literal("X-Knock-Knock"),
  sub: z.string().email(),
});

const Input = z.object({
  email: z.string().email(),
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

export async function GET({ request, locals, cookies, redirect }: APIContext) {
  const contentType = request.headers.get('Content-Type');
  const isJsonResponse = contentType === 'application/json';
  try {

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

    let user = await Users.get<User>(sub, { type: 'json' });
    if (!user) {
      user = { iat, sub, name: undefined, 'replybox:sso': undefined };

      await Users.put(sub, JSON.stringify(user));
    }

    const identity = (
      await new jose
        .SignJWT({
          iss: DOMAIN,
          aud: DOMAIN,
          iat,
          exp: iat + 60 * 60 * 24 * 30,
          sub: user.sub,
        })
        .setProtectedHeader({
          alg: "RS256",
          typ: "JWT",
          cty: "X-Identity-Badge",
        })
        .sign(PRIVATE_KEY)
    );

    const profile = (
      await new jose
        .SignJWT({
          iss: DOMAIN,
          aud: DOMAIN,
          iat,
          name: user.name ?? null,
          "replybox:sso": user['replybox:sso'] ?? null,
        })
        .setProtectedHeader({
          alg: "RS256",
          typ: "JWT",
          cty: "X-Profile-Badge",
        })
        .sign(PRIVATE_KEY)
    );

    const maxAge = 60 * 60 * 24 * 30;

    cookies.set(
      'X-Identity-Badge',
      identity,
      import.meta.env.PROD
        ? { httpOnly: true, secure: true, sameSite: 'strict', domain: DOMAIN, maxAge, path: '/' }
        : undefined,
    );

    if (isJsonResponse)
      return Response.json({ status: 'ok', profile });

    cookies.set(
      'X-Profile-Badge',
      profile,
      import.meta.env.PROD
        ? { secure: true, sameSite: 'strict', domain: DOMAIN, maxAge, path: '/' }
        : undefined,
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

export async function POST({ request }: APIContext) {
  try {
    const { email } = Input.parse(await request.json());
    const iat = Math.floor(Date.now() / 1000);

    const token = (
      await new jose
        .SignJWT({
          iss: DOMAIN,
          aud: DOMAIN,
          iat,
          exp: iat + 600 * 20,
          sub: email,
        })
        .setProtectedHeader({
          alg: "RS256",
          typ: "JWT",
          cty: "X-Knock-Knock",
        })
        .sign(PRIVATE_KEY)
    );

    await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${import.meta.env.SENDGRID_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email }],
            dynamic_template_data: {
              link: `${SITE_URL}/api/knock-knock/?token=${token}`,
            },
          },
        ],
        from: { email: import.meta.env.SENDGRID_FROM_EMAIL, name: import.meta.env.SENDGRID_FROM_NAME },
        reply_to: { email: import.meta.env.SENDGRID_REPLY_TO },
        template_id: import.meta.env.SIGN_IN_TEMPLATE_ID,
      }),
    });

    return Response.json({ status: 'ok' });
  }
  catch (error) {
    console.error(error);

    if (error instanceof ZodError) {
      return Response.json({ status: 'error', errors: error.errors }, { status: 400 });
    }
    return Response.json({ status: '0xdeadbeef' }, { status: 400 });
  }
}
