import * as jose from "jose";
import type { APIContext } from "astro";

import { getCookie } from "src/utils/cookies";

export type IdToken = jose.JWTPayload & { sub: string };

export const authenticate = async ({ request, locals }: Pick<APIContext, 'request' | 'locals'>): Promise<IdToken | undefined> => {
  const {
    DOMAIN,
  } = locals.runtime.env;

  const cookieString = request.headers.get("Cookie");
  const idTokenValue = getCookie(cookieString || "", "X-Identity-Badge");
  if (!idTokenValue) {
    return undefined;
  }

  const PUBLIC_KEY = await jose.importSPKI(locals.runtime.env.PUBLIC_KEY.replaceAll('\\n', '\n'), "RS256");
  const token = await jose.jwtVerify<IdToken>(
    idTokenValue,
    PUBLIC_KEY,
    {
      audience: DOMAIN,
      issuer: DOMAIN,
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
    DOMAIN,
  } = locals.runtime.env;
  const PRIVATE_KEY = await jose.importPKCS8(locals.runtime.env.PRIVATE_KEY.replaceAll('\\n', '\n'), "RS256");

  iat = iat || Math.floor(Date.now() / 1000);

  const token = (
    await new jose
      .SignJWT({
        iss: DOMAIN,
        aud: DOMAIN,
        iat,
        exp: iat + 600 * 20,
        sub,
      })
      .setProtectedHeader({
        alg: "RS256",
        typ: "JWT",
        cty: "X-Knock-Knock",
      })
      .sign(PRIVATE_KEY)
  );

  return token;
};

export const issueIdentityBadge = async ({ sub, iat }: { sub: string, iat?: number }, { locals }: Pick<APIContext, 'locals'>) => {
  const {
    DOMAIN,
  } = locals.runtime.env;
  const PRIVATE_KEY = await jose.importPKCS8(locals.runtime.env.PRIVATE_KEY.replaceAll('\\n', '\n'), "RS256");

  iat = iat || Math.floor(Date.now() / 1000);

  const identity = (
    await new jose
      .SignJWT({
        iss: DOMAIN,
        aud: DOMAIN,
        iat,
        exp: iat + 60 * 60 * 24 * 30,
        sub: sub,
      })
      .setProtectedHeader({
        alg: "RS256",
        typ: "JWT",
        cty: "X-Identity-Badge",
      })
      .sign(PRIVATE_KEY)
  );

  return identity;
};
