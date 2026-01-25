import type { UserConfig } from '@commitlint/types';
import type { RequiredProps } from '@toolbox-ts/types';

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

export const DEFAULTS: RequiredProps<Config, 'extends' | 'rules'> = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-case': [2, 'always', ['lower-case', 'kebab-case']],
    'subject-case': [2, 'always', ['lower-case']],
    'subject-empty': [2, 'never'],
    'subject-max-length': [2, 'always', 50],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never']
  }
};

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
    ...DEFAULTS.extends,
    ...(Array.isArray(_extensions) ? _extensions : [_extensions])
  ],
  rules: { ...DEFAULTS.rules, 'scope-enum': [2, 'always', scopes], ...rules },
  defaultIgnores,
  ignores: [
    ...(usingChangeset ? [(c: string) => c.includes('Version Packages')] : []),
    ...ignores
  ],
  ...cfg
});
