export const prerender = false;

export async function GET() {
  const number = Math.random();
  Response.json({ number, message: `Here's a random number: ${number}` });
}
