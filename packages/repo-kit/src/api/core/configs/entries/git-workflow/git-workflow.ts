import { commitlint } from '@toolbox-ts/configs';

import type { OrchestratorConfigEntry } from '../../types.js';

import { mapConfigModuleDeps } from '../../../project/index.js';
import { husky } from './husky/index.js';
import { lintStaged } from './lint-staged/index.js';

const CZ_PKG_NAME = 'commitizen';

const CZ_COMMITLINT_PLUGIN = '@commitlint/cz-commitlint';

export interface Config {
  husky?: husky.Config;
  includeCommitizen?: boolean;
  lintStaged?: lintStaged.Config;
}
export const get = ({
  husky: huskyCfg,
  lintStaged: lintStagedCfg,
  includeCommitizen = true
}: Partial<Config> = {}): OrchestratorConfigEntry<Config> => {
  const { dependencies: lsDeps, pkgPatch: lsPkgPatch } =
    lintStaged.getEntry(lintStagedCfg);
  const { dependencies: huskyDeps, postProcess: huskyPostProcess } =
    husky.getEntry(huskyCfg);
  const dependencies = [
    ...mapConfigModuleDeps(commitlint.meta.dependencies),
    ...lsDeps,
    ...huskyDeps
  ];
  if (includeCommitizen)
    dependencies.push(
      [CZ_PKG_NAME, { isDev: true }],
      [CZ_COMMITLINT_PLUGIN, { isDev: true }]
    );
  return {
    dependencies,
    postProcess: async () => {
      await huskyPostProcess?.();
      await husky.writeToGitHook(
        'commitMsg',
        'pnpm exec commitlint --edit "$1"'
      );
      await husky.writeToGitHook('preCommit', 'pnpm run lint-staged');
    },
    pkgPatch: {
      ...lsPkgPatch,
      ...(includeCommitizen && {
        config: { commitizen: { path: CZ_COMMITLINT_PLUGIN } }
      })
    }
  };
};
/* c8 ignore end  */
