import { depcruiser } from '@toolbox-ts/configs';
import {
  PACKAGES_DIR,
  REPORTS_PATH,
  type RepoType,
  SRC_DIR
} from '@toolbox-ts/configs/core';

import type { OrchestratorConfigEntry } from '../../types.js';

import { mapConfigModuleDeps } from '../../../project/index.js';
export type Config = depcruiser.Config;
export const get = (repoType: RepoType): OrchestratorConfigEntry<Config> => {
  const includes =
    repoType === 'monorepo' ? `${PACKAGES_DIR}/**/${SRC_DIR}` : SRC_DIR;
  return {
    files: [
      {
        filename: depcruiser.meta.filename,
        contentSerializer: depcruiser.getTemplateString,
        fileData: {
          type: 'default',
          name: 'runtime',
          options: {
            serialize: {
              fn: depcruiser.getTemplateString,
              name: 'depcruiser.getTemplateString'
            }
          }
        }
      }
    ],
    dependencies: mapConfigModuleDeps(depcruiser.meta.dependencies),
    pkgPatch: {
      scripts: {
        'check:deps': `pnpm depcruise ${includes}`,
        'gen:deps-report': `pnpm depcruise ${includes} --output-type dot | dot -T svg > ${REPORTS_PATH}/dependencies/graph.svg`
      }
    }
  };
};
