import { z } from "zod";

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

        return redirect(user.name ? "/" : "/profile/", 307);
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
      const { input: { email }, issueSignInToken, sendgridSend, makeUrl, ok } = ctx;

      const link = makeUrl('/api/knock-knock/', { token: await issueSignInToken({ sub: email.toLowerCase() }) });
      await sendgridSend(email, "SIGN_IN", { link });

      return ok();
    }
  );
