import type { RepoType } from '@toolbox-ts/configs/core';

import { packageJson } from '@toolbox-ts/configs';
import { isFile, writeFile } from '@toolbox-ts/file';
import path from 'node:path';

import {
  createPackageJsonOps,
  orchestrateConfigs,
  type OrchestratorConfig,
  type OrchestratorResult,
  type PackageJsonOps,
  type ValidateDependencyEntry,
  type ValidateDependencyResult
} from '../core/index.js';

//#region> Types
export type BuildResult<R extends RepoType> =
  | ({
      coreTooling: ValidateDependencyResult[];
      orchestrator: OrchestratorResult<R>;
    } & { status: 'success' })
  | ({
      coreTooling?: ValidateDependencyResult[];
      orchestrator?: OrchestratorResult<R>;
    } & { message: string; status: 'error' })
  | { reason: string; status: 'aborted' };
export interface Config<R extends RepoType> {
  attemptAutoFixes?: boolean;
  configs?: OrchestratorConfig<R>['configs'];
  extend?: {
    configs?: (
      repoType: R,
      rootDir: string
    ) => Promise<{ message: string; ok: false } | { ok: true }>;
    coreTooling?: ValidateDependencyEntry[];
  };

  onExistingProject?: 'abort' | 'mergePkgJson' | 'overwrite';
  package?: packageJson.Config;
  rootDir?: string;
  setupBaseArchitecture?: false | SetupBaseArchitectureOption;
}
export type ExitStatus = 'aborted' | 'error' | 'success';
export interface SetupBaseArchitectureOption {
  devDir?: '_' | '.' | boolean;
  rootDir: string;
  srcDir?: boolean;
}
//#endregion
export type StepResult<R extends RepoType, D> =
  | { detail: D; pass: true }
  | { pass: false; result: BuildResult<R> };

const setupPackageJson = async <R extends RepoType>(
  rootDir: string,
  pkg: packageJson.Config,
  onExistingProject: Config<R>['onExistingProject']
): Promise<StepResult<R, PackageJsonOps>> => {
  const packagePath = path.join(rootDir, packageJson.meta.filename);
  const pkgOps = await createPackageJsonOps(rootDir);
  if (await isFile(packagePath)) {
    if (onExistingProject === 'abort')
      return {
        pass: false,
        result: {
          status: 'aborted',
          reason:
            'project already exists, pass onExistingProject "overwrite" to overwrite or run init in an empty directory.'
        }
      };
    if (onExistingProject === 'mergePkgJson') {
      await pkgOps.merge(packageJson.define(pkg));
      return { pass: true, detail: pkgOps };
    }
  }
  // Does not exist or onExistingProject is 'overwrite'
  await writeFile(packagePath, packageJson.define(pkg));
  return { pass: true, detail: pkgOps };
};

/**
 * 1. Validate core tooling.
 *  - If result has errors, return error status with details.
 * 2. Validate rootDir.
 * 3. Setup PackageJson and Handle existing project based on onExistingProject option.
 *    - If 'abort', return aborted status.
 *    - If 'mergePkgJson', merge existing package.json with provided package option.
 *    - If 'overwrite', continue.
 * 4. Orchestrate configurations.
 *  - Merges input configurations with defaults based on repoType.
 *  - Installs dependencies.
 *  - Writes configuration files handling conflicts as specified.
 *  -
 * 5. If extend.configs is provided, process them and handle errors.
 *
 *
 *
 */
export async function build<R extends RepoType>(
  repoType: R,
  {
    rootDir = process.cwd(),
    onExistingProject = 'abort',
    attemptAutoFixes = true,
    configs = {},
    extend = {},
    package: pkg = {}
  }: Config<R>
): Promise<BuildResult<R>> {
  try {
    const pkgSetupResult = await setupPackageJson<R>(
      rootDir,
      pkg,
      onExistingProject
    );
    if (!pkgSetupResult.pass) return pkgSetupResult.result;
    const pkgOps = pkgSetupResult.detail;

    const orchestratorResult = await orchestrateConfigs<R>({
      repoType,
      configs,
      writePath: rootDir,
      pkgOps
    });
    if (extend.configs) {
      const result = await extend.configs(repoType, rootDir);
      if (!result.ok)
        return {
          status: 'error',
          message: result.message,
          coreTooling: coreToolingResult.detail
        };
    }
    return {
      status: 'success',
      orchestrator: orchestratorResult,
      coreTooling: coreToolingResult.detail
    };
  } catch (error) {
    return { status: 'error', message: (error as Error).message };
  }
}
