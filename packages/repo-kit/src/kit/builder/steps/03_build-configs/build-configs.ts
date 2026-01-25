import type { RepoType } from '@toolbox-ts/configs/core';

import type { BuildResult } from '../../types.js';

import {
  orchestrateConfigs,
  type OrchestratorConfig,
  type OrchestratorResult,
  type PackageJsonOps
} from '../../../core/index.js';

//#region> Types
export interface BuildConfigsOps<
  R extends RepoType
> extends OrchestratorConfig<R> {
  pkgOps: PackageJsonOps;
}

export async function buildConfigs<R extends RepoType>({
  repoType,
  pkgOps,
  writePath,
  configs,
  defaultOnFileConflict
}: BuildConfigsOps<R>): Promise<BuildResult<OrchestratorResult<R>>> {
  const orchestratorResult = await orchestrateConfigs<R>({
    repoType,
    configs,
    writePath,
    pkgOps,
    defaultOnFileConflict
  });
  return { status: 'success', detail: orchestratorResult };
}
