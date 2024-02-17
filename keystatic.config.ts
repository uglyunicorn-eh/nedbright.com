import { config, fields, collection, type LocalConfig, type GitHubConfig } from '@keystatic/core';

const repo: string | null = import.meta.env.PUBLIC_GITHUB_REPO;
const isRemote = !!repo;

const localMode: LocalConfig["storage"] = {
  kind: 'local',
}

const remoteMode: GitHubConfig["storage"] = {
  kind: 'github',
  repo: (repo as `${string}/${string}`) || 'uglyunicorn-eh/nedbright.com',
}

export default config({
  storage: isRemote ? remoteMode : localMode,

  ui: {
    brand: {
      name: "Command Center",
    },
  },

  singletons: {
    site: {
      label: 'Site',
      schema: {
        title: fields.text({ label: 'Title' }),
      },
    }
  },

  collections: {
    posts: collection({
      label: 'Posts',
      slugField: 'title',
      path: 'src/content/posts/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        content: fields.document({
          label: 'Content',
          formatting: true,
          dividers: true,
          links: true,
          images: true,
        }),
      },
    }),
  },
});
