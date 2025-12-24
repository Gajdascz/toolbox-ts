import { prettier } from '@toolbox-ts/configs';

import type { OrchestratorConfigEntry } from '../../types.js';

import { mapConfigModuleDeps } from '../../../project/index.js';
export type Config = prettier.Config;
export const get = (): OrchestratorConfigEntry<Config> => ({
  files: [
    {
      filename: prettier.meta.filename,
      contentSerializer: prettier.getTemplateString,
      fileData: {
        name: 'runtime',
        type: 'default',
        options: {
          serialize: {
            fn: prettier.getTemplateString,
            name: 'prettier.getTemplateString'
          }
        }
      }
    }
  ],
  dependencies: mapConfigModuleDeps(prettier.meta.dependencies),
  pkgPatch: { scripts: { 'check:format': `pnpm prettier --check .` } }
});
