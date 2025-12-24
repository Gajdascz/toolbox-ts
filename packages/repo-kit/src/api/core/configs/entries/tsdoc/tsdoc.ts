import { tsdoc } from '@toolbox-ts/configs';

import type { OrchestratorConfigEntry } from '../../types.js';

import { mapConfigModuleDeps } from '../../../project/index.js';
export type Config = tsdoc.Config;
export const get = (): OrchestratorConfigEntry<Config> => ({
  files: [
    {
      filename: tsdoc.meta.filename,
      contentSerializer: tsdoc.define,
      fileData: { type: 'default', name: 'static' }
    }
  ],
  dependencies: mapConfigModuleDeps(tsdoc.meta.dependencies)
});
