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

export async function GET({ request, locals, cookies }: APIContext) {
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
      user = { iat, sub };

      await Users.put(sub, JSON.stringify(user));
    }

    const identityBadge = (
      await new jose
        .SignJWT({
          iss: DOMAIN,
          iat,
          exp: iat + 60 * 60 * 24 * 30,
          aud: DOMAIN,
          sub: user.sub,
        })
        .setProtectedHeader({
          alg: "RS256",
          typ: "JWT",
          cty: "X-Identity-Badge",
        })
        .sign(PRIVATE_KEY)
    );

    const visitorBadge = (
      await new jose
        .SignJWT({
          iss: DOMAIN,
          iat: new Date().getTime() / 1000,
          aud: DOMAIN,
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

    if (isJsonResponse)
      return Response.json({ status: 'ok', identity: identityBadge, profile: visitorBadge });

    cookies.set('X-Identity-Badge', identityBadge, { httpOnly: true, secure: true, sameSite: 'strict', domain: DOMAIN });

    if (visitorBadge) {
      cookies.set('X-Profile-Badge', visitorBadge, { secure: true, sameSite: 'strict', domain: DOMAIN });
    }

    return Response.redirect(`${SITE_URL}/`, 307);
  }
  catch (error) {
    console.error(error);

    if (!isJsonResponse) {
      return Response.redirect(`${SITE_URL}/401`, 307);
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
          iat,
          exp: iat + 600 * 20,
          aud: DOMAIN,
          sub: email,
        })
        .setProtectedHeader({
          alg: "RS256",
          typ: "JWT",
          cty: "X-Knock-Knock",
        })
        .sign(PRIVATE_KEY)
    );

    return Response.json({ status: 'ok', token });
  }
  catch (error) {
    console.error(error);

    if (error instanceof ZodError) {
      return Response.json({ status: 'error', errors: error.errors }, { status: 400 });
    }
    return Response.json({ status: '0xdeadbeef' }, { status: 400 });
  }
}
