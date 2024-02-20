import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import markdoc from "@astrojs/markdoc";
import cloudflare from "@astrojs/cloudflare";
import sitemap from "@astrojs/sitemap";

import keystatic from '@keystatic/astro';

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), react(), markdoc(), keystatic(), sitemap()],
  output: 'hybrid',
  adapter: cloudflare(),
  site: import.meta.env.SITE_URL,
});
