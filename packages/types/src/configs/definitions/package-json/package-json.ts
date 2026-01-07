/** @see {@link https://docs.npmjs.com/cli/v11/configuring-npm/package-json#devengines} */
export interface DevEngineEntry {
  name: string;
  onFail?: 'error' | 'ignore' | 'warn';
  version?: string;
}

/** @see {@link https://docs.npmjs.com/cli/v11/configuring-npm/package-json#funding} */
export interface Funding {
  /** The type of funding source (e.g., "individual", "organization", "patreon"). */
  type?: string;
  /** The URL of the funding page. */
  url: string;
}
/** @see {@link https://docs.npmjs.com/cli/v11/configuring-npm/package-json} */
export interface JSON {
  /**
   * A link to the JSON schema for validating the package.json file.
   */
  $schema?: string;
  /**
   * The author of the package.
   *
   * Accepts either:
   * - an object with `email`, `name`, and `url` properties.
   * - a string in the format "Name <email> (url)".
   *
   * @see {@link https://docs.npmjs.com/cli/v11/configuring-npm/package-json#people-fields-author-contributors}
   */
  author?: { email: string; name: string; url: string };
  /**
   * A map of command-line interface (CLI) commands
   * that can be run from the package.
   *
   * @default void
   *
   * @see {@link https://docs.npmjs.com/cli/v11/configuring-npm/package-json#bin}
   *
   * @example
   * ```json
   * {
   *   "bin": {
   *     "my-cli": "./dist/cli.js"
   *   }
   * }
   * ```
   */
  bin?: Record<string, string> | string;
  /**
   * If the module is meant to be used in a browser environment,
   * this field specifies the entry point for browser-specific code.
   * - Alternative to main for browser environments.
   *
   * @default void
   *
   * @see {@link https://docs.npmjs.com/cli/v11/configuring-npm/package-json#browser}
   */
  browser?: string;
  /**
   * Url to the package's issue tracker.
   *
   * Accepts either a string URL or an object with `email` and `url` properties.
   *
   * @default void
   *
   * @see {@link https://docs.npmjs.com/cli/v11/configuring-npm/package-json#bugs}
   */
  bugs?:
    | {
        /** The email address for reporting issues. */
        email?: string;
        /** The URL for reporting issues. */
        url: string;
      }
    | string;
  /**
   * Packages that are bundled with the package when published.
   *
   * - boolean value `true` means all dependencies are bundled.
   *
   * @default void
   *
   * @see {@link https://docs.npmjs.com/cli/v11/configuring-npm/package-json#bundleddependencies}
   */
  bundleDependencies?: boolean | string[];
  /**
   * Configuration options for the package that persist across upgrades.
   *
   * @default void
   *
   * @see {@link https://docs.npmjs.com/cli/v11/configuring-npm/package-json#config}
   */
  config?: Record<string, unknown>;
  /**
   * Contributors to the package.
   *
   * Accepts an array of:
   * - objects with `email`, `name`, and `url` properties.
   * - strings in the format "Name <email> (url)".
   *
   * @default void
   *
   * @see {@link https://docs.npmjs.com/cli/v11/configuring-npm/package-json#people-fields-author-contributors}
   */
  contributors?: (Person | string)[];
  /**
   * The CPU architectures that the package is compatible with.
   * - Can also block unsupported architectures using `!` prefix.
   *
   * @default void
   *
   * @see {@link https://docs.npmjs.com/cli/v11/configuring-npm/package-json#cpu}
   *
   * @example
   * ```json
   * { "cpu": ["x64", "arm64", "!ia32"] }
   * ```
   */
  cpu?: string[];
  /**
   * Packages that this package depends on.
   * - Key: package name, Value: version range.
   * @default
   * ```
   * {}
   * ```
   * @see {@link https://docs.npmjs.com/cli/v11/configuring-npm/package-json#dependencies}
   */
  dependencies?: Record<string, string>;
  /**
   * Listed in npm search for package discovery.
   *
   * @default []
   *
   * @see {@link https://docs.npmjs.com/cli/v11/configuring-npm/package-json#description-1}
   */
  description?: string;
  /**
   * Packages that are only needed for development.
   * - Key: package name, Value: version range.
   * @default
   * ```
   * {}
   * ```
   * @see {@link https://docs.npmjs.com/cli/v11/configuring-npm/package-json#devdependencies}
   */
  devDependencies?: Record<string, string>;
  /**
   * Aid engineers working on a codebase to all be using the same tooling.
   *
   * @default void
   *
   * @see {@link https://docs.npmjs.com/cli/v11/configuring-npm/package-json#devengines}
   */
  devEngines?: Partial<
    Record<
      'cpu' | 'libc' | 'os' | 'packageManager' | 'runtime',
      Partial<DevEngineEntry> | Partial<DevEngineEntry>[]
    >
  >;
  /**
   * The Node.js (and optionally the package manager) engine versions
   * that the package is compatible with.
   *
   * @default void
   *
   * @see {@link https://docs.npmjs.com/cli/v11/configuring-npm/package-json#engines}
   *
   * @example
   * ```json
   * {
   *  "engines": {
   *    "node": ">=14.0.0",
   *    // Any version of npm is acceptable
   *    "npm": "*"
   *  }
   * }
   * ```
   */
  engines?: Record<string, string>;
  /**
   * Defines the public interface for the package.
   * - Modern alternative to main and types fields.
   * - Allows specifying different entry points for different module systems.
   *
   * @default
   * ```
   * {}
   * ```
   *
   * @see {@link https://docs.npmjs.com/cli/v11/configuring-npm/package-json#exports}
   *
   * @example
   * ```json
   * {
   *   "exports": {
   *     ".": {
   *       "import": "./dist/src/index.js",
   *       "types": "./dist/src/index.d.ts"
   *     }
   *   }
   * }
   * ```
   */
  exports?: Record<
    string,
    { [key: string]: string } & { import: string; types?: string }
  >;
  /**
   * Files included in the package when published and
   * installed as a dependency.
   *
   * @default [] (includes no files by default)
   *
   * @see {@link https://docs.npmjs.com/cli/v11/configuring-npm/package-json#files}
   */
  files?: string[];
  /**
   * Ways to help fund the development of the package.
   *
   * @default void
   *
   * @see {@link https://docs.npmjs.com/cli/v11/configuring-npm/package-json#funding}
   */
  funding?: (Funding | string)[] | Funding | string;
  /**
   * The URL of the package's homepage.
   *
   * @see {@link https://docs.npmjs.com/cli/v11/configuring-npm/package-json#homepage}
   */
  homepage?: string;
  /**
   * Improves package discoverability and searchability.
   *
   * @important use lowercase, hyphen-separated words.
   *
   * @default []
   *
   * @see {@link https://docs.npmjs.com/cli/v11/configuring-npm/package-json#keywords}
   */
  keywords?: string[];
  /**
   * The libc version that the package is compatible with.
   * - Only applies if os is `linux`.
   *
   * @default void
   *
   * @see {@link https://docs.npmjs.com/cli/v11/configuring-npm/package-json#libc}
   *
   * @example
   * ```json
   * { "libc": "glibc" }
   * ```
   */
  libc?: string | string[];
  /**
   * The package's license.
   *
   * @default "MIT"
   *
   * @see {@link https://docs.npmjs.com/cli/v11/configuring-npm/package-json#license}
   */
  license?: string;
  /**
   * Primary entry point for the package.
   *
   * @default ""
   *
   * @see {@link https://docs.npmjs.com/cli/v11/configuring-npm/package-json#main}
   */
  main?: string;
  /**
   * Path(s) to the package's primary documentation (manual).
   * - Can be a string or an array of strings.
   *
   * @default void
   *
   * @see {@link https://docs.npmjs.com/cli/v11/configuring-npm/package-json#man}
   */
  man?: string[];
  /**
   * The package name and optional scope.
   *
   * @see {@link https://docs.npmjs.com/cli/v11/configuring-npm/package-json#name}
   * @see {@link https://docs.npmjs.com/cli/v11/using-npm/scope}
   */
  name?: { package: string; scope?: `@${string}` } | string;
  /**
   * Packages that are optional dependencies.
   * - If an optional dependency fails to install, it does not cause the installation to fail.
   *
   * @default void
   *
   * @see {@link https://docs.npmjs.com/cli/v11/configuring-npm/package-json#optionaldependencies}
   */
  optionalDependencies?: Record<string, string>;
  /**
   * The operating systems that the package is compatible with.
   * - Can also block unsupported operating systems using `!` prefix.
   *
   * @default void
   *
   * @see {@link https://docs.npmjs.com/cli/v11/configuring-npm/package-json#os}
   *
   * @example
   * ```json
   * { "os": ["darwin", "linux", "!win32"] }
   * ```
   */
  os?: string[];
  /**
   * Replaces a package dependency with a different version or package.
   * - Useful for patching security vulnerabilities or bugs in dependencies.
   *
   * @default void
   *
   * @see {@link https://docs.npmjs.com/cli/v11/configuring-npm/package-json#overrides}
   *
   * @example
   * ```json
   * {
   *  "dependencies": { "foo": "1.2.3" },
   *  "overrides": {
   *
   *   // Override the version of "foo" to "0.5.0"
   *   "foo": "0.5.0",
   *
   *   // Overrides `foo` as well as a child of the package (`bar`)
   *   "foo": { ".": "0.5.0", "bar": "0.3.0" },
   *
   *   // Overrides `foo` when it's a descendent of another package (`bar`)
   *   "bar": { "foo": "0.5.0" },
   *
   *   // `$` is a reference to a spec for a direct dependency
   *   "foo": "$foo"
   * }
   *```
   */
  overrides?: Record<string, Record<string, string> | string>;
  /**
   * Expresses compatibility with specified packages without requiring them.
   *
   * @default void
   *
   * @see {@link https://docs.npmjs.com/cli/v11/configuring-npm/package-json#peerdependencies}
   *
   */
  peerDependencies?: Record<string, string>;
  /**
   * Metadata for peer dependencies.
   * - Allows specifying if a peer dependency is optional which
   *   directs npm to or to not automatically install the peerDependency.
   *
   * @default void
   *
   * @see {@link https://docs.npmjs.com/cli/v11/configuring-npm/package-json#peerdependenciesmeta}
   */
  peerDependenciesMeta?: Record<
    string,
    { [key: string]: unknown } & { optional?: boolean }
  >;
  /**
   * If true, the package is private and cannot be published.
   *
   * @default false
   *
   * @see {@link https://docs.npmjs.com/cli/v11/configuring-npm/package-json#private}
   */
  private?: boolean;
  /**
   * Configuration for publishing the package.
   * - Allows overriding `config` settings for publishing.
   *
   * @default void
   *
   * @see {@link https://docs.npmjs.com/cli/v11/configuring-npm/package-json#publishconfig}
   *
   */
  publishConfig?: Record<string, unknown>;
  /**
   * The URL of the repository where the package is hosted.
   *
   * @see {@link https://docs.npmjs.com/cli/v11/configuring-npm/package-json#repository}
   */
  repository?: { directory?: string; type: 'git'; url: string } | string;
  /**
   * Script commands that can be run using npm run <script>.
   *
   * @default
   * ```
   * {}
   * ```
   *
   * @see {@link https://docs.npmjs.com/cli/v11/configuring-npm/package-json#scripts}
   */
  scripts?: Record<string, string>;
  /**
   * The type of module system used by the package.
   * - Can be "module", "commonjs", or "none".
   *
   * @default "module"
   *
   * @see {@link https://nodejs.org/api/packages.html#type}
   */
  type?: 'commonjs' | 'module';

  /**
   * Points to your bundled declaration file.
   * - Used for TypeScript projects to provide type definitions.
   *
   * @default void
   *
   * @see {@link https://nodejs.org/api/packages.html}
   */
  types?: string;

  /**
   * The version of the package.
   * - Must follow semantic versioning (semver) format.
   *
   * @default "0.0.0"
   *
   * @see {@link https://docs.npmjs.com/cli/v11/configuring-npm/package-json#version}
   */
  version?: string;
}
export interface Person {
  /** The person's email address. */
  email: string;
  /** The person's name. */
  name: string;
  /** The URL of the person's homepage or profile. */
  url: string;
}
