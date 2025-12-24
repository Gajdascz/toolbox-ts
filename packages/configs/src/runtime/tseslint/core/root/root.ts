import type {
  ConfigWithExtends,
  ConfigWithExtendsArray
} from '@eslint/config-helpers';

import js from '@eslint/js';
import vitestPlugin from '@vitest/eslint-plugin';
import prettierConfig from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import jsdocPlugin from 'eslint-plugin-jsdoc';
import perfectionistPlugin from 'eslint-plugin-perfectionist';
import tsdocPlugin from 'eslint-plugin-tsdoc';
import unicornPlugin from 'eslint-plugin-unicorn';
import { configs, plugin } from 'typescript-eslint';

import { ALWAYS_IGNORE, dedupeArrays } from '../../../../core/index.js';
import * as rules from './rules.js';
/* c8 ignore start */
export interface RootConfig {
  /**
   * Pre-configured with:
   * - `@eslint/js`: js.configs.recommended
   * - `eslint-plugin-jsdoc`: jsdocPlugin.configs['flat/stylistic-typescript']
   * - `typescript-eslint`: configs.strictTypeChecked
   * - `typescript-eslint`: configs.stylisticTypeChecked
   * - `eslint-plugin-perfectionist`: perfectionistPlugin.configs['recommended-alphabetical']
   * - `eslint-plugin-unicorn`: unicornPlugin.configs.recommended
   * - `@vitest/eslint-plugin`: vitestPlugin.configs.recommended
   * - `eslint-config-prettier`: prettierConfig
   */
  extends: ConfigWithExtendsArray;
  /**
   * Applies to all files `['**\/*']`
   */
  files: string[];
  /**
   * Pre-configured with @see {@link ALWAYS_IGNORE}
   */
  ignores: string[];
  name: '__root';
  /**
   * Pre-configured with:
   * - `@typescript-eslint`: plugin
   * - `eslint-plugin-import`: importPlugin
   * - `eslint-plugin-jsdoc`: jsdocPlugin
   * - `eslint-plugin-tsdoc`: tsdocPlugin
   * - `@vitest/eslint-plugin`: vitestPlugin
   */
  plugins: ConfigWithExtends['plugins'];
  /**
   * Pre-configured with @see {@link rules}
   */
  rules: ConfigWithExtends['rules'];
}
const BASE: RootConfig = Object.freeze<RootConfig>({
  name: '__root',
  files: ['**/*'],
  ignores: ALWAYS_IGNORE,
  extends: [
    js.configs.recommended,
    jsdocPlugin.configs['flat/stylistic-typescript'],
    ...configs.strictTypeChecked,
    ...configs.stylisticTypeChecked,
    perfectionistPlugin.configs['recommended-alphabetical'],
    unicornPlugin.configs.recommended,
    vitestPlugin.configs.recommended as never,
    prettierConfig
  ],
  plugins: {
    '@typescript-eslint': plugin,
    import: importPlugin,
    jsdoc: jsdocPlugin,
    tsdoc: tsdocPlugin,
    vitest: vitestPlugin as never
  },
  rules: {
    ...rules.eslint,
    ...rules.imports,
    ...rules.jsdoc,
    ...rules.perfectionist,
    ...rules.tsdoc,
    ...rules.typescriptEslint,
    ...rules.unicorn,
    ...rules.vitest
  }
});
export interface ExtendRootOptions extends Omit<
  Partial<RootConfig>,
  'files' | 'name'
> {
  extends?: ConfigWithExtendsArray;
  ignores?: ConfigWithExtends['ignores'];
  plugins?: ConfigWithExtends['plugins'];
  rules?: ConfigWithExtends['rules'];
}

export const extendRoot = (opts?: ExtendRootOptions): RootConfig =>
  !opts ? BASE : (
    Object.freeze<RootConfig>({
      name: BASE.name,
      files: BASE.files,
      extends: [...BASE.extends, ...(opts.extends ?? [])],
      ignores: dedupeArrays(BASE.ignores, opts.ignores ?? []),
      plugins: { ...BASE.plugins, ...opts.plugins },
      rules: { ...BASE.rules, ...opts.rules }
    })
  );
/* c8 ignore end */
