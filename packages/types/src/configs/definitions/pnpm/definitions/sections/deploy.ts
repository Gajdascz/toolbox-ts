/**
 * Deploy-related pnpm settings.
 */
export interface Deploy {
  /**
   * Use legacy deploy behavior instead of generating a deployment lockfile.
   *
   * @see https://pnpm.io/settings#forcelegacydeploy
   */
  forceLegacyDeploy?: boolean;
}
