import type { packageJson } from '@toolbox-ts/configs';
import type { RepoType } from '@toolbox-ts/configs/core';

import type {
  OrchestratorConfig,
  ValidateDependencyEntry
} from '../core/index.js';

export type AbortResultCode = `ABORT_${string}`;
export interface BuildConfig<R extends RepoType> {
  attemptAutoFixes?: boolean;
  configs?: OrchestratorConfig<R>['configs'];
  coreTooling?: ValidateDependencyEntry[];
  onExistingProject?: ExistingProjectStrategy;
  package?: packageJson.Config;
  rootDir?: string;
}
export type BuildResult<PassDetail = undefined, FailDetail = undefined> =
  | { detail: FailBuildResultDetail<FailDetail>; status: 'aborted' | 'error' }
  | {
      detail: PassDetail extends undefined ? never : PassDetail;
      status: 'success';
    };

export type ErrorResultCode = `ERROR_${string}`;
export type ExistingProjectStrategy = 'abort' | 'mergePkgJson' | 'overwrite';
export type ExitStatus = 'aborted' | 'error' | 'success';
export type FailBuildResultDetail<F = undefined> =
  F extends undefined ? { code: string; message: string }
  : { code: string; message: string } & F;
