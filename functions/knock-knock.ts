import { PagesFunction, Response } from "@cloudflare/workers-types";

interface Env {
  // KV: KVNamespace;
}
export const onRequest: PagesFunction<Env> = async (context) => {
  // const value = await context.env.KV.get('example');
  return Response.json({ message: "Who's there?" });
}
