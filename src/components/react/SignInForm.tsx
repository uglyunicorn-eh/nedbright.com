import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import React from "react";

const Schema = z.object({
  email: z.string().email("Введен некорректый емейл"),
});

type Input = z.infer<typeof Schema>;

export const SignInForm = () => {
  const [isSuccess, setIsSuccess] = React.useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Input>({
    resolver: zodResolver(Schema),
  });
  const onSubmit = async (data: Input) => {
    const response = await fetch("/api/knock-knock/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const { status } = await response.json();
    if (status === 'ok') {
      setIsSuccess(true);
    }
  }

  return isSuccess ?
    (
      <div className="flex flex-col gap-4 h-full">
        <div className="text-slate-600">
          Мы отправили вам ссылку для подтверждения на ваш емейл. Пожалуйста, проверьте почту.
        </div >

        <div className="border-b-1 flex-grow"></div>

        <div className="flex items-center gap-8">
          <a href="/" className="my-primary-button">На главную</a>
        </div>
      </div>
    )
    : (
      <form className="contents" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-4">
          <div className="text-sm text-slate-600">
            Прежде чем продолжить, укажите ваш емейл и мы пришлем вам ссылку для подтверждения.
          </div >


          <div className="flex flex-col gap-2">
            <label className="font-semibold">Емейл</label>
            <input className="rounded-lg bg-white/80 p-2 ring-2 ring-blob-2" disabled={isSubmitting} {...register("email")} />
            {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
          </div>
        </div >

        <div className="border-b-1 flex-grow"></div>

        <div className="flex items-center gap-8">
          <button className="my-primary-button" disabled={isSubmitting}>Продолжить</button>
          <a href="/" className="underline-offset-2 hover:underline">На главную</a>
        </div>
      </form >
    );
}
