import * as jose from "jose";
import type { APIContext } from "astro";

export const prerender = false;

export async function GET({ request, locals }: APIContext) {
  const {
    DOMAIN,
  } = locals.runtime.env;

  const cookieString = request.headers.get("Cookie");
  const idTokenValue = getCookie(cookieString || "", "X-Identity-Badge");
  if (!idTokenValue) {
    return Response.json({ status: 'error', message: 'Unauthorized' }, { status: 401 });
  }

  const PUBLIC_KEY = await jose.importSPKI(locals.runtime.env.PUBLIC_KEY.replaceAll('\\n', '\n'), "RS256");
  const idToken = await jose.jwtVerify(
    idTokenValue,
    PUBLIC_KEY,
    {
      audience: DOMAIN,
      issuer: DOMAIN,
      typ: "JWT",
    },
  );

  return Response.json({
    status: 'ok',
    payload: {
      profile: {
        name: null,
        email: idToken.payload.sub,
      },
      settings: {
        "notifications:publications": false,
      },
    },
  });
}

function getCookie(cookieString: string, key: string) {
  if (cookieString) {
    const allCookies = cookieString.split("; ")
    const targetCookie = allCookies.find(cookie => cookie.includes(key))
    if (targetCookie) {
      const [_, value] = targetCookie.split("=");
      return value.trim();
    }
  }

  return null;
}
