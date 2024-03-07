/// <reference path="../.astro/types.d.ts" />
/// <reference path=".astro/types.d.ts" />
/// <reference path=".astro~/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly SITE_URL: string;
  readonly PUBLIC_GITHUB_REPO: string;
  readonly PUBLIC_SENTRY_DSN: string;
  readonly SENTRY_AUTH_TOKEN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  replybox: {
    site: string;
    lang?: string;
  },
}
