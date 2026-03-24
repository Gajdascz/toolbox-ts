import { entries } from '../factory.js';

export const OXC = entries(
  {
    name: 'oxlint',
    description:
      'A high-performance linter for JavaScript and TypeScript built on the Oxc compiler stack.',
    repo: 'https://github.com/oxc-project/oxc/tree/main/apps/oxlint',
    docs: 'https://oxc.rs/docs/guide/usage/linter.html'
  },
  {
    name: 'oxlint-tsgolint',
    description:
      'High-performance type-aware TypeScript linter powered by typescript-go, for use with oxlint.',
    repo: 'https://github.com/oxc-project/tsgolint',
    docs: 'https://oxc.rs/docs/guide/usage/linter/type-aware.html'
  },
  {
    name: 'oxfmt',
    description: 'A high-performance formatter for the JavaScript ecosystem.',
    repo: 'https://github.com/oxc-project/oxc/tree/main/apps/oxfmt',
    docs: 'https://oxc.rs/docs/guide/usage/formatter.html'
  }
);
