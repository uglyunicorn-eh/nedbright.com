import { z, ZodError } from "zod";

import type { APIContext } from 'astro';

export const prerender = false;

export async function GET() {
  const number = Math.random();
  return Response.json({ number, message: `Here's a random number: ${number}` });
}

const Input = z.object({
  email: z.string().email(),
});

export async function POST({ request }: APIContext) {
  try {
    const { email } = Input.parse(await request.json());

    return Response.json({ status: 'ok', email });
  }
  catch (error) {
    if (error instanceof ZodError) {
      return Response.json({ status: 'error', errors: error.errors }, { status: 400 });
    }
    return Response.json({ status: '0xdeadbeef' }, { status: 400 });
  }
}
