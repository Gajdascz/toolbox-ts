import { Arr } from '@toolbox-ts/utils';
import type { InputConfig, ProcessedConfig } from './types.ts';
import { NPM } from '@toolbox-ts/constants/tooling';
import { FILES } from '@toolbox-ts/constants/fs';
import { serializeJson, runtimeConfigToFileContent } from '../../../helpers.js';

export const DEFAULTS: ProcessedConfig = {
  extends: [NPM['@commitlint/config-conventional'].name],
  rules: {
    'scope-case': [2, 'always', ['lower-case', 'kebab-case']],
    'subject-case': [2, 'always', ['lower-case']],
    'subject-empty': [2, 'never'],
    'subject-max-length': [2, 'always', 50],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never']
  },
  defaultIgnores: true
};

/**
 * Produces a commitlint configuration.
 * - `extends`: Merged unique with defaults.
 * - `rules`: Shallow-merged with defaults (per-rule override).
 * - `scopes`: Mapped to `scope-enum` rule.
 */
export const define = ({
  extends: _extensions = [],
  rules = {},
  scopes = [],
  defaultIgnores = DEFAULTS.defaultIgnores,
  ignores = [],
  ...cfg
}: InputConfig = {}): ProcessedConfig => ({
  extends: Arr.mergeUnique(DEFAULTS.extends, Arr.ensure(_extensions)),
  rules: { ...DEFAULTS.rules, ...rules, 'scope-enum': [2, 'always', scopes] },
  defaultIgnores,
  ignores,
  ...cfg
});

export const toFileContent = (config?: InputConfig) =>
  runtimeConfigToFileContent('commitlint', [serializeJson(config)]);

export const toFileEntry = (config?: InputConfig) => ({
  [FILES.CONFIG.COMMITLINT]: toFileContent(config)
});
