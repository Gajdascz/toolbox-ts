/**
 * pnpm peer dependency resolution behavior.
 */
export interface Peers {
  /**
   * Automatically install missing non-optional peer dependencies.
   *
   * @see https://pnpm.io/settings#autoinstallpeers
   */
  autoInstallPeers?: boolean;

  /**
   * Deduplicate packages after peer dependency resolution
   * when there are no conflicting peer requirements.
   *
   * @see https://pnpm.io/settings#dedupepeerdependents
   */
  dedupePeerDependents?: boolean;

  /**
   * Rules for suppressing or relaxing peer dependency warnings.
   *
   * @see https://pnpm.io/settings#peerdependencyrules
   */
  peerDependencyRules?: {
    /**
     * Allow any version for matching peer dependency names.
     */
    allowAny?: string[];

    /**
     * Allow specific versions for otherwise unmet peer ranges.
     *
     * Keys may include selectors like `pkg@1>peer`.
     */
    allowedVersions?: Record<string, string>;

    /**
     * Ignore missing peer dependencies matching these patterns.
     */
    ignoreMissing?: string[];
  };

  /**
   * Resolve peer dependencies from the workspace root.
   *
   * @see https://pnpm.io/settings#resolvepeersfromworkspaceroot
   */
  resolvePeersFromWorkspaceRoot?: boolean;

  /**
   * Fail commands on missing or invalid peer dependencies.
   *
   * @see https://pnpm.io/settings#strictpeerdependencies
   */
  strictPeerDependencies?: boolean;
}
