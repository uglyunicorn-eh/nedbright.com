import { defineCollection, z, type CollectionEntry } from 'astro:content';

const testimoniesSchema = z.object({
  quote: z.string().optional(),
  author: z.string().optional(),
  showAuthor: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
});

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
        testimonies: z.array(testimoniesSchema).optional(),
        priority: z.number().optional(),
      }),
  }),

  'writings': defineCollection({
    type: 'content',
    schema: () =>
      z.object({
        title: z.string().optional(),
        headline: z.string().optional(),
        date: z.string().optional(),
      }),
  }),
};

export type Testimony = z.infer<typeof testimoniesSchema>;
export type Book = CollectionEntry<"books">;
export type Writing = CollectionEntry<"writings">;
