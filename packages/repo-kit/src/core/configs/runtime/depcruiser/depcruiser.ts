import type { IConfiguration } from 'dependency-cruiser';

import {
  forbiddenRules,
  type InputDepCruiserConfig,
  options
} from './core/index.js';

export type Config = InputDepCruiserConfig;
export const define = async ({
  options: inputOptions = {},
  forbidden = {},
  ...rest
}: Config = {}): Promise<IConfiguration> => {
  const { cfg: forbiddenCfg, extended: forbiddenExtensions } = forbidden;
  return {
    ...rest,
    forbidden: forbiddenRules.resolve(forbiddenCfg, forbiddenExtensions),
    options: await options.resolve(inputOptions)
  };
};

// export const depcruiser = (repoType: RepoType) => {
//   const includes =
//     repoType === 'monorepo' ? GLOB_ALL_MONOREPO_SRC_DIRS : SRC_DIR;
//   return createConfigModule<InputDepCruiserConfig, IConfiguration>({
//     fileType: 'runtime',
//     description:
//       'Dependency Cruiser configuration to analyze and visualize module dependencies.',
//     name: 'Dependency Cruiser',
//     filename: DEPENDENCY_CRUISER_CONFIG_FILE,
//     dependencies: [{ packageName: 'dependency-cruiser', isDev: true }],
//     importName: 'depcruiser',
//     importFrom: THIS_PACKAGE,
//     url: 'https://github.com/sverweij/dependency-cruiser',
//     packagePatch: {
//       scripts: {
//         'check:deps': `pnpm depcruise ${includes}`,
//         'gen:deps-report': `pnpm depcruise ${includes} --output-type dot | dot -T svg > ${REPO_ROOT['.artifacts']['reports']['dependencies']}/graph.svg`
//       }
//     },

// };
