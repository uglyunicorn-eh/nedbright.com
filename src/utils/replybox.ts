import { Buffer } from 'node:buffer';
import { createHmac } from 'node:crypto';
import type { APIContext } from "astro";


export const generateReplyboxSSO = async ({ name, email, login_url }: { name?: string | null, email: string, login_url: string }, { locals }: Pick<APIContext, 'locals'>) => {
  const {
    REPLYBOX_SECRET_KEY,
  } = locals.runtime.env;

  if (!name) {
    return null;
  }

  const payload = Buffer.from(JSON.stringify({ user: { name, email }, login_url })).toString('base64');
  const hash = createHmac('sha256', REPLYBOX_SECRET_KEY).update(payload).digest('hex');

  return { hash, payload };
}
