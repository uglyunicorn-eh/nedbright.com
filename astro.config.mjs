import { defineConfig, squooshImageService } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import markdoc from "@astrojs/markdoc";
import cloudflare from "@astrojs/cloudflare";
import sitemap from "@astrojs/sitemap";
import robotsTxt from "astro-robots-txt";
import keystatic from '@keystatic/astro';
import webmanifest from "astro-webmanifest";

// import sentry from "@sentry/astro";

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
        {
          userAgent: "*",
          allow: "/",
        },
        {
          userAgent: "*",
          disallow: "/profile/",
        },
      ],
    }),
    webmanifest({
      name: "Жить среди людей",
      start_url: "/",
      icons: [{
        "src": "favicon.svg",
        "type": "image/svg+xml",
        "sizes": "144x144"
      }, {
        "src": "favicon.svg",
        "type": "image/svg+xml",
        "sizes": "512x512"
      }, {
        "src": "maskable_icon.png",
        "type": "image/png",
        "purpose": "maskable"
      }],
      theme_color: "#f3f4f6",
      background_color: "#f3f4f6",
      display: "standalone"
    }),

    // sentry({
    //   dsn: import.meta.env.PUBLIC_SENTRY_DSN,
    //   environment: import.meta.env.PROD ? "production" : "development",
    //   enabled: import.meta.env.PROD,
    //   attachStacktrace: true,
    //   sourceMapsUploadOptions: {
    //     project: "nedbright-com",
    //     authToken: import.meta.env.SENTRY_AUTH_TOKEN,
    //   },
    //   enableTracing: true,
    // }),
  ],
  output: 'hybrid',
  adapter: cloudflare({
    imageService: 'cloudflare',
    platformProxy: {
      enabled: true,
    },
  }),
  vite: {
    ssr: {
      external: ['node:path', 'node:fs/promises'],
    },
  },
  site: "https://ng.nedbright.com",
  prefetch: true,
  devToolbar: {
    // enabled: false
  },
  image: squooshImageService(),
});
