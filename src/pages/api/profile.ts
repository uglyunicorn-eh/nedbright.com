import type { APIContext } from "astro";

export const prerender = false;

export async function GET({ locals, cookies }: APIContext) {
  return Response.json({
    status: 'ok',
    cookies,
  });
}
