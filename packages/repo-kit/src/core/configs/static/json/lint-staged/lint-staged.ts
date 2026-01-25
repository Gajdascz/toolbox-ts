import { SRC_FILE_EXTS } from '../../../../../../core/index.js';

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
export const define = ({
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
