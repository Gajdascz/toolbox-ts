/**
 * pnpm dependency hoisting configuration.
 * Controls how and where dependencies are hoisted within node_modules.
 */
export interface Hoisting {
  /**
   * When true, all dependencies are hoisted to
   * `node_modules/.pnpm/node_modules`.
   *
   * This makes undeclared (phantom) dependencies accessible to all packages
   * inside `node_modules`.
   *
   * @see https://pnpm.io/settings#hoist
   */
  hoist?: boolean;

  /**
   * Defines which dependencies should be hoisted to
   * `node_modules/.pnpm/node_modules`.
   *
   * Supports glob patterns and exclusions using `!`.
   *
   * Recommended usage is to hoist only known problematic packages
   * that rely on phantom dependencies.
   *
   * Example:
   * ```yaml
   * hoistPattern:
   *   - "*eslint*"
   *   - "*babel*"
   *   - "!@types/react"
   * ```
   *
   * @see https://pnpm.io/settings#hoistpattern
   */
  hoistPattern?: string[];

  /**
   * When true, workspace packages are symlinked to either:
   * - `<workspace_root>/node_modules/.pnpm/node_modules`, or
   * - `<workspace_root>/node_modules`
   *
   * The exact location depends on other hoisting settings
   * (`hoistPattern`, `publicHoistPattern`).
   *
   * @see https://pnpm.io/settings#hoistworkspacepackages
   */
  hoistWorkspacePackages?: boolean;

  /**
   * Defines which dependencies should be hoisted directly to the
   * root `node_modules` directory.
   *
   * This exposes phantom dependencies to application code and should
   * be used sparingly, typically for flawed tooling that assumes a flat
   * node_modules layout.
   *
   * Supports glob patterns and exclusions using `!`.
   *
   * Example:
   * ```yaml
   * publicHoistPattern:
   *   - "*plugin*"
   * ```
   *
   * Note:
   * Setting `shamefullyHoist: true` is equivalent to
   * `publicHoistPattern: ["*"]`.
   *
   * @see https://pnpm.io/settings#publichoistpattern
   */
  publicHoistPattern?: string[];

  /**
   * When enabled, pnpm hoists all dependencies to the root
   * `node_modules` directory, producing a flat layout similar to npm
   * or Yarn Classic.
   *
   * This bypasses pnpm's semistrict node_modules isolation and should
   * only be used as a compatibility fallback for tooling that breaks
   * otherwise.
   *
   * Equivalent to:
   * ```yaml
   * publicHoistPattern:
   *   - "*"
   * ```
   *
   * @see https://pnpm.io/settings#shamefullyhoist
   */
  shamefullyHoist?: boolean;
}
