import type { APIContext } from "astro";

export const prerender = false;

export async function GET({ request }: APIContext) {
  const cookieString = request.headers.get("Cookie");
  if (!cookieString) {
    return Response.json({ status: 'error', message: 'Unauthorized' }, { status: 401 });
  }
  const idToken = getCookie(cookieString, "X-Identity-Badge");
  return Response.json({
    status: 'ok',
    idToken,
  });
}

function getCookie(cookieString: string, key: string) {
  if (cookieString) {
    const allCookies = cookieString.split("; ")
    const targetCookie = allCookies.find(cookie => cookie.includes(key))
    if (targetCookie) {
      const [_, value] = targetCookie.split("=");
      return (value || "").trim() || null;
    }
  }

  return null;
}
