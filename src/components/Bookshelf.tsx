import type { CollectionEntry } from "astro:content";
import { Image } from 'astro:assets';


type ComponentProps = {
  books?: CollectionEntry<'books'>[];
}


export const Bookshelf = ({ books }: ComponentProps) => {
  if (!books?.length) {
    return null;
  }

  return (
    <div className="pt-12 pb-32 relative z-40">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          <a href="/books" className="hover:text-gray-700">Библиотека</a>
        </h2>
        <p className="mt-2 text-gray-600 text-balance">
          Здесь вы найдете книги, рабочие тетради и другие материалы для самостоятельного изучения и практики.
        </p>
      </div>

      <div className="flex flex-col px-16 gap-16">
        <div className="mx-auto mt-16 flex gap-12 justify-items-center">
          {books.slice(0, 3).map((book) => (
            <a href={`/books/${book.slug}`} key={book.id} className="rounded-2xl">
              <article
                className="relative isolate flex flex-col justify-end rounded-2xl lg:w-72 overflow-hidden scroll-pt-96 sm:pt-48 lg:pt-80 aspect-[3/4] bg-gray-900/10 hover:bg-gray-900/20 transition-all duration-100 ease-in-out transform hover:scale-105 shadow-2xl"
              >
                <Image src={book.data.image} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover opacity-90 hover:opacity-100 transition-all duration-300 hover:scale-105 bg-blob-3" />

                <h3 className="text-sm lg:text-lg font-semibold leading-6 text-white absolute left-0 right-0 bottom-0 p-8 pt-24 text-balance bg-gradient-to-t from-gray-900/90 via-gray-900/70 pointer-events-none rounded-b-2xl">
                  {book.data.title}
                </h3>
              </article>
            </a>
          ))}
        </div>

        <div className="flex justify-center">
          <a
            href={`/books`}
            className="rounded-full ring-indigo-600/60 hover:ring-indigo-600 shadow-indigo-600 hover:bg-indigo-600/5 ring-2 px-6 py-2.5 text-indigo-600"
          >
            Все книги и материалы
          </a>
        </div>
      </div>
    </div>
  );
};
