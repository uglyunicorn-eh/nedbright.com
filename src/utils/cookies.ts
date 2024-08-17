export function getCookie(cookieString: string, key: string) {
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
