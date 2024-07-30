import type { APIContext } from "astro";

export const prerender = false;

export async function GET({ request }: APIContext) {
  const cookieString = request.headers.get("Cookie");
  const idToken = getCookie(cookieString || "", "X-Identity-Badge");
  if (!idToken) {
    return Response.json({ status: 'error', message: 'Unauthorized' }, { status: 401 });
  }
  return Response.json({
    status: 'ok',
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
