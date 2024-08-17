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
  .use('replybox')
  .handle(
    async ctx => {
      const { input: { token }, locals, jwtVerify, issueIdentityBadge, setCookie, redirect, sso: replyboxSSO } = ctx;
      const {
        Users,
      } = locals.runtime.env;

      try {
        const knockKnockToken = await jwtVerify<KnockKnockToken>(token);

        const at = Date.now();
        const iat = Math.floor(at / 1000);
        const sub = knockKnockToken.payload.sub;

        let user = await Users.get<User>(sub, { type: 'json' });

        if (!user) {
          user = { iat, sub };
          await Users.put(sub, JSON.stringify(user));
        }

        const maxAge = 60 * 60 * 24 * 30;
        const expires = new Date(at + maxAge * 1000);

        setCookie('X-Identity-Badge', await issueIdentityBadge({ sub, iat }), expires, maxAge, true);

        const {
          PUBLIC_DOMAIN,
          PRIVATE_KEY,
        } = locals.runtime.env;
        const profile = (
          await new jose
            .SignJWT({
              iss: PUBLIC_DOMAIN,
              aud: PUBLIC_DOMAIN,
              iat: user.iat,
              name: user.name ?? null,
              "replybox:sso": await replyboxSSO(user),
            })
            .setProtectedHeader({
              alg: "RS256",
              typ: "JWT",
              cty: "X-Profile-Badge",
            })
            .sign(
              await jose.importPKCS8(PRIVATE_KEY.replaceAll('\\n', '\n'), "RS256"),
            )
        );

        setCookie('X-Profile-Badge', profile, expires, maxAge, false);

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
