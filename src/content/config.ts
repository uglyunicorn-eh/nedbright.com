import { defineCollection, z } from 'astro:content';

const booksCollection = defineCollection({
  type: 'content',
  schema: z.object({
    image: z.string().optional(),
    title: z.string().optional(),
    isFeatured: z.boolean().optional(),
    headline: z.string().optional(),
    link: z.string().optional(),
    testimonies: z.array(z.object({
      quote: z.string().optional(),
      author: z.string().optional(),
      showAuthor: z.boolean().optional(),
      isFeatured: z.boolean().optional(),
    })).optional(),
  }),
});

export const collections = {
  'books': booksCollection,
};
