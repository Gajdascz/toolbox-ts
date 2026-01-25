export * from './commitlint/index.js';
export * from './depcruiser/index.js';
export * from './prettier/index.js';
export * from './tseslint/index.js';
export * from './vitest/index.js';

import { commitlint } from './commitlint/index.js';
import { depcruiser } from './depcruiser/index.js';
import { prettier } from './prettier/index.js';
import { tseslint } from './tseslint/index.js';
import { vitest } from './vitest/index.js';

export const runtimeConfigs = {
  commitlint,
  depcruiser,
  prettier,
  tseslint,
  vitest
} as const;
export type RuntimeConfigs = typeof runtimeConfigs;
export type RuntimeConfig = keyof typeof runtimeConfigs;
