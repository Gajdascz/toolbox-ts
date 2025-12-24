import { tsconfigs } from '@toolbox-ts/configs';
import { type RepoType, TsConfigs } from '@toolbox-ts/configs/core';

import type {
  AllInputTsConfigs,
  OrchestratorConfigEntry
} from '../../types.js';

import { mapConfigModuleDeps } from '../../../project/index.js';

export type Config<R extends RepoType> = Partial<AllInputTsConfigs<R>>;
const fileData = { type: 'default', name: 'static' } as const;
export const get = <R extends RepoType>(
  repoType: R
): OrchestratorConfigEntry<Config<R>> => {
  const buildTsConfigType = repoType === 'monorepo' ? 'Monorepo' : 'SinglePkg';

  return {
    dependencies: mapConfigModuleDeps(tsconfigs.DEPENDENCIES),
    files: [
      {
        filename: tsconfigs.Reference.meta.filename,
        contentSerializer: tsconfigs.Reference.define,
        fileData
      },
      {
        filename: tsconfigs.Base.meta.filename,
        contentSerializer: tsconfigs.Base.define,
        fileData
      },
      {
        filename: tsconfigs.Dev.meta.filename,
        contentSerializer: tsconfigs.Dev.define,
        fileData
      },
      {
        filename: tsconfigs.Test.meta.filename,
        contentSerializer: tsconfigs.Test.define,
        fileData
      },
      {
        filename: tsconfigs[buildTsConfigType].Build.meta.filename,
        contentSerializer: tsconfigs[buildTsConfigType].Build.define,
        fileData
      }
    ],
    pkgPatch: {
      scripts: {
        build: `tsc -b ${TsConfigs.FILENAMES.build}`,
        'check:types': `tsc -b ${TsConfigs.FILENAMES.build} --noEmit`
      }
    }
  };
};
