import type { ValidateDependencyEntry } from '../../../../core/index.js';

export const CORE_TOOLING: ValidateDependencyEntry[] = [
  {
    id: 'corepack',
    fixCmd: `npm install --global corepack@latest`,
    getVersionCmd: `corepack --version`
  },
  {
    id: 'pnpm',
    getVersionCmd: `pnpm --version`,
    fixCmd: `corepack enable && corepack enable pnpm && corepack use pnpm@latest`
  }
] as const;
