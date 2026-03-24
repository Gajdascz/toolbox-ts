/* c8 ignore start */
// Just wraps already tested internal logic
import { FILES } from '@toolbox-ts/constants/fs';
import { type InputConfig, type ProcessedConfig } from './types/index.js';
import { options } from './options/index.js';
import { forbiddenRules } from './rules/index.js';
import { runtimeConfigToFileContent, serializeJson } from '../../../helpers.js';

export const define = async ({
  options: inputOptions = {},
  forbidden = {},
  ...rest
}: InputConfig = {}): Promise<ProcessedConfig> => {
  const { cfg: forbiddenCfg, extended: forbiddenExtensions } = forbidden;
  return {
    ...rest,
    forbidden: forbiddenRules.resolve(forbiddenCfg, forbiddenExtensions),
    options: await options.resolve(inputOptions)
  };
};

export const toFileContent = (config?: InputConfig) =>
  runtimeConfigToFileContent('depcruiser', [serializeJson(config)]);

export const toFileEntry = (config?: InputConfig) => ({
  [FILES.CONFIG.DEPCRUISER]: toFileContent(config)
});
