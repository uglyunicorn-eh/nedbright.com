import { fields, collection } from '@keystatic/core';

export default collection({
  label: 'Books',
  slugField: 'title',
  path: 'src/content/books/*/',
  entryLayout: 'content',
  format: { contentField: 'content' },
  columns: ['title', 'isFeatured', 'priority', 'link'],
  schema: {
    image: fields.image({
      label: 'Cover Image',
      validation: { isRequired: true },
      directory: 'src/assets/images/books',
      publicPath: '../../../assets/images/books',
    }),
    title: fields.slug({ name: { label: 'Title' } }),
    isFeatured: fields.checkbox({ label: 'Featured' }),
    headline: fields.text({
      label: 'Headline',
      multiline: true,
    }),
    link: fields.url({ label: 'Link' }),
    priority: fields.number({ label: 'Priority', defaultValue: 0 }),
    content: fields.markdoc({
      label: 'Content',
    }),
    testimonies: fields.array(
      fields.object({
        quote: fields.text({
          label: 'Quote',
          multiline: true,
        }),
        author: fields.text({ label: 'Author' }),
        showAuthor: fields.checkbox({ label: 'Show Author' }),
        isFeatured: fields.checkbox({ label: 'Featured' }),
      }),
      {
        label: 'Testimonies',
        itemLabel: (props) => `${props.fields.quote.value} by ${props.fields.author.value || 'Anonymous'}`,
      }
    ),
  },
});
