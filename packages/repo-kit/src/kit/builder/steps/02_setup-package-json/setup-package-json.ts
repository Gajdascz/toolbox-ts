import { packageJson } from '@toolbox-ts/configs';
import {
  merge,
  MONOREPO_ROOT_PACKAGE_JSON,
  type RepoType,
  SRC_PACKAGE_JSON,
  type StaticPackageJsonFields
} from '@toolbox-ts/configs/core';
import { writeFile } from '@toolbox-ts/file';

import type { BuildResult } from '../../types.js';
import type { ValidateStartingDirResult } from '../01_validate/starting-dir/validate-starting-dir.js';

import {
  createPackageJsonOps,
  type PackageJsonOps
} from '../../../core/index.js';
export interface SetupPackageJsonParams {
  config?: Omit<packageJson.Config, StaticPackageJsonFields>;
  detail: ({
    status: 'success';
  } & ValidateStartingDirResult)['detail']['packageJson'];
  repoType: RepoType;
}
export type SetupPackageJsonResult = BuildResult<{ ops: PackageJsonOps }>;
export const setupPackageJson = async ({
  detail,
  repoType,
  config
}: SetupPackageJsonParams): Promise<SetupPackageJsonResult> => {
  const { path, strategy, exists } = detail;
  const cfg =
    repoType === 'monorepo' ?
      merge<packageJson.Config>(MONOREPO_ROOT_PACKAGE_JSON, config)
    : merge<packageJson.Config>(SRC_PACKAGE_JSON, config);
  if (!exists || strategy === 'overwrite')
    await writeFile(path, packageJson.define(cfg));

  const ops = await createPackageJsonOps(path);
  if (strategy === 'mergePkgJson') await ops.merge(cfg);
  return { status: 'success', detail: { ops } };
};
