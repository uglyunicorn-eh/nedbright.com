import { fields } from '@keystatic/core';

export const site = {
  label: 'Site',
  schema: {
    title: fields.text({ label: 'Title' }),
    description: fields.text({ label: 'Description', multiline: true }),
    footerNote: fields.text({ label: 'Footer Note', multiline: true }),
    copy: fields.text({ label: 'Copyrights' }),

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