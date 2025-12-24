import { SRC_FILE_EXTS } from '@toolbox-ts/configs/core';

import type { OrchestratorConfigEntry } from '../../../types.js';
export const PKG_NAME = 'lint-staged';
export interface Config {
  /**
   * Already Includes: `["json", "md", "yml", "yaml"]`
   * - Prettier --write is called on these files.
   */
  additionalPrettierWriteOnlyFileExts?: string[];
  /**
   * Already Includes: `["ts", "tsx", "js", "jsx", "cjs", "mjs"]`
   * - Eslint --fix and Prettier --write are called on these files.
   */
  additionalSrcFileExts?: string[];
  otherRules?: Record<string, string[]>;
}
export const getPackageJsonConfig = ({
  additionalPrettierWriteOnlyFileExts = [],
  additionalSrcFileExts = [],
  otherRules = {}
}: Config) => ({
  [`*.{${[...SRC_FILE_EXTS, ...additionalSrcFileExts].join(',')}}`]: [
    'pnpm eslint --fix',
    'pnpm prettier --write'
  ],
  [`*.{json,md,yml,yaml${
    additionalPrettierWriteOnlyFileExts.length > 0 ?
      ',' + additionalPrettierWriteOnlyFileExts.join(',')
    : ''
  }}`]: ['pnpm prettier --write'],
  ...otherRules
});
export const getEntry = (config: Config = {}): OrchestratorConfigEntry => ({
  dependencies: [[PKG_NAME, { isDev: true }]],
  pkgPatch: {
    [PKG_NAME]: getPackageJsonConfig(config),
    scripts: { [PKG_NAME]: PKG_NAME }
  }
});
