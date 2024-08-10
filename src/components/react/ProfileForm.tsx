import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from "src/components/react";

import { type Profile } from "./useProfile";


type Props = {
  profileBadge: Profile;
};

const Schema = z.object({
  profile: z.object({
    name: z.string().trim().min(1, { message: "Пожалуйста, введите ваше имя." }).optional(),
  }),
  settings: z.object({
    "notifications:publications": z.boolean(),
  }),
});

type Input = z.infer<typeof Schema>;

export const ProfileForm = ({ profileBadge }: Props) => {
  const [payload, setPayload] = React.useState<Input & { _isHydrating: boolean }>({
    _isHydrating: true,
    profile: {
      name: profileBadge.name,
    },
    settings: {
      "notifications:publications": false,
    },
  });

  const [isSuccess, setIsSuccess] = React.useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<Input>({
    resolver: zodResolver(Schema),
    defaultValues: payload,
  });

  React.useEffect(
    () => {
      (async () => {
        const response = await fetch("/api/profile/", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const { status, payload } = await response.json();
        setPayload(current => ({ _isHydrating: false, ...(status === 'ok' ? payload : current) }));
      })();
    },
    [],
  );

  React.useEffect(
    () => reset({
      profile: {
        ...payload.profile,
        ...(!payload.profile.name ? { name: profileBadge.name } : {}),
      },
      settings: payload.settings,
    }),
    [
      payload,
    ],
  );

  const onSubmit = async (data: Input) => {
    console.log(data);
    // await sleep(1000);
    // const response = await fetch("/api/knock-knock/", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(data),
    // });
    // const { status } = await response.json();
    // if (status === 'ok') {
    //   setIsSuccess(true);
    // }
  }
  const isFormDisabled = isSubmitting || payload._isHydrating;

  return (
    <form className="contents" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="font-semibold">Имя</label>
          <input className="rounded-lg bg-white/80 p-2 ring-2 ring-blob-2 disabled:bg-gray-100 disabled:ring-gray-200" disabled={isFormDisabled} {...register("profile.name")} />
          {errors.profile?.name && <span className="text-red-500 text-sm">{errors.profile.name.message}</span>}

          {!profileBadge.name
            ? (
              <div className="text-sm text-slate-600">
                Прежде чем иметь возможность оставлять комментарии, пожалуйста,
                представтесь.
              </div>
            )
            : null
          }
        </div>

        <h2 className="mt-6 text-lg font-medium leading-7">Оповещения</h2>

        <div className="space-y-6">
          <fieldset>
            <div className="space-y-6">
              <div className="relative flex gap-x-3">
                <div className="flex h-6 items-center">
                  <input
                    id="notifications:publications"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    disabled={isFormDisabled}
                    {...register("settings.notifications:publications")}
                  />
                </div>
                <label htmlFor="notifications:publications" className="text-sm leading-6">
                  <div className="font-medium">Публикации и видео</div>
                  <p className="text-gray-500">
                    Получайте уведомления о выходе новых публикаций.
                  </p>
                </label>
              </div>
            </div>
          </fieldset>
        </div>
      </div>

      <div className="border-b-1 flex-grow" />

      <div className="flex items-center gap-4">
        <Button className="my-primary-button" loading={isSubmitting} disabled={payload._isHydrating}>Сохранить</Button>
        <a href="/" className="my-button-text">На главную</a>
      </div>
    </form>
  );
}
