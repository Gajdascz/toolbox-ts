/**
 * pnpm lockfile generation and consumption settings.
 * Controls how dependency resolution is persisted.
 */
export interface Lockfile {
  /**
   * Generate a lockfile name based on the current git branch.
   *
   * Used to avoid merge conflicts in long-lived branches.
   *
   * @see https://pnpm.io/settings#gitbranchlockfile
   */
  gitBranchLockfile?: boolean;

  /**
   * Enable or disable reading and writing of pnpm-lock.yaml.
   *
   * @see https://pnpm.io/settings#lockfile
   */
  lockfile?: boolean;

  /**
   * Include the full tarball URL for each package
   * in pnpm-lock.yaml entries.
   *
   * @see https://pnpm.io/settings#lockfileincludetarballurl
   */
  lockfileIncludeTarballUrl?: boolean;

  /**
   * Branch name patterns that trigger automatic merging
   * of git branch lockfiles.
   *
   * Supports glob patterns and exclusions using `!`.
   *
   * @see https://pnpm.io/settings#mergegitbranchlockfilesbranchpattern
   */
  mergeGitBranchLockfilesBranchPattern?: null | string[];

  /**
   * Maximum length of the peer dependency suffix
   * added to dependency keys in the lockfile.
   *
   * Longer suffixes are replaced with a hash.
   *
   * @see https://pnpm.io/settings#peerssuffixmaxlength
   */
  peersSuffixMaxLength?: number;

  /**
   * Perform a headless install when the lockfile satisfies
   * package.json dependency requirements.
   *
   * Skips dependency resolution and lockfile modification.
   *
   * @see https://pnpm.io/settings#preferfrozenlockfile
   */
  preferFrozenLockfile?: boolean;
}
