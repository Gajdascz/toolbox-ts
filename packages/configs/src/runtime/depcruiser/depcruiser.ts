import type { IConfiguration } from 'dependency-cruiser';

import { createRuntimeConfigModule, THIS_PACKAGE } from '../../core/index.js';
import {
  forbiddenRules,
  type InputDepCruiserConfig,
  options
} from './core/index.js';

export const { define, getTemplateString, meta } = createRuntimeConfigModule({
  filename: '.dependency-cruiser.js',
  dependencies: ['dependency-cruiser'],
  importName: 'depcruiser',
  importFrom: THIS_PACKAGE,
  define: async ({
    options: inputOptions = {},
    forbidden = {},
    ...rest
  }: InputDepCruiserConfig = {}): Promise<IConfiguration> => {
    const { cfg: forbiddenCfg, extended: forbiddenExtensions } = forbidden;
    return {
      ...rest,
      forbidden: forbiddenRules.resolve(forbiddenCfg, forbiddenExtensions),
      options: await options.resolve(inputOptions)
    };
  }
});
export type Config = InputDepCruiserConfig;
