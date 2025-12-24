import type { packageJson } from '@toolbox-ts/configs';
import type { RepoType } from '@toolbox-ts/configs/core';
import type {
  commitlint,
  depcruiser,
  prettier,
  tseslint,
  vitest
} from '@toolbox-ts/configs/runtime';
import type { tsconfigs, tsdoc } from '@toolbox-ts/configs/static';

import type {
  ConflictFileData,
  InstallDependencyOptions
} from '../project/index.js';

export interface AllInputConfigs<R extends RepoType> {
  runtime?: Partial<RuntimeConfigs>;
  static?: Partial<StaticConfigs<R>>;
}

export interface AllInputTsConfigs<R extends RepoType = RepoType> {
  base: tsconfigs.Base.InputConfig;
  build: R extends 'monorepo' ? tsconfigs.Monorepo.Build.InputConfig
  : tsconfigs.SinglePkg.Build.InputConfig;
  dev: tsconfigs.Dev.InputConfig;
  test: tsconfigs.Test.InputConfig;
}
export interface AllTsConfigs<R extends RepoType = RepoType> {
  base: tsconfigs.Base.Config;
  build: R extends 'monorepo' ? tsconfigs.Monorepo.Build.Config
  : tsconfigs.SinglePkg.Build.Config;
  dev: tsconfigs.Dev.Config;
  reference: tsconfigs.Reference.Config;
  test: tsconfigs.Test.Config;
}

export interface OrchestratorConfigEntry<C = unknown> {
  dependencies: [packageName: string, opts: InstallDependencyOptions][];
  files?: {
    contentSerializer: (...args: any[]) => unknown;
    fileData: ConflictFileData;
    filename: string;
  }[];
  pkgPatch?: { [key: string]: unknown } & Partial<packageJson.Config>;
  postProcess?: () => Promise<void> | void;
  preProcess?: (cfg?: C) => C | Promise<C>;
}

export interface RuntimeConfigs {
  commitlint: commitlint.Config;
  depcruiser: depcruiser.Config;
  prettier: prettier.Config;
  tseslint: tseslint.Config;
  vitest: vitest.Config;
}

export interface StaticConfigs<R extends RepoType = RepoType> {
  packageJson: packageJson.Config;
  tsconfigs: AllTsConfigs<R>;
  tsdoc: tsdoc.Config;
}

export type StaticInputConfigs<R extends RepoType = RepoType> = Partial<{
  packageJson: packageJson.Config;
  tsconfigs: Partial<AllInputTsConfigs<R>>;
  tsdoc: tsdoc.Config;
}>;
