import type { UserConfig } from '@commitlint/types';

export type Config = {
  rules?: Rules;
  scopes?: string[];
  /**
   * When enabled ignores commit messages containing "Version Packages"
   *
   * @default false
   */
  usingChangeset?: boolean;
} & Exclude<UserConfig, 'rules'>;

export type Rules = Partial<Exclude<UserConfig['rules'], 'scope-enum'>>;

export const define = ({
  extends: _extensions = [],
  rules = {},
  scopes = [],
  defaultIgnores = true,
  ignores = [],
  usingChangeset = false,
  ...cfg
}: Config = {}): UserConfig => ({
  extends: [
    '@commitlint/config-conventional',
    ...(Array.isArray(_extensions) ? _extensions : [_extensions])
  ],
  rules: {
    'scope-case': [2, 'always', ['lower-case', 'kebab-case']],
    'scope-enum': [2, 'always', scopes],
    'subject-case': [2, 'always', ['lower-case']],
    'subject-empty': [2, 'never'],
    'subject-max-length': [2, 'always', 50],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    ...rules
  },
  defaultIgnores,
  ignores: [
    ...(usingChangeset ? [(c: string) => c.includes('Version Packages')] : []),
    ...ignores
  ],
  ...cfg
});
