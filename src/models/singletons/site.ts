import { fields } from '@keystatic/core';

export const site = {
  label: 'Site',
  schema: {
    title: fields.text({ label: 'Title' }),
    description: fields.text({ label: 'Description', multiline: true }),
  },
};
