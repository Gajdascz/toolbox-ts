/* c8 ignore start */
import type { ConfigWithExtends } from '@eslint/config-helpers';

import js from '@eslint/js';
import vitestPlugin from '@vitest/eslint-plugin';
import prettierConfig from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import jsdoc from 'eslint-plugin-jsdoc';
import perfectionistPlugin from 'eslint-plugin-perfectionist';
import tsdoc from 'eslint-plugin-tsdoc';
import unicornPlugin from 'eslint-plugin-unicorn';
import { configs, plugin } from 'typescript-eslint';

import type { BaseCfg } from '../../types.js';

import { ARRAYS } from '../../constants.js';
import {
  docs,
  imports,
  perfectionist,
  typescriptEslint,
  unicorn
} from './rules.js';

export const ROOT: ConfigWithExtends = Object.freeze({
  extends: [
    js.configs.recommended,
    jsdoc.configs['flat/stylistic-typescript'],
    ...configs.strictTypeChecked,
    ...configs.stylisticTypeChecked,
    perfectionistPlugin.configs['recommended-alphabetical'],
    unicornPlugin.configs.recommended,
    vitestPlugin.configs.recommended,
    prettierConfig
  ],
  files: ['**/*'],
  ignores: ['**/node_modules/**', '**/dist/**', '**/build/**', '**/docs/**'],
  name: '__root',
  plugins: {
    '@typescript-eslint': plugin,
    import: importPlugin,
    jsdoc,
    tsdoc,
    vitest: vitestPlugin as never
  },
  rules: {
    ...typescriptEslint,
    ...unicorn,
    ...docs,
    ...imports,
    ...perfectionist
  }
});

export const createBaseConfig = <N extends string>(
  name: N,
  {
    extends: _extends = [],
    files = [],
    ignores = [],
    importResolverNodeExtensions = ARRAYS.EXTS,
    rules = {},
    ...overrides
  }: Partial<Omit<BaseCfg<N>, 'name'>>
): BaseCfg<N> => {
  return {
    extends: [ROOT, ..._extends],
    files,
    ignores: [...new Set([...ARRAYS.ALL_IGNORES, ...ignores])],
    importResolverNodeExtensions,
    name,
    rules,
    ...overrides
  };
};
/* c8 ignore end */
