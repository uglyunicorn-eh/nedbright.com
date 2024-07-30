import type { APIContext } from "astro";

export const prerender = false;

export async function GET({ locals, request }: APIContext) {
  const cookieString = request.headers.get("Cookie")
  const idToken = getCookie(cookieString, "X-Identity-Badge");
  return Response.json({
    status: 'ok',
    idToken,
  });
}

/**
 * Takes a cookie string
 * @param {String} cookieString - The cookie string value: "val=key; val2=key2; val3=key3;"
 * @param {String} key - The name of the cookie we are reading from the cookie string
 * @returns {(String|null)} Returns the value of the cookie OR null if nothing was found.
 */
function getCookie(cookieString, key) {
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
