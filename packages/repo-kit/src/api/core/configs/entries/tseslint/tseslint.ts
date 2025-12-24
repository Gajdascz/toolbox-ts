import { tseslint } from '@toolbox-ts/configs';

import type { OrchestratorConfigEntry } from '../../types.js';

import { mapConfigModuleDeps } from '../../../project/index.js';
export type Config = tseslint.Config;
export const get = (): OrchestratorConfigEntry<Config> => ({
  files: [
    {
      filename: tseslint.meta.filename,
      contentSerializer: tseslint.getTemplateString,
      fileData: {
        name: 'runtime',
        type: 'default',
        options: {
          serialize: {
            fn: tseslint.getTemplateString,
            name: 'tseslint.getTemplateString'
          }
        }
      }
    }
  ],
  dependencies: mapConfigModuleDeps(tseslint.meta.dependencies),
  pkgPatch: { scripts: { 'check:lint': `pnpm eslint . --max-warnings=0` } }
});
