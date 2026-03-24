import { entries } from '../factory.js';

export const VITEST = entries(
  {
    name: 'vitest',
    description: 'A Vite-native unit test framework.',
    repo: 'https://github.com/vitest-dev/vitest/tree/main/packages/vitest',
    docs: 'https://vitest.dev'
  },
  {
    name: '@vitest/ui',
    docs: 'https://vitest.dev/guide/ui.html',
    description: 'View and interact with Vitest and results.',
    repo: 'https://github.com/vitest-dev/vitest/tree/main/packages/ui'
  }
);
