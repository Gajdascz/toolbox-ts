export interface Other {
  /**
   * Location of pnpm cache (metadata and dlx).
   * @see https://pnpm.io/settings#cachedir
   */
  cacheDir?: string;

  /**
   * Controls how dependencies are added to the default catalog.
   * @see https://pnpm.io/settings#catalogmode
   */
  catalogMode?: 'manual' | 'prefer' | 'strict';

  /**
   * Explicitly indicate whether the environment is CI.
   * @see https://pnpm.io/settings#ci
   */
  ci?: boolean;

  /**
   * Remove unused catalog entries during installation.
   * @see https://pnpm.io/settings#cleanupunusedcatalogs
   */
  cleanupUnusedCatalogs?: boolean;

  /**
   * Avoid symlinking direct dependencies already present at root.
   * @see https://pnpm.io/settings#dedupedirectdeps
   */
  dedupeDirectDeps?: boolean;

  /**
   * Copy all files when deploying or installing local packages.
   * @see https://pnpm.io/settings#deployallfiles
   */
  deployAllFiles?: boolean;

  /**
   * Enable automatic pre/post script execution.
   * @see https://pnpm.io/settings#enableprepostscripts
   */
  enablePrePostScripts?: boolean;

  /**
   * Extend NODE_PATH environment variable in command shims.
   * @see https://pnpm.io/settings#extendnodepath
   */
  extendNodePath?: boolean;

  /**
   * Directory for bin files of globally installed packages.
   * @see https://pnpm.io/settings#globalbindir
   */
  globalBinDir?: string;

  /**
   * Custom directory to store global packages.
   * @see https://pnpm.io/settings#globaldir
   */
  globalDir?: string;

  /**
   * Ignore automatic compatibility patches.
   * @see https://pnpm.io/settings#ignorecompatibilitydb
   */
  ignoreCompatibilityDb?: boolean;

  /**
   * Perform fast check for repeat installs.
   * @see https://pnpm.io/settings#optimisticrepeatinstall
   */
  optimisticRepeatInstall?: boolean;

  /**
   * Prefer symlinked executables in node_modules/.bin instead of shims.
   * @see https://pnpm.io/settings#prefersymlinkedexecutables
   */
  preferSymlinkedExecutables?: boolean;

  /**
   * Enable if registry supports time field for time-based resolution mode.
   * @see https://pnpm.io/settings#registrysupportstimefield
   */
  registrySupportsTimeField?: boolean;

  /**
   * List of scripts required in each workspace project.
   * @see https://pnpm.io/settings#requiredscripts
   */
  requiredScripts?: string[];

  /**
   * Dependency resolution mode: highest, time-based, or lowest-direct.
   * @see https://pnpm.io/settings#resolutionmode
   */
  resolutionMode?: 'highest' | 'lowest-direct' | 'time-based';

  /**
   * How versions of packages installed to a `package.json` file get prefixed.
   * @see https://pnpm.io/settings#saveprefix
   */
  savePrefix?: string;

  /**
   * Custom shell to run scripts via `pnpm run`.
   * @see https://pnpm.io/settings#scriptshell
   */
  scriptShell?: string;

  /**
   * Use JS-based shell emulator for scripts (cross-platform support).
   * @see https://pnpm.io/settings#shellemulator
   */
  shellEmulator?: boolean;

  /**
   * Directory for pnpm state file, used by update checker.
   * @see https://pnpm.io/settings#statedir
   */
  stateDir?: string;

  /**
   * When adding a package without a specific version, the version
   * tagged with this tag will be installed.
   * @see https://pnpm.io/settings#tag
   */
  tag?: string;

  /**
   * Suppress the update notification.
   * @see https://pnpm.io/settings#updatenotifier
   */
  updateNotifier?: boolean;

  /**
   * When true, all output is written to stderr.
   * @see https://pnpm.io/settings#usestderr
   */
  useStderr?: boolean;
}
