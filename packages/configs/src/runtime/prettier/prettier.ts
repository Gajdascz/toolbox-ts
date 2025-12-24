/* c8 ignore start */

import type { Config } from 'prettier';

import { createRuntimeConfigModule, THIS_PACKAGE } from '../../core/index.js';
export const DEFAULTS: Config = {
  arrowParens: 'always',
  bracketSameLine: false,
  bracketSpacing: true,
  checkIgnorePragma: false,
  embeddedLanguageFormatting: 'auto',
  endOfLine: 'lf',
  experimentalOperatorPosition: 'start',
  experimentalTernaries: true,
  htmlWhitespaceSensitivity: 'css',
  insertPragma: false,
  jsxSingleQuote: true,
  objectWrap: 'collapse',
  overrides: [],
  printWidth: 80,
  proseWrap: 'always',
  quoteProps: 'as-needed',
  rangeEnd: Infinity,
  rangeStart: 0,
  requirePragma: false,
  semi: true,
  singleAttributePerLine: false,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'none',
  useTabs: false,
  vueIndentScriptAndStyle: false
};
export const { define, getTemplateString, meta } = createRuntimeConfigModule({
  filename: 'prettier.config.js',
  importName: 'prettier',
  importFrom: THIS_PACKAGE,
  dependencies: ['prettier'],
  define: (input: Config = {}): Config => ({ ...DEFAULTS, ...input })
});
export type { Config } from 'prettier';
