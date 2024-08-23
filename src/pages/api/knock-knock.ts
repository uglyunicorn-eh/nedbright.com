import * as jose from "jose";
import { z } from "zod";

import { zodiac } from 'src/utils/zodiac';
import { getCookie } from "src/utils/cookies";
import type { ReturnToToken } from "src/utils/auth";

export const prerender = false;

const _ = z.object;

const KnockKnockTokenSchema = _({
  cty: z.literal("X-Knock-Knock"),
  sub: z.string().email(),
  next: z.string().url().optional(),
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
  .handle(
    async ctx => {
      const { input: { token }, locals, jwtVerify, signUserIn, redirect } = ctx;
      const {
        Users,
      } = locals.runtime.env;

      try {
        const knockKnockToken = await jwtVerify<KnockKnockToken>(token);

        const sub = knockKnockToken.payload.sub;
        let user = await Users.get<User>(sub, { type: 'json' });

        if (!user) {
          const iat = Math.floor(Date.now() / 1000);
          user = { iat, sub };
          await Users.put(sub, JSON.stringify(user));
        }
        await signUserIn(user);

        return redirect(user.name ? knockKnockToken.payload.next ?? "/" : "/profile/", 307);
      }
      catch (err) {
        console.error(err);
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
      const { input: { email }, issueSignInToken, sendgridSend, makeUrl, ok, request, locals, deleteCookie } = ctx;
      const {
        PUBLIC_DOMAIN,
        PUBLIC_KEY,
      } = locals.runtime.env;
      let next: string | undefined;

      const cookieString = request.headers.get("Cookie");
      const returnToValue = getCookie(cookieString || "", "X-Return-To");

      if (returnToValue) {
        const returnTo = await jose.jwtVerify<ReturnToToken>(
          returnToValue,
          await jose.importSPKI(PUBLIC_KEY.replaceAll('\\n', '\n'), "RS256"),
          {
            audience: PUBLIC_DOMAIN,
            issuer: PUBLIC_DOMAIN,
            typ: "JWT",
          },
        );
        if (returnTo.protectedHeader.cty === "X-Return-To") {
          next = returnTo.payload.url;
        }
        deleteCookie("X-Return-To");
      }

      const link = makeUrl('/api/knock-knock/', { token: await issueSignInToken({ sub: email.toLowerCase(), next }) });
      await sendgridSend(email, "SIGN_IN", { link });

      return ok();
    }
  );
