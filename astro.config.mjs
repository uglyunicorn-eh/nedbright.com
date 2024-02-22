import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import markdoc from "@astrojs/markdoc";
import cloudflare from "@astrojs/cloudflare";
import sitemap from "@astrojs/sitemap";
import keystatic from '@keystatic/astro';
import robotsTxt from "astro-robots-txt";

import webmanifest from "astro-webmanifest";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), react(), markdoc(), keystatic(), sitemap(), robotsTxt({
    policy: [{
      userAgent: "*",
      allow: "/"
    }]
  }), webmanifest({
    name: "Жить среди людей",
    icon: "src/assets/favicon.svg",
    theme_color: "#cfbcdc",
  })],
  output: 'hybrid',
  adapter: cloudflare(),
  site: "https://ng.nedbright.com",
});
