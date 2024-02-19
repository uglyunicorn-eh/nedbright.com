import type { CollectionEntry } from "astro:content";


type ComponentProps = {
  books?: CollectionEntry<'books'>[];
}

export const BooksList = ({ books }: ComponentProps) => {
  if (!books?.length) {
    return null;
  }

  return (
    <div className="pb-24 sm:pb-32 z-40 relative text-balance">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-4xl">
          <div className="mt-16 space-y-20 lg:space-y-20">
            {books.map((book) => (
              <article key={book.id} className="relative isolate flex flex-col gap-8 lg:flex-row">
                <a href={`/books/${book.slug}`} className="relative block aspect-[3/4] lg:w-64 lg:shrink-0">
                  <img
                    src={book.data.image}
                    alt={book.data.title}
                    className="absolute inset-0 h-full w-full rounded-2xl bg-gray-50 object-cover"
                  />
                </a>
                <div>
                  <div className="group relative max-w-xl">
                    <h3 className="mt-3 text-lg font-semibold leading-6">
                      <a href={`/books/${book.slug}`}>
                        {book.data.title}
                      </a>
                    </h3>
                    <p className="mt-5 leading-6">{book.data.headline}</p>
                    <p className="mt-5 leading-6">
                      <a href={`/books/${book.slug}`} className="text-indigo-600 hover:text-indigo-500 font-semibold hover:pl-1 transition-all duration-75">
                        Подробнее &rarr;
                      </a>
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
