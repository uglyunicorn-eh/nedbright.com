import { fields } from '@keystatic/core';

export const menus = {
  label: 'Menus',
  schema: {
    top: fields.array(
      fields.object({
        label: fields.text({ label: 'Label' }),
        url: fields.url({ label: 'URL' }),
      }),
      {
        label: 'Top Navigation Menu',
      }
    ),
    footer: fields.array(
      fields.object({
        section: fields.text({ label: 'Section' }),
        items: fields.array(
          fields.object({
            label: fields.text({ label: 'Label' }),
            url: fields.url({ label: 'URL' }),
          }),
          {
            label: 'Menu Item',
            itemLabel: (props) => props.fields.label.value,
          }
        ),
      }),
      {
        label: 'Footer Menu',
        itemLabel: (props) => `${props.fields.section.value} (${props.fields.items.elements.length} items)`,
      }
    ),
  },
};
