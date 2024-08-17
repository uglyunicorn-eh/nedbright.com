import { z } from "zod";

import { zodiac } from "src/utils/zodiac";

export const prerender = false;

const _ = z.object;


const QueryProfileSchema = {
  payload: _({
    profile: _({
      email: z.string().email(),
      name: z.string().nullable(),
    }),
    settings: _({
      "notifications:publications": z.boolean(),
    }),
  }).strict(),
};

export const GET = zodiac()
  .protected()
  .output(QueryProfileSchema)
  .handle(
    async ctx => {
      const { locals, idToken, ok } = ctx;
      const {
        Users,
      } = locals.runtime.env;

      const user = await Users.get<User>(idToken.sub, { type: 'json' });

      const payload = {
        profile: {
          email: idToken.sub,
          name: user?.name || null,
        },
        settings: {
          "notifications:publications": false,
          ...user?.settings,
        },
      };

      return ok(payload);
    }
  );


const UpdateProfileSchema = {
  input: _({
    profile: _({
      name: z.string().trim().min(1).optional(),
    }).optional(),
    settings: z.object({
      "notifications:publications": z.boolean().optional().default(false),
    }).optional(),
  }).strict(),
};

export const PUT = zodiac()
  .protected()
  .input(UpdateProfileSchema)
  .use('auth')
  .use('site')
  .handle(
    async ctx => {
      const { locals, input, idToken, ok, setCookie, issueIdentityBadge, issueProfileBadge } = ctx;
      const {
        Users,
      } = locals.runtime.env;

      const at = Date.now();
      const iat = Math.floor(at / 1000);
      const sub = idToken.sub;

      const user = await Users.get<User>(sub, { type: 'json' }) || { iat, sub };

      if (input.profile?.name) {
        user.name = input.profile.name;
      }
      if (input.settings) {
        user.settings = {
          ...(user.settings || {}),
          ...input.settings,
        }
      }

      await Users.put(sub, JSON.stringify(user));

      const maxAge = 60 * 60 * 24 * 30;
      const expires = new Date(at + maxAge * 1000);
      setCookie('X-Identity-Badge', await issueIdentityBadge(user), expires, maxAge, true);
      setCookie('X-Profile-Badge', await issueProfileBadge(user), expires, maxAge, false);

      return ok();
    }
  );
