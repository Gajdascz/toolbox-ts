import type { Truthy } from '@toolbox-ts/types';

import { packageJson } from '@toolbox-ts/configs';
import { DEV_DIR, type RepoType } from '@toolbox-ts/configs/core';
import { isDir, isFile, writeFile } from '@toolbox-ts/file';
import path from 'node:path';

import {
  createPackageJsonOps,
  orchestrateConfigs,
  type OrchestratorConfig,
  type OrchestratorResult,
  type PackageJsonOps,
  validateDependencies,
  type ValidateDependencyEntry,
  type ValidateDependencyResult
} from '../../core/index.js';

//#region> Types
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
  setupBaseArchitecture?:
    | { devDir?: '_' | '.' | true; srcDir?: string }
    | false;
}
export type ExitStatus = 'aborted' | 'error' | 'success';
type BuildResult<R extends RepoType> =
  | ({
      coreTooling: ValidateDependencyResult[];
      orchestrator: OrchestratorResult<R>;
    } & { status: 'success' })
  | ({
      coreTooling?: ValidateDependencyResult[];
      orchestrator?: OrchestratorResult<R>;
    } & { message: string; status: 'error' })
  | { reason: string; status: 'aborted' };
//#endregion
type StepResult<R extends RepoType, D> =
  | { detail: D; pass: true }
  | { pass: false; result: { status: 'aborted' | 'error' } & BuildResult<R> };
const validateCoreTooling = async <R extends RepoType>(
  attemptAutoFixes = true,
  additional: ValidateDependencyEntry[] = []
): Promise<StepResult<R, ValidateDependencyResult[]>> => {
  const results = await validateDependencies(attemptAutoFixes, [
    {
      id: 'corepack',
      fixCmd: `npm install --global corepack@latest`,
      getVersionCmd: `corepack --version`
    },
    {
      id: 'pnpm',
      getVersionCmd: `pnpm --version`,
      fixCmd: `corepack enable && corepack enable pnpm && corepack use pnpm@latest`
    },

    ...additional
  ]);
  const hasErrors = results.some((r) => r.status === 'invalid');
  return hasErrors ?
      {
        pass: false,
        result: {
          status: 'error',
          message: 'core tooling validation failed',
          coreTooling: results
        }
      }
    : { pass: true, detail: results };
};

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

const setupBaseArchitecture = async <R extends RepoType>(
  repoType: R,
  rootDir: string,
  { devDir, srcDir }: Truthy<Config<R>['setupBaseArchitecture']>
): Promise<StepResult<R, { devDir: false | string }>> => {
  const result = { devDir: false as false | string };
  if (devDir) {
    const devDirName = devDir === true ? DEV_DIR : `${devDir}${DEV_DIR}`;
    const devDirPath = path.join(rootDir, devDirName);
    await writeFile(path.join(devDirPath, 'index.ts'), '// Dev dir setup file');
  }
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
    const coreToolingResult = await validateCoreTooling<R>(
      attemptAutoFixes,
      extend.coreTooling
    );
    if (!coreToolingResult.pass) return coreToolingResult.result;
    if (!(await isDir(rootDir))) {
      return {
        status: 'error',
        message: `The specified rootDir "${rootDir}" is not a directory or does not exist.`
      };
    }
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
