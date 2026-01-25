import type { PackageJson } from '@toolbox-ts/types/package-json';

import {
  JSON_SCHEMA_STORE_URL,
  NPM_PACKAGE_NAME,
  SEMVER
} from '../../../../../../core/architecture/index.js';

export const DEFAULTS: Partial<PackageJson> = {
  $schema: `${JSON_SCHEMA_STORE_URL}/package`,
  type: 'module',
  version: '0.0.0',
  license: 'MIT'
} as const;
export const formatName = (name: PackageJson['name'] = '') => {
  const n =
    typeof name === 'string' ? name
    : name.scope ? `${name.scope}/${name.package}`
    : name.package;
  return NPM_PACKAGE_NAME.test(n) ? n : '';
};
export const resolveRepositoryUrl = (
  repository: PackageJson['repository']
): string => {
  if (typeof repository === 'string') return repository;
  if (repository?.url) return repository.url;
  return '';
};
export const define = (input: Partial<Config> = {}) => {
  const { $schema, name, version, ...rest } = { ...DEFAULTS, ...input };
  return {
    $schema,
    name: formatName(name),
    version: SEMVER.test(version ?? '') ? version : DEFAULTS.version,
    ...rest
  };
};
export type Config = PackageJson;
