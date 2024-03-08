import * as jose from "jose";
import * as Sentry from "@sentry/astro";
import { z, ZodError } from "zod";

import type { APIContext } from 'astro';

export const prerender = false;

let SITE_URL: string;
let DOMAIN: string;
let PRIVATE_KEY: jose.KeyLike;
let PUBLIC_KEY: jose.KeyLike;


try {
  SITE_URL = import.meta.env.SITE_URL.replace(/\/$/, '');
  DOMAIN = new URL(import.meta.env.SITE_URL).host;
  PRIVATE_KEY = await jose.importPKCS8(import.meta.env.PRIVATE_KEY.replaceAll('\\n', '\n'), "RSA");
  PUBLIC_KEY = await jose.importSPKI(import.meta.env.PUBLIC_KEY.replaceAll('\\n', '\n'), "RSA");
}
catch (error) {
  Sentry.captureException(error);
}

const Query = z.object({
  token: z.string(),
});

const KnockKnock = z.object({
  cty: z.literal("Knock-Knock"),
  sub: z.string().email(),
});

const Input = z.object({
  email: z.string().email(),
});

export async function GET({ request }: APIContext) {
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

    const sub = knockKnockRequest.sub;

    if (!isJsonResponse) {
      return Response.redirect(`${SITE_URL}/`, 307);
    }
    return Response.json({ status: 'ok', sub });
  }
  catch (error) {
    if (!isJsonResponse) {
      return Response.redirect(`${SITE_URL}/?status=error`, 307);
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
          cty: "Knock-Knock",
        })
        .sign(PRIVATE_KEY)
    );

    return Response.json({ status: 'ok', token });
  }
  catch (error) {
    if (error instanceof ZodError) {
      return Response.json({ status: 'error', errors: error.errors }, { status: 400 });
    }
    return Response.json({ status: '0xdeadbeef' }, { status: 400 });
  }
}
