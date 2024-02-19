import type { CollectionEntry } from "astro:content";

const posts = [
  {
    id: 1,
    title: 'Boost your conversion rate',
    href: '#',
    description:
      'Illo sint voluptas. Error voluptates culpa eligendi. Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. Sed exercitationem placeat consectetur nulla deserunt vel iusto corrupti dicta laboris incididunt.',
    imageUrl:
      'https://images.unsplash.com/photo-1496128858413-b36217c2ce36?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3603&q=80',
    date: 'Mar 16, 2020',
    datetime: '2020-03-16',
    category: { title: 'Marketing', href: '#' },
    author: {
      name: 'Michael Foster',
      role: 'Co-Founder / CTO',
      href: '#',
      imageUrl:
        'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
  },
  // More posts...
]

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
          <div className="mt-16 space-y-20 lg:mt-20 lg:space-y-20">
            {books.map((book) => (
              <article key={book.id} className="relative isolate flex flex-col gap-8 lg:flex-row">
                <div className="relative aspect-[3/4] lg:w-64 lg:shrink-0">
                  <img
                    src={book.data.image}
                    alt={book.data.title}
                    className="absolute inset-0 h-full w-full rounded-2xl bg-gray-50 object-cover"
                  />
                </div>
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
                  {/* <div className="mt-6 flex border-t border-gray-900/5 pt-6">
                    <div className="relative flex items-center gap-x-4">
                      <img src={post.author.imageUrl} alt="" className="h-10 w-10 rounded-full bg-gray-50" />
                      <div className="text-sm leading-6">
                        <p className="font-semibold text-gray-900">
                          <a href={post.author.href}>
                            <span className="absolute inset-0" />
                            {post.author.name}
                          </a>
                        </p>
                        <p className="text-gray-600">{post.author.role}</p>
                      </div>
                    </div>
                  </div> */}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
