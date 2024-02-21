import type { CollectionEntry } from 'astro:content';
import { Image } from 'astro:assets';

import { sample } from 'src/utils';
import { GridPattern, StarRating } from 'src/components';

import BookCover from 'src/components/BookCover.astro';

type ComponentProps = {
  book: CollectionEntry<'books'>;
}

export const FeaturedBookHero = ({ book }: ComponentProps) => {
  const testimonial = sample(book.data.testimonies?.filter((t) => t.isFeatured) || []);

  return (
    <header className="relative z-10 overflow-hidden lg:bg-transparent">
      <div className="mx-auto grid max-w-6xl grid-cols-1 grid-rows-[auto_1fr] gap-y-16 pt-16 md:pt-20 lg:grid-cols-12 lg:gap-y-20 lg:px-3 lg:pb-16 lg:pt-20">
        <div className="relative flex items-start lg:col-span-5 lg:row-span-2">

          <div className="absolute z-10 overflow-hidden rounded-br-6xl bg-blob-2 text-white/15 md:bottom-8 lg:-inset-y-32 lg:left-[-100vw] lg:right-full lg:-mr-40 rounded-br-3xl mb-24">
            <GridPattern />
          </div>

          <div className="relative z-10 mx-auto flex w-64 rounded-xl shadow-2xl bg-blob-3 shadow-black/15 md:w-80 lg:w-96 aspect-[3/4]">
            <a href={`/books/${book.slug}`}>
              <BookCover book={book} />
            </a>
          </div>

        </div>

        {testimonial && (
          <div className="relative px-4 sm:px-6 lg:col-span-7 lg:pb-14 lg:pl-16 lg:pr-0 xl:pl-20">
            <div className="hidden lg:absolute lg:-top-32 lg:bottom-0 lg:left-[-100vw] lg:right-[-100vw] lg:block lg:bg-slate-100 opacity-25 backdrop-blur-md" />
            <Testimonial testimonial={testimonial} />
          </div>
        )}

        <div className="pt-16 lg:col-span-7 lg:bg-transparent lg:pl-16 lg:pt-0 xl:pl-20">
          <div className="mx-auto px-4 sm:px-6 md:max-w-2xl md:px-4 lg:px-0 tracking-tight text-balance">

            <h1 className="font-display text-5xl font-extrabold text-slate-900 sm:text-5xl mb-8">
              <a href={`/books/${book.slug}`}>
                {book.data.title}
              </a>
            </h1>

            {book.data.headline && (
              <p className="text-lg mb-6">
                {book.data.headline}
              </p>
            )}

            <div className="my-12 flex gap-4">
              <a
                href={`/books/${book.slug}`}
                className="rounded-md bg-indigo-600 px-6 py-3 text-xl text-white shadow-lg border border-white/50 shadow-indigo-500/25 hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Перейти к книге
              </a>

            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

function Testimonial({ testimonial }: {
  testimonial: {
    quote?: string | undefined;
    author?: string | undefined;
    showAuthor?: boolean | undefined;
    isFeatured?: boolean | undefined;
  },
}) {
  return (
    <figure className="relative mx-auto max-w-md text-center lg:mx-0 lg:text-left">
      <div className="flex justify-center text-yellow-500 lg:justify-start">
        <StarRating />
      </div>

      {testimonial?.quote && (
        <blockquote className="mt-2">
          <p className={`font-display text-sm font-medium text-slate-900 before:content-['«'] after:content-['»']`}>
            {testimonial.quote}
          </p>
        </blockquote>
      )}

      {testimonial?.showAuthor && testimonial?.author && (
        <figcaption className="mt-2 text-xs before:content-['—_']">
          {testimonial?.author}
        </figcaption>
      )}
    </figure>
  )
}
