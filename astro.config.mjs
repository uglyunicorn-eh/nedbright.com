import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import markdoc from "@astrojs/markdoc";
import cloudflare from "@astrojs/cloudflare";
import sitemap from "@astrojs/sitemap";
import keystatic from '@keystatic/astro';

import robotsTxt from "astro-robots-txt";

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind(),
    react(),
    markdoc(),
    keystatic(),
    sitemap(),
    robotsTxt({
      policy: [
        { userAgent: "*", allow: "/" },
      ],
    }),
  ],
  output: 'hybrid',
  adapter: cloudflare(),
  site: "https://ng.nedbright.com"
});
