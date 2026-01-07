import type { ConfigWithExtends } from '@eslint/config-helpers';

import type { BaseCfg } from '../types.js';

import { GLOBS } from '../constants.js';
import { createBaseConfig, ROOT } from './root/index.js';
export { extendRoot, type ExtendRootOptions } from './root/index.js';
export const configs: { __root: ConfigWithExtends } & {
  [K in 'build' | 'dev' | 'test']: BaseCfg<K>;
} = {
  __root: ROOT,
  build: createBaseConfig('build', {
    files: [`${GLOBS.SRC_DIRS}/**/*.${GLOBS.EXTS}`],
    ignores: [`**/*.${GLOBS.TEST_FILES}.${GLOBS.EXTS}`]
  }),
  dev: createBaseConfig('dev', {
    files: [`${GLOBS.DEV_DIRS}/**/*.${GLOBS.EXTS}`, `*.${GLOBS.EXTS}`],
    ignores: [`**/*.${GLOBS.TEST_FILES}.${GLOBS.EXTS}`]
  }),
  test: createBaseConfig('test', {
    files: [`**/*.${GLOBS.TEST_FILES}.${GLOBS.EXTS}`],
    rules: {
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'off',
      '@typescript-eslint/no-unnecessary-condition': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/prefer-nullish-coalescing': 'off',
      '@typescript-eslint/prefer-promise-reject-errors': 'off',
      '@typescript-eslint/unbound-method': 'off',
      'unicorn/import-style': 'off'
    }
  })
} as const;

export type DefaultBaseConfigName = Exclude<keyof typeof configs, '__root'>;

export const DEFAULT_CONFIG_ORDER: DefaultBaseConfigName[] = [
  'build',
  'dev',
  'test'
] as const;
