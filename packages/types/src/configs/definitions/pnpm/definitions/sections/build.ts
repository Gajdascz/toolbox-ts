/**
 * Build-related pnpm settings.
 */
export interface Build {
  /**
   * Explicit allow/deny map for dependency build scripts.
   * Replaces onlyBuiltDependencies and ignoredBuiltDependencies.
   *
   * @see https://pnpm.io/settings#allowbuilds
   */
  allowBuilds?: Record<string, boolean>;

  /**
   * Maximum number of child processes used to build node_modules.
   *
   * @see https://pnpm.io/settings#childconcurrency
   */
  childConcurrency?: number;

  /**
   * Allow all dependency build scripts to run without approval.
   * Highly insecure.
   *
   * @see https://pnpm.io/settings#dangerouslyallowallbuilds
   */
  dangerouslyAllowAllBuilds?: boolean;

  /**
   * Packages that are blocked from running lifecycle scripts
   * without warnings.
   *
   * @see https://pnpm.io/settings#ignoredbuiltdependencies
   */
  ignoredBuiltDependencies?: string[];

  /**
   * Do not execute lifecycle scripts of installed dependencies.
   * Project-level scripts are still executed.
   *
   * @see https://pnpm.io/settings#ignoredepscripts
   */
  ignoreDepScripts?: boolean;

  /**
   * Do not execute any scripts defined in the project package.json
   * or in its dependencies.
   *
   * Does not prevent execution of `.pnpmfile.cjs`.
   *
   * @see https://pnpm.io/settings#ignorescripts
   */
  ignoreScripts?: boolean;

  /**
   * Packages that are never allowed to run lifecycle scripts.
   *
   * @see https://pnpm.io/settings#neverbuiltdependencies
   */
  neverBuiltDependencies?: string[];

  /**
   * Node.js options passed via the NODE_OPTIONS environment variable
   * to lifecycle scripts.
   *
   * @see https://pnpm.io/settings#nodeoptions
   */
  nodeOptions?: string;

  /**
   * Packages explicitly allowed to run lifecycle scripts.
   *
   * @see https://pnpm.io/settings#onlybuiltdependencies
   */
  onlyBuiltDependencies?: string[];

  /**
   * Path to a JSON file listing packages allowed to run lifecycle scripts.
   *
   * @see https://pnpm.io/settings#onlybuiltdependenciesfile
   */
  onlyBuiltDependenciesFile?: string;

  /**
   * Cache the results of preinstall and postinstall scripts.
   * Cached builds are reused across installations on the same machine.
   *
   * @see https://pnpm.io/settings#sideeffectscache
   */
  sideEffectsCache?: boolean;

  /**
   * Only read from the side-effects cache if it exists.
   * New cache entries will not be created.
   *
   * @see https://pnpm.io/settings#sideeffectscachereadonly
   */
  sideEffectsCacheReadonly?: boolean;

  /**
   * Fail installation if dependencies contain unreviewed build scripts.
   *
   * @see https://pnpm.io/settings#strictdepbuilds
   */
  strictDepBuilds?: boolean;

  /**
   * Enable UID/GID switching when running lifecycle scripts.
   * Required when running as root.
   *
   * @see https://pnpm.io/settings#unsafeperm
   */
  unsafePerm?: boolean;

  /**
   * Verify dependency state before running scripts.
   *
   * @see https://pnpm.io/settings#verifydepsbeforerun
   */
  verifyDepsBeforeRun?: 'error' | 'install' | 'prompt' | 'warn' | false;
}
