import { type Entry } from '@keystatic/core/reader';
import keystaticConfig from 'keystatic.config';

import { reader } from "src/reader";

export type Collections = {
  books: Entry<typeof keystaticConfig['collections']['books']>,
  writings: Entry<typeof keystaticConfig['collections']['writings']>,
};

export const getCollection = async <K extends keyof Collections>(collectionName: K) => {
  return await reader.collections[collectionName].all();
}
