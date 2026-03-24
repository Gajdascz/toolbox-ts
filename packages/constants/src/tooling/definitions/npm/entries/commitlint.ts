import { entries } from '../factory.js';

export const COMMITLINT = entries(
  {
    name: '@commitlint/cli',
    repo: 'https://github.com/conventional-changelog/commitlint',
    description: 'Lint commit messages according to conventional standards.',
    docs: 'https://commitlint.js.org'
  },
  {
    name: '@commitlint/prompt',
    repo: 'https://github.com/conventional-changelog/commitlint/tree/master/@commitlint/prompt',
    description:
      'Commitizen adapter for commitlint, providing an interactive prompt for crafting commit messages that adhere to conventional standards.',
    docs: 'https://commitlint.js.org/reference/prompt.html'
  },
  {
    name: '@commitlint/config-conventional',
    repo: 'https://github.com/conventional-changelog/commitlint/tree/master/%40commitlint/config-conventional',
    description:
      'Shareable config for commitlint following the Conventional Commits specification.',
    docs: 'https://commitlint.js.org/'
  }
);
