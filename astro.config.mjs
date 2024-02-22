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
    icons: [
      {
        "src": "src/assets/maskable_icon.png",
        "sizes": "1024x1024",
        "type": "image/png",
        "purpose": "maskable"
      },
      {
        "src": "src/assets/maskable_icon_x96.png",
        "sizes": "96x96",
        "type": "image/png",
        "purpose": "maskable"
      },
      {
        "src": "src/assets/maskable_icon_x128.png",
        "sizes": "128x128",
        "type": "image/png",
        "purpose": "maskable"
      },
      {
        "src": "src/assets/maskable_icon_x192.png",
        "sizes": "192x192",
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
