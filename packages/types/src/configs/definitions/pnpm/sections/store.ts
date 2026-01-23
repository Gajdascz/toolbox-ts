/**
 * pnpm content-addressable store configuration.
 * Controls where packages are stored and how store integrity is enforced.
 */
export interface Store {
  /**
   * Filesystem path to the pnpm store.
   *
   * The store should reside on the same disk as the project to allow
   * hard-linking. If located on a different filesystem, pnpm will fall
   * back to copying packages.
   *
   * @see https://pnpm.io/settings#storedir
   */
  storeDir?: string;

  /**
   * Enforce strict validation of package name and version
   * against stored content.
   *
   * Some registries publish identical content under different
   * names or versions, which breaks strict validation.
   *
   * @see https://pnpm.io/settings#strictstorepkgcontentcheck
   */
  strictStorePkgContentCheck?: boolean;

  /**
   * Require a running pnpm store server for installations.
   *
   *
   * @deprecated Deprecated and dangerous. If no store server is running,
   * installation will fail.
   * @see https://pnpm.io/settings#userunningstoreserver
   */
  useRunningStoreServer?: boolean;

  /**
   * Verify file integrity in the store before linking packages
   * into node_modules.
   *
   * Disabling this skips checksum validation and may improve
   * performance at the cost of safety.
   *
   * @see https://pnpm.io/settings#verifystoreintegrity
   */
  verifyStoreIntegrity?: boolean;
}
