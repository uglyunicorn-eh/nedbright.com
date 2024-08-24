import { z } from "zod";

import { zodiac } from "src/utils/zodiac";
import { subscribe, unsubscribe } from "src/utils/sendgrid";

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
  .handle(
    async ctx => {
      const { locals, input, idToken, ok, signUserIn } = ctx;
      const {
        Users,
      } = locals.runtime.env;

      const at = Date.now();
      const iat = Math.floor(at / 1000);
      const sub = idToken.sub;

      const user = await Users.get<User>(sub, { type: 'json' }) || { iat, sub };
      let nameChanged = false;

      if (input.profile?.name) {
        nameChanged = user.name !== input.profile.name;
        user.name = input.profile.name;
      }
      let settingsDiff: UserSettings = {};
      if (input.settings) {
        Object
          .keys(input.settings)
          .forEach(key => {
            const k = key as keyof UserSettings;
            if (user.settings?.[k] !== input.settings![k]) {
              settingsDiff[k] = input.settings![k];
            }
          });
        user.settings = {
          ...(user.settings || {}),
          ...input.settings,
        }
      }

      await Users.put(sub, JSON.stringify(user));

      if (nameChanged || settingsDiff["notifications:publications"] !== undefined) {
        if (nameChanged || settingsDiff["notifications:publications"]) {
          await subscribe(user, { locals });
        }
        else if (settingsDiff["notifications:publications"] === false) {
          await unsubscribe(user, { locals });
        }
      }

      await signUserIn(user);

      return ok();
    }
  );
