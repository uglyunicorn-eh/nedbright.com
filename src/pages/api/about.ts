import type { APIContext } from "astro";

export async function GET({ locals }: APIContext) {
  return Response.json({
    status: 'ok',
    service: {
      publicKey: locals.runtime?.env.PUBLIC_KEY.replaceAll('\\n', '\n'),
    },
  });
}
