import * as jose from "jose";
import type { APIContext } from "astro";

import { getCookie } from "src/utils/cookies";

export type IdToken = jose.JWTPayload & { sub: string };

export const authenticate = async ({ request, locals }: Pick<APIContext, 'request' | 'locals'>): Promise<IdToken | undefined> => {
  const {
    PUBLIC_DOMAIN,
    PUBLIC_KEY,
  } = locals.runtime.env;

  const cookieString = request.headers.get("Cookie");
  const idTokenValue = getCookie(cookieString || "", "X-Identity-Badge");
  if (!idTokenValue) {
    return undefined;
  }

  const token = await jose.jwtVerify<IdToken>(
    idTokenValue,
    await jose.importSPKI(PUBLIC_KEY.replaceAll('\\n', '\n'), "RS256"),
    {
      audience: PUBLIC_DOMAIN,
      issuer: PUBLIC_DOMAIN,
      typ: "JWT",
    },
  );

  if (token.protectedHeader.cty !== "X-Identity-Badge") {
    return undefined;
  }

  return token.payload;
};

export const issueSignInToken = async ({ sub, iat }: { sub: string, iat?: number }, { locals }: Pick<APIContext, 'locals'>) => {
  const {
    PUBLIC_DOMAIN,
    PRIVATE_KEY,
  } = locals.runtime.env;

  iat = iat || Math.floor(Date.now() / 1000);

  const token = (
    await new jose
      .SignJWT({
        iss: PUBLIC_DOMAIN,
        aud: PUBLIC_DOMAIN,
        iat,
        exp: iat + 600 * 20,
        sub,
      })
      .setProtectedHeader({
        alg: "RS256",
        typ: "JWT",
        cty: "X-Knock-Knock",
      })
      .sign(
        await jose.importPKCS8(PRIVATE_KEY.replaceAll('\\n', '\n'), "RS256"),
      )
  );

  return token;
};

export const issueIdentityBadge = async ({ sub, iat }: { sub: string, iat?: number }, { locals }: Pick<APIContext, 'locals'>) => {
  const {
    PUBLIC_DOMAIN,
    PRIVATE_KEY,
  } = locals.runtime.env;

  iat = iat || Math.floor(Date.now() / 1000);

  const identity = (
    await new jose
      .SignJWT({
        iss: PUBLIC_DOMAIN,
        aud: PUBLIC_DOMAIN,
        iat,
        exp: iat + 60 * 60 * 24 * 30,
        sub: sub,
      })
      .setProtectedHeader({
        alg: "RS256",
        typ: "JWT",
        cty: "X-Identity-Badge",
      })
      .sign(
        await jose.importPKCS8(PRIVATE_KEY.replaceAll('\\n', '\n'), "RS256"),
      )
  );

  return identity;
};
