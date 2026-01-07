/* c8 ignore start */
import type { ConfigWithExtends } from '@eslint/config-helpers';

import js from '@eslint/js';
import vitestPlugin from '@vitest/eslint-plugin';
import prettierConfig from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import jsdocPlugin from 'eslint-plugin-jsdoc';
import perfectionistPlugin from 'eslint-plugin-perfectionist';
import tsdocPlugin from 'eslint-plugin-tsdoc';
import unicornPlugin from 'eslint-plugin-unicorn';
import { configs, plugin } from 'typescript-eslint';

import type { BaseCfg } from '../../types.js';

import { ARRAYS } from '../../constants.js';
import {
  eslint as eslintRules,
  imports as importsRules,
  jsdoc as jsdocRules,
  perfectionist as perfectionistRules,
  tsdoc as tsdocRules,
  typescriptEslint as typescriptEslintRules,
  unicorn as unicornRules,
  vitest as vitestRules
} from './rules.js';

export const ROOT: ConfigWithExtends = Object.freeze<ConfigWithExtends>({
  extends: [
    js.configs.recommended,
    jsdocPlugin.configs['flat/stylistic-typescript'],
    ...configs.strictTypeChecked,
    ...configs.stylisticTypeChecked,
    perfectionistPlugin.configs['recommended-alphabetical'],
    unicornPlugin.configs.recommended,
    prettierConfig
  ],
  files: ['**/*'],
  ignores: ['**/node_modules/**', '**/dist/**', '**/build/**', '**/docs/**'],
  name: '__root',
  plugins: {
    '@typescript-eslint': plugin,
    import: importPlugin,
    jsdoc: jsdocPlugin,
    tsdoc: tsdocPlugin,
    vitest: vitestPlugin
  },
  rules: {
    ...vitestPlugin.configs.recommended.rules,
    ...eslintRules,
    ...typescriptEslintRules,
    ...unicornRules,
    ...jsdocRules,
    ...importsRules,
    ...perfectionistRules,
    ...tsdocRules,
    ...vitestRules
  },
  settings: { vitest: { typecheck: true } }
});

export interface ExtendRootOptions {
  extends?: ConfigWithExtends['extends'];
  plugins?: ConfigWithExtends['plugins'];
  rules?: ConfigWithExtends['rules'];
}
export const extendRoot = ({
  extends: _extends = [],
  plugins = {},
  rules = {}
}: ExtendRootOptions = {}): ConfigWithExtends => ({
  ...ROOT,
  extends: [...ROOT.extends!, ..._extends],
  plugins: { ...ROOT.plugins, ...plugins },
  rules: { ...ROOT.rules, ...rules }
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
