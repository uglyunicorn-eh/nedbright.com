import { z } from "zod";

import { zodiac } from "src/utils/zodiac";

export const prerender = false;

const _ = z.object;

const QueryProfileSchema = {
  payload: _({
    profile: _({
      email: z.string().email(),
      name: z.string().optional(),
    }),
    settings: _({
      "notifications:publications": z.boolean(),
    }),
  }).strict(),
};

const UpdateProfileSchema = {
  input: _({
    profile: _({
      name: z.string().trim().min(1).optional(),
    }),
    settings: z.object({
      "notifications:publications": z.boolean().optional(),
    }),
  }).strict(),
};

export const GET = zodiac()
  .protected()
  .output(QueryProfileSchema)
  .handle(
    async ctx => {
      const { idToken, ok } = ctx;

      const payload = {
        profile: {
          email: idToken.sub,
          name: undefined,
        },
        settings: {
          "notifications:publications": false,
        },
      };

      return ok(payload);
    }
  );

export const PUT = zodiac()
  .protected()
  .input(UpdateProfileSchema)
  .handle(
    async ctx => {
      const { input, idToken, ok } = ctx;

      console.log({ input, idToken });

      return ok();
    }
  );
