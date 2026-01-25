export interface ToolingSectionEntry {
  description: string;
  text: string;
  url: string;
}
export const PNPM: ToolingSectionEntry = {
  text: 'pnpm',
  description: 'Fast, disk space efficient package manager.',
  url: 'https://pnpm.io/'
} as const;

export const TYPESCRIPT: ToolingSectionEntry = {
  text: 'typescript',
  description:
    'Typed superset of JavaScript that compiles to plain JavaScript.',
  url: 'https://www.typescriptlang.org/'
} as const;
export const NODEJS: ToolingSectionEntry = {
  text: 'nodejs',
  description: "JavaScript runtime built on Chrome's V8 JavaScript engine.",
  url: 'https://nodejs.org/en/'
} as const;

export const VITEST: ToolingSectionEntry = {
  text: 'vitest',
  description: 'A Vite-native unit test framework.',
  url: 'https://vitest.dev/'
} as const;
export const HUSKY: ToolingSectionEntry = {
  text: 'husky',
  description: 'Git hooks made easy.',
  url: 'https://typicode.github.io/husky/'
} as const;
export const LINT_STAGED: ToolingSectionEntry = {
  text: 'lint-staged',
  description: 'Run linters on git staged files.',
  url: 'https://github.com/lint-staged/lint-staged'
} as const;
export const DEPENDENCY_CRUISER: ToolingSectionEntry = {
  text: 'dependency-cruiser',
  description: 'Validate and visualize dependencies.',
  url: 'https://github.com/sverweij/dependency-cruiser'
} as const;
export const TSDOC: ToolingSectionEntry = {
  text: 'tsdoc',
  description: 'Standardizes doc comments in TypeScript.',
  url: 'https://tsdoc.org/'
} as const;
export const COMMITLINT: ToolingSectionEntry = {
  text: 'commitlint',
  description: 'Lint commit messages according to conventional standards.',
  url: 'https://commitlint.js.org/#/'
} as const;
export const COMMITIZEN: ToolingSectionEntry = {
  text: 'commitizen',
  description: 'Create commit messages following conventional standards.',
  url: 'https://commitizen.github.io/cz-cli/'
} as const;
export const CHANGESETS: ToolingSectionEntry = {
  text: 'changesets',
  description:
    'A tool to manage versioning and changelogs with a focus on multi-package repositories.',
  url: 'https://github.com/changesets/changesets'
} as const;
export const TOOLBOX_TS: ToolingSectionEntry = {
  text: 'toolbox-ts',
  description: 'TypeScript and Node project utilities.',
  url: 'https://github.com/gajdascz/toolbox-ts'
} as const;
