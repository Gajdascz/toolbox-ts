/**
 * pnpm CLI and execution behavior.
 */
export interface Cli {
  /**
   * Control colored output.
   *
   * @see https://pnpm.io/settings#color
   */
  color?: 'always' | 'auto' | 'never';

  /**
   * Enforce Node.js engine compatibility for dependencies.
   *
   * @see https://pnpm.io/settings#enginestrict
   */
  engineStrict?: boolean;

  /**
   * Minimum log level to display.
   *
   * @see https://pnpm.io/settings#loglevel
   */
  loglevel?: 'debug' | 'error' | 'info' | 'warn';

  /**
   * Automatically download and run the pnpm version
   * specified in package.json.
   *
   * @see https://pnpm.io/settings#managepackagemanagerversions
   */
  managePackageManagerVersions?: boolean;

  /**
   * Path to the npm binary used by pnpm.
   *
   * @see https://pnpm.io/settings#npmpath
   */
  npmPath?: string;

  /**
   * Fail if a different package manager is declared
   * in package.json.
   *
   * @see https://pnpm.io/settings#packagemanagerstrict
   */
  packageManagerStrict?: boolean;

  /**
   * Fail if pnpm version does not exactly match
   * package.json `packageManager`.
   *
   * @see https://pnpm.io/settings#packagemanagerstrictversion
   */
  packageManagerStrictVersion?: boolean;

  /**
   * Make `pnpm install` behave like `pnpm install -r`.
   *
   * @see https://pnpm.io/settings#recursiveinstall
   */
  recursiveInstall?: boolean;

  /**
   * Enable experimental beta CLI features.
   *
   * @see https://pnpm.io/settings#usebetacli
   */
  useBetaCli?: boolean;
}
