import { findFirstUp, loadModule } from '@toolbox-ts/file';
import { Obj } from '@toolbox-ts/utils';

import type { InputConfig } from '../../definitions/types.js';

import { defaultConfig } from './defaults.js';
// Simply wraps file functions with error handling
/* c8 ignore start */
export const loadConfig = async (
  cfgFileName = defaultConfig.configFileName,
  startDir: string = process.cwd()
): Promise<InputConfig | undefined> => {
  const cfgPath = await findFirstUp(cfgFileName, { startDir });
  if (cfgPath) {
    const { result, error } = await loadModule<InputConfig>(cfgPath);
    if (error)
      throw new Error(
        `Failed to load configuration from ${cfgPath}\nError: ${error}`
      );
    else if (!result || !Obj.is.obj(result))
      throw new TypeError(
        `Configuration file ${cfgPath} should export a Configuration object, but got: ${typeof result}`
      );

    return result;
  }
  return undefined;
};
/* c8 ignore end */
