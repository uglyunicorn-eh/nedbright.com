import coverImage from 'public/images/cover.png';
import { GridPattern, StarRating } from 'src/components';

export const BookHero = () => (
  <header className="relative z-10 overflow-hidden lg:bg-transparent shadow-2xl shadow-slate-700/15">
    <div className="mx-auto grid max-w-6xl grid-cols-1 grid-rows-[auto_1fr] gap-y-16 pt-16 md:pt-20 lg:grid-cols-12 lg:gap-y-20 lg:px-3 lg:pb-36 lg:pt-20">
      <div className="relative flex items-start lg:col-span-5 lg:row-span-2">

        <div className="absolute -bottom-12 -top-20 left-0 right-1/2 z-10 rounded-br-6xl bg-blob-2 text-white/10 md:bottom-8 lg:-inset-y-32 lg:left-[-100vw] lg:right-full lg:-mr-40 rounded-br-3xl mb-24">
          <GridPattern
            x="100%"
            y="100%"
            patternTransform="translate(112 64)"
          />
        </div>

        <div className="relative z-10 mx-auto flex w-64 rounded-xl shadow-2xl shadow-black/15 md:w-80 lg:w-96">
          <img className="w-full rounded-md" src={coverImage.src} alt="" />
        </div>

      </div>

      <div className="relative px-4 sm:px-6 lg:col-span-7 lg:pb-14 lg:pl-16 lg:pr-0 xl:pl-20">
        <div className="hidden lg:absolute lg:-top-32 lg:bottom-0 lg:left-[-100vw] lg:right-[-100vw] lg:block lg:bg-slate-100 opacity-25 backdrop-blur-md" />
        <Testimonial />
      </div>

      <div className="pt-16 lg:col-span-7 lg:bg-transparent lg:pl-16 lg:pt-0 xl:pl-20">
        <div className="mx-auto px-4 sm:px-6 md:max-w-2xl md:px-4 lg:px-0 tracking-tight text-balance">
          <h1 className="font-display text-5xl font-extrabold text-slate-900 sm:text-5xl mb-8">
            Живая психология: простые шаги навстречу к себе
          </h1>
          <p className="text-lg mb-6">
            Дорогой мой читатель! В этой книге, я попробовала вооружить нас всех некоторыми идеями, которые помогут нам стать ближе к себе
            и нащупать это равновесие, в котором можно комфортно, пусть и не всегда идеально и гладко, жить.
          </p>

          <div className="my-12 flex gap-4">
            <button
              type="button"
              className="rounded-md bg-indigo-600 px-4 py-2.5 text-lg text-white shadow-lg border border-white/50 shadow-indigo-500/25 hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Перейти к книге
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
);

function Testimonial() {
  return (
    <figure className="relative mx-auto max-w-md text-center lg:mx-0 lg:text-left">
      <div className="flex justify-center text-yellow-500 lg:justify-start">
        <StarRating />
      </div>
      <blockquote className="mt-2">
        <p className="font-display text-sm font-medium text-slate-900">
          “Книга на самом деле заставляет задуматься и обратиться внутрь к своим истинным целям и желаниям.
          А чего хочешь ты на самом деле? Тем кто особенно не знаком с психологией и только погружается в эту
          область обязательно советую к прочтению”
        </p>
      </blockquote>
      {/* <figcaption className="mt-2 text-xs">
        <span className="before:content-['—_']">
          Артем Т., 2020
        </span>
        , Founder at Retail Park
      </figcaption> */}
    </figure>
  )
}
