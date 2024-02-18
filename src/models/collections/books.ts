import { fields, collection } from '@keystatic/core';

export default collection({
  label: 'Books',
  slugField: 'title',
  path: 'content/books/*',
  entryLayout: 'content',
  format: { contentField: 'content' },
  columns: ['title', 'isFeatured'],
  schema: {
    image: fields.image({ label: 'Image', validation: { isRequired: true } }),
    title: fields.slug({ name: { label: 'Title' } }),
    isFeatured: fields.checkbox({ label: 'Featured' }),
    headline: fields.document({
      label: 'Headline',
      formatting: true,
      links: true,
    }),
    link: fields.url({ label: 'Link' }),
    content: fields.document({
      label: 'Content',
      formatting: true,
      dividers: true,
      links: true,
      images: true,
    }),
    testimonies: fields.array(
      fields.object({
        quote: fields.text({
          label: 'Quote',
          multiline: true,
        }),
        author: fields.text({ label: 'Author' }),
        isFeatured: fields.checkbox({ label: 'Featured' }),
      }),
      {
        label: 'Testimonies',
        itemLabel: (props) => `${props.fields.quote.value} by ${props.fields.author.value || 'Anonymous'}`,
      }
    ),
  },
});

export type BookModel = {
  title: string;
  isFeatured: boolean;
  link: string;
};
