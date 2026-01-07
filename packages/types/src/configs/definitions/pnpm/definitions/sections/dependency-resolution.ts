/**
 * pnpm workspace-level dependency resolution and safety controls.
 * Maps directly to pnpm-workspace.yaml settings.
 */
export interface DependencyResolution {
  /**
   * Suppress deprecation warnings for specific package versions.
   *
   * @see https://pnpm.io/settings#alloweddeprecatedversions
   *
   * @example
   * ```yaml
   * express: "1"
   * request: "*"
   * ```
   *
   */
  allowedDeprecatedVersions?: Record<string, string>;
  /**
   * Prevent transitive dependencies from using exotic sources.
   *
   * When enabled:
   * - Only direct dependencies may use git or URL tarballs
   * - Transitive deps must resolve from trusted sources
   *
   * Exotic sources include:
   * - git+ssh
   * - git+https
   * - direct tarball URLs
   *
   *
   * @see https://pnpm.io/settings#blockexoticsubdeps
   */
  blockExoticSubdeps?: boolean;

  /**
   * Optional dependencies that should always be skipped.
   *
   * Useful for large platform-specific packages (e.g. fsevents).
   *
   * @see https://pnpm.io/settings#ignoredoptionaldependencies
   */
  ignoredOptionalDependencies?: string[];

  /**
   * Minimum age (in minutes) a package version must have
   * before it is eligible for installation.
   *
   * Applies to all dependencies, including transitive.
   *
   * @see https://pnpm.io/settings#minimumreleaseage
   */
  minimumReleaseAge?: number;

  /**
   * Packages or versions exempt from `minimumReleaseAge`.
   *
   * Supports:
   * - Package names
   * - Scoped patterns (`@org/*`)
   * - Specific versions
   * - Version disjunctions (`pkg@1.0.0 || 2.0.0`)
   *
   * @see {@link https://pnpm.io/settings#minimumreleaseageexclude}
   */
  minimumReleaseAgeExclude?: string[];

  /**
   * Instruct pnpm to override any dependency in the dependency graph.
   *
   * Supports:
   * - Global overrides: `"foo": "^1.0.0"`
   * - Scoped overrides: `"bar@^2.1.0": "3.0.0"`
   * - Nested overrides: `"pkg@1>dep": "2"`
   * - Forks: `"dep": "npm:@scope/dep@^1.0.0"`
   * - Removal using `"-"`
   * - References to direct deps using `$depName`
   *
   * Root-only setting.
   *
   * @see https://pnpm.io/settings#overrides
   */
  overrides?: Record<string, string>;

  /**
   * Extend or patch broken package manifests.
   *
   * Allows adding or modifying:
   * - dependencies
   * - optionalDependencies
   * - peerDependencies
   * - peerDependenciesMeta
   *
   * Keys may include semver ranges (e.g. `react-redux@1`).
   *
   * @see https://pnpm.io/settings#packageextensions
   */
  packageExtensions?: Record<
    string,
    {
      dependencies?: Record<string, string>;
      optionalDependencies?: Record<string, string>;
      peerDependencies?: Record<string, string>;
      peerDependenciesMeta?: Record<string, { optional?: boolean }>;
    }
  >;

  /**
   * Architectures for which optional dependencies should be installed,
   * regardless of the current system architecture.
   *
   * Supports `current` as a value.
   *
   * @see https://pnpm.io/settings#supportedarchitectures
   */
  supportedArchitectures?: { cpu?: string[]; libc?: string[]; os?: string[] };

  /**
   * Controls enforcement of package trust guarantees.
   *
   * - `off`: no trust checks
   * - `no-downgrade`: fail if trust evidence weakens compared to past releases
   *
   * Trust is evaluated by publish time, not semver.
   *
   * @see https://pnpm.io/settings#trustpolicy
   */
  trustPolicy?: 'no-downgrade' | 'off';

  /**
   * Package selectors excluded from trust policy enforcement.
   *
   * Allows installing known exceptions.
   *
   * @see {@link https://pnpm.io/settings#trustpolicyexclude}
   *
   */
  trustPolicyExclude?: string[];

  /**
   * Ignore trust policy checks for packages older than this many minutes.
   *
   * Intended to ease adoption of strict trust policies
   * for legacy packages.
   *
   * @see {@link https://pnpm.io/settings#trustpolicyignoreafter}
   */
  trustPolicyIgnoreAfter?: number;

  /**
   * Controls update behavior for pnpm update / outdated.
   *
   * @see https://pnpm.io/settings#updateconfig
   */
  updateConfig?: {
    /**
     * List of dependencies that should never be updated.
     * Supports glob patterns (e.g. `@babel/*`).
     *
     * @see {@link https://pnpm.io/settings#updateconfigignoredependencies}
     */
    ignoreDependencies?: string[];
  };
}
