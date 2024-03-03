import { fields } from '@keystatic/core';

export const site = {
  label: 'Site',
  schema: {
    title: fields.text({ label: 'Title' }),
    description: fields.text({ label: 'Description', multiline: true }),
    author: fields.text({ label: 'Author' }),
    footerNote: fields.text({ label: 'Footer Note', multiline: true }),
    copy: fields.text({ label: 'Copyrights' }),

    writings: fields.object({
      title: fields.text({ label: 'Title' }),
      description: fields.text({ label: 'Description', multiline: true }),
      image: fields.image({
        label: 'Cover Image',
        directory: 'src/assets/images/site',
        publicPath: '/assets/images/site',
      }),
    }, {
      label: 'Writings',
    }),

    social: fields.object({
      facebook: fields.url({ label: 'Facebook' }),
      instagram: fields.url({ label: 'Instagram' }),
      twitter: fields.url({ label: 'Twitter' }),
      github: fields.url({ label: 'GitHub' }),
      youtube: fields.url({ label: 'YouTube' }),
      tiktok: fields.url({ label: 'TikTok' }),
    }, {
      label: 'Social Links',
    }),
  },
};
