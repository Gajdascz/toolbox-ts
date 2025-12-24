import { parseJson } from '@toolbox-ts/file';
import { findPackageJSON } from 'node:module';

import { DependencyError } from '../../../../Errors.js';

export async function fetchPeerDependencies(
  pkgName: string
): Promise<string[]> {
  const pkgJsonPath = findPackageJSON(pkgName, import.meta.url);
  if (!pkgJsonPath) {
    throw new DependencyError(
      `Cannot find package.json for package: ${pkgName}`
    );
  }
  return Object.keys(
    (await parseJson<Record<string, unknown>>(pkgJsonPath)).peerDependencies
      ?? {}
  );
}
