/**
 * Workspace-related pnpm settings.
 */
export interface Workspace {
  /**
   * Deduplicate injected dependencies using symlinks when possible.
   *
   * @see https://pnpm.io/settings#dedupeinjecteddeps
   */
  dedupeInjectedDeps?: boolean;

  /**
   * Fail installation if workspace dependency cycles are detected.
   *
   * @see https://pnpm.io/settings#disallowworkspacecycles
   */
  disallowWorkspaceCycles?: boolean;

  /**
   * Fail if no workspace packages match a filter.
   *
   * @see https://pnpm.io/settings#failifnomatch
   */
  failIfNoMatch?: boolean;

  /**
   * Suppress warnings about workspace dependency cycles.
   *
   * @see https://pnpm.io/settings#ignoreworkspacecycles
   */
  ignoreWorkspaceCycles?: boolean;

  /**
   * Include the workspace root when running recursive commands.
   *
   * @see https://pnpm.io/settings#includeworkspaceroot
   */
  includeWorkspaceRoot?: boolean;

  /**
   * Hard-link workspace dependencies instead of symlinking them.
   *
   * @see https://pnpm.io/settings#injectworkspacepackages
   */
  injectWorkspacePackages?: boolean;

  /**
   * Link local workspace packages instead of downloading them.
   *
   * @see https://pnpm.io/settings#linkworkspacepackages
   */
  linkWorkspacePackages?: 'deep' | boolean;

  /**
   * Prefer workspace packages over registry versions.
   *
   * @see https://pnpm.io/settings#preferworkspacepackages
   */
  preferWorkspacePackages?: boolean;

  /**
   * Controls how workspace dependencies are saved to package.json.
   *
   * @see https://pnpm.io/settings#saveworkspaceprotocol
   */
  saveWorkspaceProtocol?: 'rolling' | boolean;

  /**
   * Use a single lockfile for the entire workspace.
   *
   * @see https://pnpm.io/settings#sharedworkspacelockfile
   */
  sharedWorkspaceLockfile?: boolean;

  /**
   * Scripts that trigger synchronization of injected dependencies.
   *
   * @see https://pnpm.io/settings#syncinjecteddepsafterscripts
   */
  syncInjectedDepsAfterScripts?: string[];
}
