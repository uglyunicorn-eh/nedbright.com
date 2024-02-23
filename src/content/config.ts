import { defineCollection, z } from 'astro:content';

export const collections = {
  'books': defineCollection({
    type: 'content',
    schema: ({ image }) =>
      z.object({
        image: image(),
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
  }),

  'writings': defineCollection({
    type: 'content',
    schema: ({ image }) =>
      z.object({
        title: z.string().optional(),
        headline: z.string().optional(),
        date: z.string().optional(),
      }),
  }),
};
