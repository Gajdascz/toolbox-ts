/**
 * pnpm registry and authentication configuration.
 * Controls package resolution sources and access credentials.
 */
export interface Registry {
  /**
   * Base URL of the JSR registry.
   *
   * @see https://pnpm.io/settings#jsrregistry
   */
  '@jsr:registry'?: string;

  /**
   * Base URL of the default npm registry.
   *
   * @see https://pnpm.io/settings#registry
   */
  registry?: string;

  /**
   * Registry overrides per npm scope.
   *
   * Example:
   * ```ts
   * {
   *   "@babel": "https://example.com/npm/"
   * }
   * ```
   *
   * @see https://pnpm.io/settings#scoperegistry
   */
  scopeRegistries?: Record<string, string>;

  // /**
  //  * Authentication tokens per registry URL.
  //  *
  //  * Keys must be full registry URLs, including protocol.
  //  * Values may be literal tokens or environment variable references.
  //  *
  //  * @see https://pnpm.io/settings#authtoken
  //  * <URL>:_authToken
  //  */

  // /**
  //  * Executable token helpers per registry URL.
  //  *
  //  * Paths must be absolute and may only be defined
  //  * in the user-level .npmrc for security reasons.
  //  *
  //  * @see https://pnpm.io/settings#tokenhelper
  //  * <URL>:tokenHelper
  //  */
  // tokenHelpers?: Record<string, string>;
}
