/// <reference path="../.astro/types.d.ts" />
/// <reference path="../.astro~/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly SITE_URL: string?;
  readonly PUBLIC_GITHUB_REPO: string?;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
