import type { Import, JsDoc, JsxA11y, React, Vitest, Next } from '../eslint-plugins/index.js';

/**
 *  rule.
 * - "allow" or "off": Turn off the rule.
 * - "warn": Turn the rule on as a warning (doesn't affect exit code).
 * - "error" or "deny": Turn the rule on as an error (will exit with a failure code).
 * Or as a number:
 * - 0: Turn off the rule.
 * - 1: Turn the rule on as a warning.
 * - 2: Turn the rule on as an error.
 */
export type AllowWarnDeny = 'allow' | 'off' | 'warn' | 'error' | 'deny' | 0 | 1 | 2;

//#region> Options

/**
 * Linter options
 */
export interface Options {
  /**
   * Ensure warnings produce a non-zero exit code.
   * Equivalent to passing --deny-warnings on the CLI.
   */
  denyWarnings?: boolean;
  /**
   * Specify a warning threshold. Exits with an error status if warnings exceed this value.
   * Equivalent to passing --max-warnings on the CLI.
   */
  maxWarnings?: number;

  /**
   * Report unused disable directives (e.g. // oxlint-disable-line or // eslint-disable-line).
   * Equivalent to passing --report-unused-disable-directives-severity on the CLI. CLI flags take precedence over this value when both are set. Only supported in the root configuration file.
   */
  reportUnusedDisableDirectives?: AllowWarnDeny;

  /**
   * Enable rules that require type information.
   * Equivalent to passing --type-aware on the CLI.
   * @important This requires the oxlint-tsgolint package to be installed.
   */
  typeAware?: boolean;

  /**
   * Enable experimental type checking (includes TypeScript compiler diagnostics).
   * Equivalent to passing --type-check on the CLI.
   * @important This requires the oxlint-tsgolint package to be installed.
   */
  typeCheck?: boolean;
}
//#endregion

//#region> Plugins
/**
 * Enabled built-in plugins for .
 */
export type BuiltInPlugins =
  | 'eslint'
  | 'react'
  | 'unicorn'
  | 'typescript'
  | 'oxc'
  | 'import'
  | 'jsdoc'
  | 'jest'
  | 'vitest'
  | 'jsx-a11y'
  | 'nextjs'
  | 'react-perf'
  | 'promise'
  | 'node'
  | 'vue';
/**
 * JS plugins, allows usage of ESLint plugins with .
 */
export type ExternalPluginEntry =
  | string
  | {
      /**
       * Custom name/alias for the plugin.
       */
      name: string;
      /**
       * Path or package name of the plugin.
       */
      specifier: string;
    };

/**
 * Custom component definition for React plugin settings.
 */
export type CustomComponent =
  | string
  | { attribute: string; name: string }
  | { attributes: string[] | readonly string[]; name: string };

/**
 * Configure Vitest plugin rules.
 */
export interface VitestPluginSettings {
  /**
   * Whether to enable typecheck mode for Vitest rules.
   */
  typecheck?: boolean;
}

//#endregion

/**
 * Add, remove, or otherwise reconfigure rules for specific files or groups of files.
 */
export interface Override {
  /**
   * A list of glob patterns to override.
   */
  files: string[] | readonly string[];
  /**
   * Environments enable and disable collections of global variables.
   */
  env?: Env | null;
  /**
   * Enabled or disabled specific global variables.
   */
  globals?: Globals | null;
  /**
   * JS plugins for this override.
   */
  jsPlugins?: null | ExternalPluginEntry[];
  /**
   * Optionally change what plugins are enabled for this override.
   */
  plugins?: BuiltInPlugins[] | null;
  /**
   * Rules configuration for this override.
   */
  rules?: Rules;
}
/**
 * Configure an entire category of rules all at once.
 */
export interface Categories {
  /** Code that is definitely wrong or useless */
  correctness?: AllowWarnDeny;
  /** Rules under development that may change */
  nursery?: AllowWarnDeny;
  /** Extra strict rules that may have false positives */
  pedantic?: AllowWarnDeny;
  /** Rules that improve runtime performance */
  perf?: AllowWarnDeny;
  /** Rules that ban specific patterns or features */
  restriction?: AllowWarnDeny;
  /** Idiomatic and consistent style rules */
  style?: AllowWarnDeny;
  /** Code that is likely wrong or useless */
  suspicious?: AllowWarnDeny;
}
/**
 * Configure the behavior of linter plugins.
 */
export interface Settings {
  react?: React.Settings;
  jsdoc?: JsDoc.Settings;
  'jsx-a11y'?: JsxA11y.Settings;
  next?: Next.Settings;
  vitest?: Vitest.Settings;
  import?: Import.Settings;
  nextjs?: Next.Settings;
  'react-perf'?: Record<string, unknown>;
  oxc?: Record<string, unknown>;
  jest?: Record<string, unknown>;
  eslint?: Record<string, unknown>;
  typescript?: Record<string, unknown>;
  unicorn?: Record<string, unknown>;
  promise?: Record<string, unknown>;
  node?: Record<string, unknown>;
  vue?: Record<string, unknown>;
  [key: string]: unknown;
}

/**
 * @see https://oxc.rs/docs/guide/usage/linter/config-file-reference.html#oxlint-configuration-file
 */
export interface Config {
  /**
   * Schema URI for editor tooling.
   */
  $schema?: string | null;

  /**
   * Configure an entire category of rules all at once.
   * Rules enabled or disabled this way will be overwritten by individual rules in the `rules` field.
   */
  categories?: Categories;

  /**
   * Environments enable and disable collections of global variables.
   * See ESLint's list of environments for what environments are available and what each one provides.
   * Default: { builtin: true }
   */
  env?: Env;

  /**
   * Paths of configuration files that this configuration file extends (inherits from).
   * The files are resolved relative to the location of the configuration file that contains the `extends` property.
   * The configuration files are merged from the first to the last, with the last file overriding the previous ones.
   */
  extends?: string[] | readonly string[];

  /**
   * Enabled or disabled specific global variables.
   * For each global variable, set the corresponding value equal to `"writable"` to allow the variable to be overwritten or `"readonly"` to disallow overwriting.
   * Globals can be disabled by setting their value to `"off"`.
   */
  globals?: Globals;

  /**
   * Globs to ignore during linting. These are resolved from the configuration file path.
   * Default: []
   */
  ignorePatterns?: string[] | readonly string[];

  /**
   * JS plugins, allows usage of ESLint plugins with .
   * Note: JS plugins are experimental and not subject to semver.
   * They are not supported in the language server (and thus editor integrations) at present.
   */
  jsPlugins?: null | ExternalPluginEntry[] | readonly ExternalPluginEntry[];

  /**
   * Add, remove, or otherwise reconfigure rules for specific files or groups of files.
   */
  overrides?: Override[];

  /**
   * Enabled built-in plugins for .
   * NOTE: Setting the `plugins` field will overwrite the base set of plugins.
   * The `plugins` array should reflect all of the plugins you want to use.
   */
  plugins?: BuiltInPlugins[] | readonly BuiltInPlugins[] | null;

  /**
   * Rules configuration.
   * See  Rules for the list of rules.
   */
  rules?: Rules;

  /**
   * Configure the behavior of linter plugins.
   */
  settings?: Settings;
  /**
   * Linter options.
   */
  options?: Options;
}

/**
 * Predefine global variables.
 * Environments specify what global variables are predefined.
 */
export type Env = { [envName: string]: boolean } & { builtin?: boolean };

/**
 * Add or remove global variables.
 * For each global variable, set the corresponding value equal to `"writable"` to allow the variable to be overwritten or `"readonly"` to disallow overwriting.
 * Globals can be disabled by setting their value to `"off"`.
 */
export interface Globals {
  [globalName: string]: GlobalValue;
}

/**
 * Global variable value.
 * - "readonly": Disallow overwriting.
 * - "writable": Allow overwriting.
 * - "off": Disable the global.
 */
export type GlobalValue = 'readonly' | 'writable' | 'off';

/**
 * Rules configuration.
 * See  Rules for the list of rules.
 */
export interface Rules {
  [ruleName: string]: AllowWarnDeny | unknown[] | readonly unknown[];
}

/**
 * Use to enforce a specific plugin/domain for it's associated rules. For example, to enforce the use of the React plugin for all React rules, you could use `PluginRules<'react'>` and then only specify the rule name after the plugin prefix, like `react/jsx-uses-react`.
 */
export type PluginRules<Plugin extends string = string> = Record<
  `${Plugin}/${string}`,
  Rules[string]
>;
