/**
 * Module resolver configuration.
 *
 * Each key is a resolver name, and the value is that resolver's configuration.
 * Resolvers are tried in the order specified.
 */
export interface ImportResolver {
  /**
   * Node.js module resolution algorithm.
   *
   * @see https://github.com/import-js/eslint-plugin-import/blob/main/resolvers/node/README.md
   */
  node?: NodeResolverConfig;

  /**
   * Webpack module resolution.
   *
   * @see https://github.com/import-js/eslint-import-resolver-webpack
   */
  webpack?: WebpackResolverConfig;

  /**
   * TypeScript path mapping resolution.
   *
   * @see https://github.com/import-js/eslint-import-resolver-typescript
   */
  typescript?: TypeScriptResolverConfig;

  /**
   * Custom or additional resolvers.
   */
  [resolver: string]: unknown;
}

/**
 * Configuration for the Node.js resolver.
 */
export interface NodeResolverConfig {
  /**
   * File extensions to consider when resolving modules.
   *
   * @default [".js"]
   *
   * @example
   * ```typescript
   * extensions: [".js", ".jsx", ".ts", ".tsx", ".json"]
   * ```
   */
  extensions?: string[];

  /**
   * Module directory names (like node_modules).
   *
   * @default ["node_modules"]
   */
  moduleDirectory?: string[];

  /**
   * Custom paths for module resolution.
   */
  paths?: string[];
}

/**
 * Configuration for the Webpack resolver.
 */
export interface WebpackResolverConfig {
  /**
   * Path to webpack configuration file.
   *
   * @example "webpack.config.js"
   * @example "./config/webpack.dev.js"
   */
  config?: string;

  /**
   * Webpack configuration object (alternative to config file).
   */
  'config-index'?: number;

  /**
   * Environment variables to use when resolving.
   */
  env?: Record<string, string>;

  /**
   * Arguments to pass to webpack config function.
   */
  argv?: Record<string, unknown>;
}

/**
 * Configuration for the TypeScript resolver.
 */
export interface TypeScriptResolverConfig {
  /**
   * Always try to resolve `@types` packages.
   *
   * @default false
   */
  alwaysTryTypes?: boolean;

  /**
   * Path to tsconfig.json.
   *
   * @default "./tsconfig.json"
   */
  project?: string | string[];

  /**
   * Conditions for package.json exports resolution.
   *
   * @example ["types", "import", "require", "default"]
   */
  conditionNames?: string[];
}

/**
 * Cache configuration for import resolution.
 */
export interface ImportCache {
  /**
   * Cache lifetime in seconds.
   *
   * - Number: Cache entries expire after this many seconds
   * - `Infinity` or `"∞"`: Cache never expires (use for CLI)
   *
   * @default 30
   *
   * @remarks
   * For normal CLI runs, lifetime is irrelevant as the process ends quickly.
   * For long-running processes (eslint_d, eslint-loader), set an appropriate
   * lifetime to avoid stale data.
   *
   * @example
   * ```typescript
   * // Never expire (CLI usage)
   * lifetime: Infinity
   *
   * // 5 second expiry (development with eslint_d)
   * lifetime: 5
   *
   * // 30 second expiry (default)
   * lifetime: 30
   * ```
   */
  lifetime: number | '∞';
}

/**
 * Configuration settings for eslint-plugin-import.
 *
 * These settings control how the import plugin resolves modules, handles different
 * file types, and determines what should be considered internal vs external dependencies.
 *
 * @see https://github.com/import-js/eslint-plugin-import#settings
 */
export interface Settings {
  /**
   * File extensions that will be parsed as modules and inspected for exports.
   *
   * This tells the import plugin which file types to treat as importable modules.
   * The plugin will only validate imports for files with these extensions.
   *
   * @default [".js"]
   * @default [".js", ".jsx"] (when using React shared config)
   *
   * @remarks
   * If using TypeScript, you MUST include TypeScript extensions here unless
   * you're using the `plugin:import/typescript` config.
   *
   * @example
   * ```typescript
   * // Basic JavaScript + JSX
   * "import/extensions": [".js", ".jsx"]
   *
   * // With TypeScript
   * "import/extensions": [".js", ".jsx", ".ts", ".tsx"]
   *
   * // Include JSON and other module types
   * "import/extensions": [".js", ".ts", ".json", ".mjs"]
   * ```
   */
  'import/extensions'?: string[];

  /**
   * Regex patterns for paths that should not report missing exports.
   *
   * If an import path matches any of these patterns, rules other than `no-unresolved`
   * will not report issues even if no exports are found. Useful for file types that
   * can't be parsed or don't have traditional exports.
   *
   * @remarks
   * - Patterns are matched against absolute filesystem paths
   * - `no-unresolved` has its own separate ignore setting
   * - Use escaped regex strings (double backslash for special chars)
   *
   * @example
   * ```typescript
   * "import/ignore": [
   *   "\\.coffee$",           // CoffeeScript files (parse errors)
   *   "\\.(scss|less|css)$",  // CSS modules (can't parse)
   *   "\\.svg$",              // SVG imports
   *   "\\.(png|jpg|gif)$"     // Image imports
   * ]
   * ```
   */
  'import/ignore'?: string[];

  /**
   * Additional modules to treat as "core" (built-in) modules.
   *
   * Core modules are considered resolved but have no filesystem path. Your resolver
   * may already define some (e.g., Node resolver knows about `fs`, `path`). Only
   * add modules that your resolver doesn't already recognize.
   *
   * @remarks
   * Common use cases:
   * - Platform-specific modules (Electron, React Native)
   * - Runtime-provided globals
   * - Virtual modules from build tools
   *
   * @example
   * ```typescript
   * // Electron apps
   * "import/core-modules": ["electron"]
   *
   * // React Native
   * "import/core-modules": ["react-native"]
   *
   * // Multiple platform modules
   * "import/core-modules": ["electron", "vscode", "react-native"]
   * ```
   *
   * @example Usage
   * ```typescript
   * // Without config: flagged as unresolved
   * import { app } from 'electron';
   *
   * // With "electron" in core-modules: resolved ✓
   * import { app } from 'electron';
   * ```
   */
  'import/core-modules'?: string[];

  /**
   * Folders whose modules should be considered "external".
   *
   * Resolved modules from these folders are treated as external dependencies
   * (e.g., third-party packages). This affects rules like `import/no-extraneous-dependencies`.
   *
   * @default ["node_modules"]
   *
   * @remarks
   * - Useful for monorepos: list package directories to treat them as external
   * - For Yarn PnP: add `.yarn` folder
   * - For other package managers: add `bower_components`, `jspm_modules`, etc.
   *
   * Each item can be:
   * - A folder name (matches anywhere): `"jspm_modules"`
   * - A relative path segment: `"packages/core"`
   * - An absolute path prefix: `"/home/me/project/packages"`
   *
   * @example
   * ```typescript
   * // Standard setup with Bower
   * "import/external-module-folders": [
   *   "node_modules",
   *   "bower_components"
   * ]
   *
   * // Monorepo setup
   * "import/external-module-folders": [
   *   "node_modules",
   *   "packages"  // Treat workspace packages as external
   * ]
   *
   * // Yarn PnP
   * "import/external-module-folders": [
   *   "node_modules",
   *   ".yarn"
   * ]
   * ```
   *
   * @example Matching behavior
   * ```typescript
   * // "jspm_modules" matches:
   * // - /project/jspm_modules
   * // - /project/jspm_modules/pkg/index.js
   * // - /home/jspm_modules/other
   *
   * // "packages/core" matches:
   * // - /project/packages/core/src/utils.js
   * // - /other/packages/core/index.js
   *
   * // "/home/me/project/packages" matches:
   * // - /home/me/project/packages (exact)
   * // - /home/me/project/packages/ui/index.js (children)
   * // But NOT: /other/project/packages
   * ```
   */
  'import/external-module-folders'?: string[];

  /**
   * Map of parsers to file extensions.
   *
   * Specifies which parser to use for specific file extensions. If a file
   * extension matches, the import plugin uses the specified parser instead
   * of the configured ESLint parser.
   *
   * @remarks
   * - The parser must be installed and require-able from ESLint's location
   * - Install parsers as peer dependencies of ESLint
   * - Primarily tested with `@typescript-eslint/parser`
   * - Other ESTree-compliant parsers may work but aren't guaranteed
   *
   * @example
   * ```typescript
   * // TypeScript
   * "import/parsers": {
   *   "@typescript-eslint/parser": [".ts", ".tsx"]
   * }
   *
   * // Multiple parsers
   * "import/parsers": {
   *   "@typescript-eslint/parser": [".ts", ".tsx"],
   *   "@babel/eslint-parser": [".js", ".jsx"]
   * }
   * ```
   *
   * @example Webpack + TypeScript interop
   * ```typescript
   * // Parse TypeScript directly in webpack
   * "import/parsers": {
   *   "@typescript-eslint/parser": [".ts", ".tsx"]
   * }
   * ```
   */
  'import/parsers'?: Record<string, string[]>;

  /**
   * Module resolution configuration.
   *
   * Configures how the import plugin resolves module paths. See resolver
   * documentation for details on specific resolver options.
   *
   * @remarks
   * Common resolvers:
   * - `node`: Node.js module resolution
   * - `webpack`: Webpack module resolution
   * - `typescript`: TypeScript path mapping
   *
   * @see https://github.com/import-js/eslint-plugin-import#resolvers
   *
   * @example
   * ```typescript
   * // Node resolver with custom extensions
   * "import/resolver": {
   *   "node": {
   *     "extensions": [".js", ".jsx", ".ts", ".tsx"]
   *   }
   * }
   *
   * // Webpack resolver
   * "import/resolver": {
   *   "webpack": {
   *     "config": "webpack.config.js"
   *   }
   * }
   *
   * // TypeScript resolver
   * "import/resolver": {
   *   "typescript": {
   *     "alwaysTryTypes": true
   *   }
   * }
   *
   * // Multiple resolvers (tried in order)
   * "import/resolver": {
   *   "typescript": {},
   *   "node": {
   *     "extensions": [".js", ".jsx", ".ts", ".tsx"]
   *   }
   * }
   * ```
   */
  'import/resolver'?: ImportResolver;

  /**
   * Cache configuration for module resolution.
   *
   * Controls memoization behavior to avoid repeated filesystem operations
   * and module parsing. Critical for long-running processes like `eslint_d`
   * or `eslint-loader`.
   *
   * @remarks
   * - For normal CLI runs: cache lifetime is irrelevant (process ends quickly)
   * - For long-running processes: set appropriate lifetime to avoid stale data
   * - Use `Infinity` for short-lived processes or when files won't change
   *
   * @example
   * ```typescript
   * // Default (30 seconds)
   * "import/cache": {
   *   "lifetime": 30
   * }
   *
   * // Never expire (for CLI usage)
   * "import/cache": {
   *   "lifetime": Infinity  // or "∞" in JSON
   * }
   *
   * // Short lifetime (for development with eslint_d)
   * "import/cache": {
   *   "lifetime": 5
   * }
   * ```
   */
  'import/cache'?: ImportCache;

  /**
   * Regex pattern for packages to treat as internal.
   *
   * Packages matching this pattern are considered "internal" even if they're
   * in `external-module-folders`. Useful for monorepos where workspace packages
   * should be treated as internal dependencies.
   *
   * @remarks
   * By default, packages in `external-module-folders` (like `node_modules`)
   * are external. This setting overrides that for matching package names.
   *
   * @example
   * ```typescript
   * // Monorepo with @mycompany scope
   * "import/internal-regex": "^@mycompany/"
   *
   * // Multiple scopes
   * "import/internal-regex": "^(@mycompany|@myorg)/"
   *
   * // Specific package prefix
   * "import/internal-regex": "^my-package-"
   * ```
   *
   * @example Usage
   * ```typescript
   * // Without config: treated as external
   * import { utils } from '@mycompany/utils';
   *
   * // With "^@mycompany/" pattern: treated as internal
   * import { utils } from '@mycompany/utils';
   * import { axios } from 'axios';  // Still external
   * ```
   */
  'import/internal-regex'?: string;

  /**
   * Node.js version for compatibility checking.
   *
   * Specifies the Node.js version to use when checking for available built-in
   * modules and features. Used by rules like `import/no-nodejs-modules`.
   *
   * @default Current Node.js version running ESLint
   *
   * @remarks
   * - Use semantic version format: "major.minor.patch"
   * - Falsy values default to current Node.js version
   * - Useful for ensuring compatibility with deployment environment
   *
   * @example
   * ```typescript
   * // Target specific Node.js version
   * "import/node-version": "18.12.0"
   *
   * // Target LTS version
   * "import/node-version": "20.11.0"
   *
   * // Use current version (default)
   * "import/node-version": undefined
   * ```
   */
  'import/node-version'?: string;
}
