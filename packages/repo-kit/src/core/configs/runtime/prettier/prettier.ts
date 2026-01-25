import type { Config } from 'prettier';

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
export const define = (input: Config = {}): Config => ({
  ...DEFAULTS,
  ...input
});
// export const prettier = () =>
// createConfigModule({
// fileType: 'runtime',
// name: 'prettier',
// url: 'https://prettier.io/',
// filename: PRETTIER_CONFIG_FILE,
// importName: 'prettier',
// importFrom: THIS_PACKAGE,
// description: 'Opinionated code formatter.',
// dependencies: [{ packageName: 'prettier', isDev: true }],
//
// packagePatch: { scripts: { 'check:format': `pnpm prettier --check .` } }
// });
export type { Config } from 'prettier';
