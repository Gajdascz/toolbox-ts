import type { UserConfig } from '@commitlint/types';

import {
  CHANGESET_MARKER,
  createRuntimeConfigModule,
  THIS_PACKAGE
} from '../../core/index.js';

export interface Config extends UserConfig {
  extends?: string[];
  rules?: Rules;
  scopes?: string[];
  /**
   * When enabled ignores commit messages containing "Version Packages"
   *
   * @default false
   */
  usingChangeset?: boolean;
}

export type Rules = Partial<Exclude<UserConfig['rules'], 'scope-enum'>>;
export const DEFAULTS: { extends: string[] } & Config = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-case': [2, 'always', ['lower-case', 'kebab-case']],
    'subject-case': [2, 'always', ['lower-case']],
    'subject-empty': [2, 'never'],
    'subject-max-length': [2, 'always', 50],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never']
  }
} as const;
function excludeChangesets(commit: string) {
  return commit.includes(CHANGESET_MARKER);
}
export const { define, meta, getTemplateString } = createRuntimeConfigModule({
  filename: 'commitlint.config.ts',
  importName: 'commitlint',
  importFrom: THIS_PACKAGE,
  dependencies: ['@commitlint/cli', '@commitlint/config-conventional'],
  define: ({
    extends: _extensions = [],
    rules = {},
    scopes = [],
    defaultIgnores = true,
    ignores = [],
    usingChangeset = false,
    ...cfg
  }: Config = {}): UserConfig => ({
    extends: [
      ...DEFAULTS.extends,
      ...(Array.isArray(_extensions) ? _extensions : [_extensions])
    ],
    rules: { ...DEFAULTS.rules, 'scope-enum': [2, 'always', scopes], ...rules },
    defaultIgnores,
    ignores: [...(usingChangeset ? [excludeChangesets] : []), ...ignores],
    ...cfg
  })
});
