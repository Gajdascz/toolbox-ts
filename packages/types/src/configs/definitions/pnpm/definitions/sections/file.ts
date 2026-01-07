/**
 * PNPM File Configuration
 */
export interface File {
  /**
   * Location of a global pnpmfile.
   * @see {@link https://pnpm.io/settings#globalpnpmfile}
   */
  globalPnpmfile?: string;
  /**
   * Whether to ignore any pnpmfile(s) specified.
   * @see {@link https://pnpm.io/settings#ignorepnpmfile}
   */
  ignorePnpmfile?: boolean;
  /**
   * Location of local pnpmfile(s).
   * @see {@link https://pnpm.io/settings#pnpmfile}
   */
  pnpmfile?: string;
}
