export const sample = <T>(items: Array<T>) => items ? items[Math.floor(Math.random() * items.length)] : undefined;

export const readingTime = (text: string, wpm?: number = 225) => {
  const words = text.trim().split(/\s+/).length;
  const time = Math.ceil(words / wpm);
  return time;
}
