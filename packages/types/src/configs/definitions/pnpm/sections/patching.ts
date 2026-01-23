/**
 * Dependency patching settings.
 */
export interface Patching {
  /**
   * Do not fail if some patches are not applied.
   *
   * @see https://pnpm.io/settings#allowunusedpatches
   */
  allowUnusedPatches?: boolean;

  /**
   * Control behavior when a patch fails to apply.
   *
   * @see https://pnpm.io/settings#ignorepatchfailures
   */
  ignorePatchFailures?: boolean;

  /**
   * Map of dependency selectors to patch file paths.
   *
   * @see https://pnpm.io/settings#patcheddependencies
   */
  patchedDependencies?: Record<string, string>;
}
