import type { CollectionEntry } from "astro:content";


type ComponentProps = {
  books?: CollectionEntry<'books'>[];
}


export const Bookshelf = ({ books }: ComponentProps) => {
  if (!books?.length) {
    return null;
  }

  return (
    <div className="pt-12 pb-24 relative z-40">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Библиотека</h2>
        <p className="mt-2 text-lg leading-8 text-gray-600">
          Learn how to grow your business with our expert advice.
        </p>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto mt-16 grid auto-rows-fr grid-cols-3 sm:grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {books.map((book) => (
            <a href={`/books/${book.slug}`} key={book.id} className="rounded-2xl">
              <article
                className="relative isolate flex flex-col justify-end rounded-2xl overflow-hidden px-8 pb-8 scroll-pt-96 sm:pt-48 lg:pt-80 aspect-[3/4] sm:max-w-xs lg:max-w-none bg-gray-900/10 hover:bg-gray-900/20 transition-all duration-100 ease-in-out transform hover:scale-105 shadow-2xl"
              >
                <img src={book.data.image} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover opacity-90 hover:opacity-100" />

                <h3 className="text-sm lg:text-lg font-semibold leading-6 text-white drop-shadow-sm absolute left-0 right-0 bottom-0 p-8 pt-24 text-balance bg-gradient-to-t from-gray-900/80 via-gray-900/60">
                  <span className="absolute inset-0" />
                  {book.data.title}
                </h3>
              </article>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};
