import logo from "/logo-hd.svg?url";


export const ProfilePanel = () => {
  return (
    <div
      className="flex h-full flex-col gap-4 rounded-3xl bg-white/50 p-8 shadow-2xl shadow-black/30 backdrop-blur-lg"
    >
      <img src={logo} alt="Logo" className="mx-auto mb-10 h-64" />

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="font-semibold">Имя</label>
          <input className="rounded-lg bg-white/80 p-2 ring-2 ring-blob-2" />
          <div className="text-sm text-slate-600">
            Прежде чем иметь возможность оставлять комментарии, пожалуйста,
            представтесь.
          </div>
        </div>

        <h2 className="mt-6 text-lg font-medium leading-7">Оповещения</h2>

        <div className="space-y-6">
          <fieldset>
            <div className="space-y-6">
              <div className="relative flex gap-x-3">
                <div className="flex h-6 items-center">
                  <input
                    id="comments"
                    name="comments"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                </div>
                <div className="text-sm leading-6">
                  <label htmlFor="comments" className="font-medium">Публикации и видео</label>
                  <p className="text-gray-500">
                    Получайте уведомления о выходе новых публикаций.
                  </p>
                </div>
              </div>
            </div>
          </fieldset>
        </div>
      </div>

      <div className="border-b-1 flex-grow"></div>

      <div className="flex items-center gap-8">
        <button className="my-primary-button">Сохранить</button>
        <a href="/" className="underline-offset-2 hover:underline">На главную</a>
      </div>
    </div>
  );
};
