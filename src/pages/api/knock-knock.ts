import { Buffer } from 'node:buffer';
import * as jose from "jose";
import { z } from "zod";
import { createHmac } from 'node:crypto';

import { zodiac } from 'src/utils/zodiac';

export const prerender = false;

const _ = z.object;

const KnockKnockTokenSchema = _({
  cty: z.literal("X-Knock-Knock"),
  sub: z.string().email(),
});

type KnockKnockToken = z.infer<typeof KnockKnockTokenSchema>;

type User = {
  iat: number;
  sub: string;
  name?: string;
  'replybox:sso'?: {
    hash: string;
    payload: string;
  },
};


const SignInSchema = {
  input: _({
    token: z.string(),
  }).strict(),
};

export const GET = zodiac()
  .input(SignInSchema)
  .use('auth')
  .use('tokens')
  .use('site')
  .handle(
    async ctx => {
      const { input: { token }, locals, jwtVerify, issueIdentityBadge, setCookie, makeUrl, redirect } = ctx;
      const {
        Users,
      } = locals.runtime.env;

      try {
        const knockKnockToken = await jwtVerify<KnockKnockToken>(token);

        const at = Date.now();

        const iat = Math.floor(at / 1000);
        const sub = knockKnockToken.payload.sub;

        let user: User | null = await Users.get(sub, { type: 'json' });

        if (!user) {
          user = { iat, sub, name: undefined, 'replybox:sso': undefined };
          await Users.put(sub, JSON.stringify(user));
        }

        const maxAge = 60 * 60 * 24 * 30;
        const expires = new Date(at + maxAge * 1000);

        setCookie('X-Identity-Badge', await issueIdentityBadge({ sub, iat }), expires, maxAge);

        const payload = Buffer.from(JSON.stringify({
          user: {
            name: "Pavel Reznikov",
            email: "pashka.reznikov@gmail.com",
          },
          login_url: makeUrl('/profile/'),
        })).toString('base64');

        const {
          DOMAIN,
        } = locals.runtime.env;
        const PRIVATE_KEY = await jose.importPKCS8(locals.runtime.env.PRIVATE_KEY.replaceAll('\\n', '\n'), "RS256");
        const profile = (
          await new jose
            .SignJWT({
              iss: DOMAIN,
              aud: DOMAIN,
              iat,
              name: user.name ?? "Pavel Reznikov",
              "replybox:sso": user['replybox:sso'] ?? {
                hash: createHmac('sha256', locals.runtime.env.REPLYBOX_SECRET_KEY).update(payload).digest('hex'),
                payload,
              },
            })
            .setProtectedHeader({
              alg: "RS256",
              typ: "JWT",
              cty: "X-Profile-Badge",
            })
            .sign(PRIVATE_KEY)
        );

        setCookie('X-Profile-Badge', profile, expires, maxAge);

        return redirect(user.name ? "/" : "/profile/", 307);
      }
      catch {
        return redirect('/401/', 307);
      }
    }
  );


const SignInRequestSchema = {
  input: _({
    email: z.string().email(),
  }).strict(),
};

export const POST = zodiac()
  .input(SignInRequestSchema)
  .use('auth')
  .use('sendgrid')
  .use('site')
  .handle(
    async ctx => {
      const { input: { email }, issueSignInToken, sendgridSend, makeUrl, ok } = ctx;

      const link = makeUrl('/api/knock-knock/', { token: await issueSignInToken({ sub: email }) });
      await sendgridSend(email, "SIGN_IN", { link });

      return ok();
    }
  );
