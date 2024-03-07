import { defineConfig, squooshImageService } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import markdoc from "@astrojs/markdoc";
import cloudflare from "@astrojs/cloudflare";
import sitemap from "@astrojs/sitemap";
import robotsTxt from "astro-robots-txt";

import keystatic from '@keystatic/astro';

import webmanifest from "astro-webmanifest";

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind(),
    react(),
    markdoc(),
    keystatic(),
    sitemap(),
    robotsTxt({
      policy: [{
        userAgent: "*",
        allow: "/"
      }]
    }),
    webmanifest({
      name: "Жить среди людей",
      start_url: "/",
      icons: [
        {
          "src": "favicon.svg",
          "type": "image/svg+xml",
          "sizes": "144x144",
        },
        {
          "src": "favicon.svg",
          "type": "image/svg+xml",
          "sizes": "512x512",
        },
        {
          "src": "maskable_icon.png",
          "type": "image/png",
          "purpose": "maskable"
        },
      ],
      theme_color: "#f3f4f6",
      background_color: "#f3f4f6",
      display: "standalone",
    }),
  ],
  output: 'hybrid',
  adapter: cloudflare(),
  site: "https://ng.nedbright.com",
  prefetch: true,
  devToolbar: {
    enabled: false,
  },
  // image: squooshImageService(),
  image: {
    // Example: Enable the Sharp-based image service with a custom config
    service: {
      entrypoint: 'astro/assets/services/sharp',
      config: {
        limitInputPixels: false,
      },
    },
  },
});
