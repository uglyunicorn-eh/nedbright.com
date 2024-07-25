import { fields, collection } from '@keystatic/core';


export default collection({
  label: 'Writings',
  slugField: 'title',
  path: 'src/content/writings/*/',
  entryLayout: 'content',
  format: { contentField: 'content' },
  columns: ['title', 'date'],
  schema: {
    title: fields.slug({ name: { label: 'Title' } }),
    cover: fields.url({ label: 'Cover Image URL (Unsplash)' }),
    date: fields.date({
      label: 'Publication Date',
      defaultValue: { kind: 'today' },
      validation: {
        isRequired: true,
      },
    }),
    headline: fields.text({
      label: 'Headline',
      multiline: true,
    }),
    content: fields.markdoc({
      label: 'Content',
    }),
  },
});
