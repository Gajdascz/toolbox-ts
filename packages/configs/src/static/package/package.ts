import type { PackageJson } from '@toolbox-ts/types/package-json';

import { createStaticConfigModule, SEMVER } from '../../core/index.js';

export const DEFAULTS: Partial<PackageJson> = {
  $schema: 'https://json.schemastore.org/package',
  type: 'module',
  version: '0.0.0',
  license: 'MIT'
} as const;
export const formatName = (name: PackageJson['name'] = '') => {
  const n =
    typeof name === 'string' ? name
    : name.scope ? `${name.scope}/${name.package}`
    : name.package;
  return (
      /^(?=.{1,214}$)(?:@([a-z0-9._-]*)\/[._a-z0-9][a-z0-9._-]*|[a-z0-9][a-z0-9._-]*)$/.test(
        n
      )
    ) ?
      n
    : '';
};
export const resolveRepositoryUrl = (
  repository: PackageJson['repository']
): string => {
  if (typeof repository === 'string') return repository;
  if (repository?.url) return repository.url;
  return '';
};
export const { define, meta } = createStaticConfigModule({
  filename: 'package.json',
  define: (input: Partial<PackageJson> = {}) => {
    const { $schema, name, version, ...rest } = { ...DEFAULTS, ...input };
    return {
      $schema,
      name: formatName(name),
      version: SEMVER.test(version ?? '') ? version : DEFAULTS.version,
      ...rest
    };
  }
});
export type Config = PackageJson;
