import { fields, collection } from '@keystatic/core';


export const posts = collection({
  label: 'Posts',
  slugField: 'title',
  path: 'src/content/posts/*',
  format: { contentField: 'content' },
  schema: {
    title: fields.slug({ name: { label: 'Title' } }),
    content: fields.document({
      label: 'Content',
      formatting: true,
      dividers: true,
      links: true,
      images: true,
    }),
  },
});
