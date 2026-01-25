export * from './lint-staged/index.js';
export * from './package/index.js';
export * from './tsdoc/index.js';
export * as tsconfigs from './tsconfigs/index.js';

import { lintStaged } from './lint-staged/index.js';
import { packageJson } from './package/index.js';
import { tsdoc } from './tsdoc/index.js';
import * as tsconfigs from './tsconfigs/index.js';

export const json = { lintStaged, packageJson, tsdoc, tsconfigs } as const;
export type JsonConfigs = typeof json;
export type JsonConfig = keyof JsonConfigs;
