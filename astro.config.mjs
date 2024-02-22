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
    start_url: "/",
    icon: "/favicon.svg",
    icons: [
      {
        "src": "/favicon.svg",
        "sizes": "144x144",
      },
      {
        "src": "/maskable_icon.png",
        "type": "image/png",
        "purpose": "maskable"
      },
    ],
    theme_color: "#cfbcdc",
    background_color: "#cfbcdc",
    display: "standalone",
  })],
  output: 'hybrid',
  adapter: cloudflare(),
  site: "https://ng.nedbright.com",
});
