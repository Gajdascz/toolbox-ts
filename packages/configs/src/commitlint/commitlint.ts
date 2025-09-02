import type { UserConfig } from '@commitlint/types';

export type Config = { rules?: Rules; scopes?: string[] } & Exclude<
  UserConfig,
  'rules'
>;

export type Rules = Partial<Exclude<UserConfig['rules'], 'scope-enum'>>;

export const define = ({
  extends: _extensions = [],
  rules = {},
  scopes = [],
  ...cfg
}: Config = {}): UserConfig => ({
  extends: [
    '@commitlint/config-conventional',
    ...(Array.isArray(_extensions) ? _extensions : [_extensions])
  ],
  rules: {
    'scope-case': [2, 'always', ['lower-case', 'kebab-case']],
    'scope-enum': [2, 'always', scopes],
    'subject-case': [2, 'always', ['lower-case', 'sentence-case']],
    'subject-empty': [2, 'never'],
    'subject-max-length': [2, 'always', 50],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    ...rules
  },
  ...cfg
});
