import type { packageJson } from '@toolbox-ts/configs';
import type { ToEntryTuples } from '@toolbox-ts/types';

import { merge, type RepoType } from '@toolbox-ts/configs/core';
import { isFile, writeFile } from '@toolbox-ts/file';
import path from 'node:path';

import {
  type ConflictResolutionResult,
  type ConflictStrategy,
  handleConflict,
  installDependencies,
  type InstallDependencyResult,
  type PackageJsonOps
} from '../../project/index.js';
import {
  depcruiserEntry,
  gitWorkflowEntry,
  prettierEntry,
  tsconfigsEntry,
  tsdocEntry,
  tseslintEntry,
  vitestEntry
} from '../entries/index.js';

export interface OrchestratorConfig<R extends RepoType> {
  configs?: OrchestratorConfigs<R>;
  defaultOnFileConflict?: ConflictStrategy;
  pkgOps: PackageJsonOps;
  repoType: R;
  writePath: string;
}
export type OrchestratorConfigEntries<R extends RepoType> = ToEntryTuples<
  OrchestratorConfigEntriesObject<R>
>;
export interface OrchestratorConfigEntriesObject<R extends RepoType> {
  depcruiser: ReturnType<typeof depcruiserEntry.get>;
  gitWorkflow: ReturnType<typeof gitWorkflowEntry.get>;
  prettier: ReturnType<typeof prettierEntry.get>;
  tsconfigs: ReturnType<typeof tsconfigsEntry.get<R>>;
  tsdoc: ReturnType<typeof tsdocEntry.get>;
  tseslint: ReturnType<typeof tseslintEntry.get>;
  vitest: ReturnType<typeof vitestEntry.get>;
}
export type OrchestratorConfigEntryConfig<C> = {
  onConflict?: ConflictStrategy;
  processPriority?: number;
} & C;
export interface OrchestratorConfigs<R extends RepoType = RepoType> {
  depcruiser?: OrchestratorConfigEntryConfig<depcruiserEntry.Config>;
  gitWorkflow?: OrchestratorConfigEntryConfig<gitWorkflowEntry.Config>;
  prettier?: OrchestratorConfigEntryConfig<prettierEntry.Config>;
  tsconfigs?: OrchestratorConfigEntryConfig<tsconfigsEntry.Config<R>>;
  tsdoc?: OrchestratorConfigEntryConfig<{ rules?: tsdocEntry.Config }>;
  tseslint?: OrchestratorConfigEntryConfig<tseslintEntry.Config>;
  vitest?: OrchestratorConfigEntryConfig<vitestEntry.Config>;
}
export const getEntries = <R extends RepoType>(
  repoType: R,
  opts: OrchestratorConfigs = {}
): [...OrchestratorConfigEntries<R>, conflictStrategy?: ConflictStrategy][] =>
  [
    [
      opts.depcruiser?.processPriority ?? 0,
      'depcruiser',
      depcruiserEntry.get(repoType),
      opts.depcruiser?.onConflict
    ],
    [
      opts.prettier?.processPriority ?? 0,
      'prettier',
      prettierEntry.get(),
      opts.prettier?.onConflict
    ],
    [
      opts.tsdoc?.processPriority ?? 0,
      'tsdoc',
      tsdocEntry.get(),
      opts.tsdoc?.onConflict
    ],
    [
      opts.tseslint?.processPriority ?? 0,
      'tseslint',
      tseslintEntry.get(),
      opts.tseslint?.onConflict
    ],
    [
      opts.vitest?.processPriority ?? 0,
      'vitest',
      vitestEntry.get(opts.vitest),
      opts.vitest?.onConflict
    ],
    [
      opts.tsconfigs?.processPriority ?? 0,
      'tsconfigs',
      tsconfigsEntry.get<R>(repoType),
      opts.tsconfigs?.onConflict
    ],
    [
      opts.gitWorkflow?.processPriority ?? 0,
      'gitWorkflow',
      gitWorkflowEntry.get(opts.gitWorkflow),
      opts.gitWorkflow?.onConflict
    ]
  ]
    .sort((a, b) => (a[0] as number) - (b[0] as number))
    .map(
      ([, key, entry]) => [key, entry] as const
    ) as OrchestratorConfigEntries<R>[];

export interface OrchestratorEntryResult {
  files:
    | { conflict: ConflictResolutionResult | false; path: string }[]
    | undefined;
  installedDependencies: InstallDependencyResult[];
  pkgPatch: Partial<packageJson.Config>;
  processOrder: number;
}
export interface OrchestratorResult<R extends RepoType> {
  entries: Record<
    keyof OrchestratorConfigEntriesObject<R>,
    OrchestratorEntryResult
  >;
  finalPkgPatch: packageJson.Config;
  packageJsonPath: string;
}
export const orchestrateConfigs = async <R extends RepoType>({
  configs = {},
  repoType,
  writePath,
  pkgOps,
  defaultOnFileConflict = 'skip'
}: OrchestratorConfig<R>): Promise<OrchestratorResult<R>> => {
  const baseConfigFileDataResult: OrchestratorEntryResult = {
    processOrder: 0,
    files: undefined,
    installedDependencies: [],
    pkgPatch: {}
  };

  const finalPkgPatch: packageJson.Config = {};
  const result: OrchestratorResult<R> = {
    entries: {
      depcruiser: { ...baseConfigFileDataResult },
      gitWorkflow: { ...baseConfigFileDataResult },
      prettier: { ...baseConfigFileDataResult },
      tsconfigs: { ...baseConfigFileDataResult },
      tsdoc: { ...baseConfigFileDataResult },
      tseslint: { ...baseConfigFileDataResult },
      vitest: { ...baseConfigFileDataResult }
    },
    finalPkgPatch,
    packageJsonPath: pkgOps.path
  };
  const entries = getEntries<R>(repoType, configs);
  for (const [
    i,
    [
      name,
      { dependencies, files, pkgPatch = {} },
      conflictStrategy = defaultOnFileConflict
    ]
  ] of entries.entries()) {
    result.entries[name].processOrder = i;
    const depsResult = await installDependencies(dependencies);
    result.entries[name].installedDependencies = depsResult;
    result.entries[name].pkgPatch = pkgPatch;
    merge(finalPkgPatch, pkgPatch, true);

    if (files) {
      result.entries[name].files = [];
      for (const { contentSerializer, filename, fileData } of files) {
        const filePath = path.join(writePath, filename);
        const isConflict = await isFile(filePath);
        if (!isConflict) {
          await writeFile(filePath, contentSerializer(configs[name]));
          result.entries[name].files.push({ conflict: false, path: filePath });
        } else {
          result.entries[name].files.push({
            path: filePath,
            conflict: await handleConflict(conflictStrategy, {
              filePath: filePath,
              incomingData: configs[name],
              fileData
            })
          });
        }
      }
    }
  }
  merge(
    finalPkgPatch,
    {
      scripts: {
        check: (await pkgOps.scripts.find('check'))
          .map(([key]) => `pnpm run ${key}`)
          .join(' && '),
        up: 'corepack up && pnpm -r up',
        'build:clean': 'pnpm clean && pnpm build && pnpm install'
      }
    },
    true
  );
  await pkgOps.merge(finalPkgPatch);
  return result;
};
