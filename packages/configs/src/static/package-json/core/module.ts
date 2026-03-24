import type { PackageJson } from '@toolbox-ts/types/defs/configs';
import { Str } from '@toolbox-ts/utils';
import { REGEXES, URLS } from '@toolbox-ts/constants';
import { FILES } from '@toolbox-ts/constants/fs';
import { serializeJson } from '../../../helpers.js';

export type Config = PackageJson.Config;
export type InputConfig = Omit<Config, '$schema'>;
export type ProcessedConfig = Config;

export const DEFAULTS: PackageJson.Config = {
  $schema: URLS.SCHEMA_NPM_PKG,
  type: 'module',
  version: '0.0.0',
  license: 'MIT',
  dependencies: {},
  scripts: {},
  description: '',
  keywords: [],
  private: false,
  devDependencies: {},
  files: []
} as const;

export const define = (input: InputConfig = {}): ProcessedConfig => {
  const { $schema, name, version, ...rest } = { ...DEFAULTS, ...input };
  return {
    $schema,
    name: REGEXES.NPM_PACKAGE_NAME.test(name ?? '') ? name : '',
    version: Str.check.semver(version ?? '') ? version : DEFAULTS.version,
    ...rest
  };
};

export const toFileEntry = (config?: InputConfig) => ({
  [FILES.PACKAGE_JSON]: serializeJson(define(config))
});
