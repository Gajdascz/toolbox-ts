import { GLOBS, FILES } from '@toolbox-ts/constants/fs';
import type { InputConfig, ProcessedConfig } from './types.js';
import { runtimeConfigToFileContent } from '../../../helpers.js';

export const DEFAULTS: ProcessedConfig = {
  $schema: './node_modules/oxfmt/configuration_schema.json',
  arrowParens: 'always',
  bracketSameLine: false,
  bracketSpacing: true,
  embeddedLanguageFormatting: 'auto',
  endOfLine: 'lf',
  htmlWhitespaceSensitivity: 'css',
  jsxSingleQuote: true,
  objectWrap: 'collapse',
  printWidth: 100,
  proseWrap: 'always',
  quoteProps: 'as-needed',
  experimentalSortImports: {},
  experimentalSortPackageJson: true,
  insertFinalNewline: true,
  semi: true,
  singleAttributePerLine: false,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'none',
  useTabs: false,
  vueIndentScriptAndStyle: false,
  ignorePatterns: [GLOBS.FILE.LOCK.DEEP]
};
export const define = (inp: InputConfig = {}): ProcessedConfig => ({ ...DEFAULTS, ...inp });

export const toFileContent = (config?: InputConfig) =>
  runtimeConfigToFileContent('oxfmt', [JSON.stringify(config, null, 2)]);

export const toFileEntry = (config?: InputConfig) => ({
  [FILES.CONFIG.OXFMT]: toFileContent(config)
});
