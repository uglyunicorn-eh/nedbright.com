import { config, type LocalConfig, type GitHubConfig } from '@keystatic/core';

import { singletons, collections } from 'keystatic/models';

const repo = import.meta.env.PUBLIC_GITHUB_REPO;
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
      name: "Content Manager",
    },
    navigation: {
      'Content': [
        'writings',
        'books',
      ],
      'Settings': [
        'site',
        'menus',
      ],
    },
  },

  singletons,
  collections,
});
