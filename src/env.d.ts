/// <reference path="../.astro/types.d.ts" />
/// <reference path=".astro/types.d.ts" />
/// <reference path=".astro~/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly SITE_URL: string;
  readonly PUBLIC_GITHUB_REPO: string;
  readonly PUBLIC_SENTRY_DSN: string;
  readonly SENTRY_AUTH_TOKEN: string;
  readonly SENDGRID_API_KEY: string;
  readonly SENDGRID_FROM_EMAIL: string;
  readonly SENDGRID_REPLY_TO: string;
  readonly REPLYBOX_SECRET_KEY: string;
  readonly PUBLIC_KEY: string;
  readonly PRIVATE_KEY: string;
  readonly SIGN_IN_TEMPLATE_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  replybox: {
    site: string;
    lang?: string;
    sso?: {
      hash: string;
      payload: string;
    };
    identifier?: string;
  },
}

type KVNamespace = import("@cloudflare/workers-types").KVNamespace;
type ENV = {
  Users: KVNamespace;
};

type Runtime = import("@astrojs/cloudflare").AdvancedRuntime<ENV>;
declare namespace App {
  interface Locals extends Runtime { }
};
