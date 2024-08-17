/// <reference types="astro/client" />
/// <reference path="../.astro/types.d.ts" />
/// <reference path="./worker-configuration.d.ts" />

interface ImportMetaEnv {
  readonly SITE_URL: string;
  readonly PUBLIC_DOMAIN?: string;
  readonly PUBLIC_GITHUB_REPO: string;
  readonly SENDGRID_API_KEY: string;
  readonly SENDGRID_FROM_EMAIL: string;
  readonly SENDGRID_FROM_NAME: string;
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

type User = {
  iat: number;
  sub: string;
  name?: string;
  settings?: {
    'notifications:publications': boolean;
  },
}

type KVNamespace = import("@cloudflare/workers-types").KVNamespace;

type Runtime = import('@astrojs/cloudflare').Runtime<Env>;
declare namespace App {
  interface Locals extends Runtime { }
};
