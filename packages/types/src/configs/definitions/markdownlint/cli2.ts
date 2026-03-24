import { type Configuration } from 'markdownlint';
/**
 * Type definitions for markdownlint-cli2 configuration (.markdownlint-cli2.jsonc)
 * @see https://github.com/DavidAnson/markdownlint-cli2
 */

/**
 * Module reference for custom rules, markdown-it plugins, or output formatters.
 * Can be a module name/path (String) or a tuple of [module, ...params].
 */
export type ModuleReference = string | [string, ...unknown[]];

/**
 * Configuration object for markdownlint-cli2.
 * Valid in .markdownlint-cli2.jsonc files.
 */
export interface Config {
  /**
   * Schema URL for markdownlint-cli2 configuration.
   */
  $schema?: string;
  /**
   * markdownlint config object to configure rules for this part of the directory tree.
   *
   * If a .markdownlint.{jsonc,json,yaml,yml,js} file is present in the same directory,
   * it overrides the value of this property.
   *
   * If the config object contains an `extends` property, it will be resolved the same
   * as .markdownlint.{jsonc,json,yaml,yml,js}.
   */
  config?: Configuration & { $schema?: never };

  /**
   * Array of module names/paths of custom rules to load and use when linting.
   * Relative paths are resolved based on the location of the JSONC file.
   *
   * @example
   * ["markdownlint-rule-foo", "./custom-rules/my-rule.js"]
   *
   * @see https://www.npmjs.com/search?q=keywords:markdownlint-rule
   */
  customRules?: ModuleReference[];

  /**
   * Boolean value to enable fixing of linting errors reported by rules that emit fix information.
   * Fixes are made directly to the relevant file(s); no backup is created.
   *
   * @default false
   */
  fix?: boolean;

  /**
   * String defining the RegExp used to match and ignore any front matter at the beginning of a document.
   * The String is passed as the pattern parameter to the RegExp constructor.
   *
   * @example "(^---\\s*$[^]*?^---\\s*$)(\\r\\n|\\r|\\n|$)"
   */
  frontMatter?: string;

  /**
   * Boolean or String value to automatically ignore files referenced by .gitignore (or similar) when linting.
   *
   * - `true`: All .gitignore files in the tree are imported (default git behavior)
   * - String: Glob pattern to identify the set of ignore files to import
   *   - `"**\/.gitignore"` corresponds to `true`
   *   - `".gitignore"` imports only the file in the root of the tree (usually faster for large trees)
   *
   * This top-level setting is valid only in the directory from which markdownlint-cli2 is run.
   *
   * @default false
   */
  gitignore?: boolean | string;

  /**
   * Array of glob expressions to append to the command-line arguments.
   * This setting can be used instead of (or in addition to) passing globs on the command-line
   * and offers identical performance.
   *
   * This setting is ignored when the --no-globs parameter is passed on the command-line.
   * This top-level setting is valid only in the directory from which markdownlint-cli2 is run.
   *
   * @example ["**\/*.md", "!node_modules"]
   */
  globs?: string[];

  /**
   * Array of glob expressions to ignore when linting.
   *
   * This setting has the best performance when applied to the directory from which markdownlint-cli2 is run.
   * In this case, glob expressions are negated (by adding a leading !) and appended to the command-line
   * arguments before file enumeration. The setting is not inherited by nested configuration files in this case.
   *
   * When this setting is applied in subdirectories, ignoring of files is done after file enumeration,
   * so large directories can negatively impact performance. Nested configuration files inherit and
   * reapply the setting to the contents of nested directories in this case.
   *
   * @example ["node_modules", "dist", "*.test.md"]
   */
  ignores?: string[];

  /**
   * Array of markdown-it plugins to load, each specified as [plugin-name, ...params].
   * Plugins can be used to add support for additional Markdown syntax.
   * Relative paths are resolved based on the location of the JSONC file.
   *
   * @example [["markdown-it-emoji"], ["markdown-it-footnote", { "option": "value" }]]
   *
   * @see https://www.npmjs.com/search?q=keywords:markdown-it-plugin
   */
  markdownItPlugins?: ModuleReference[];

  /**
   * Array of additional paths to use when resolving module references
   * (e.g., alternate locations for node_modules).
   *
   * @example ["./custom_modules", "/usr/local/lib/node_modules"]
   */
  modulePaths?: string[];

  /**
   * Boolean value to disable the display of the banner message and version numbers on stdout.
   *
   * This top-level setting is valid only in the directory from which markdownlint-cli2 is run.
   * Use with `noProgress` to suppress all output to stdout (i.e., --quiet).
   *
   * @default false
   */
  noBanner?: boolean;

  /**
   * Boolean value to disable the support of HTML comments within Markdown content.
   *
   * @example <!-- markdownlint-disable some-rule -->
   *
   * @default false
   */
  noInlineConfig?: boolean;

  /**
   * Boolean value to disable the display of progress on stdout.
   *
   * This top-level setting is valid only in the directory from which markdownlint-cli2 is run.
   * Use with `noBanner` to suppress all output to stdout (i.e., --quiet).
   *
   * @default false
   */
  noProgress?: boolean;

  /**
   * Array of output formatters to use, each specified as [formatter-name, ...params].
   * Formatters can be used to customize the tool's output for different scenarios.
   * Relative paths are resolved based on the location of the JSONC file.
   *
   * This top-level setting is valid only in the directory from which markdownlint-cli2 is run.
   *
   * @example [["markdownlint-cli2-formatter-junit"], ["./custom-formatter.js", { "pretty": true }]]
   *
   * @see https://www.npmjs.com/search?q=keywords:markdownlint-cli2-formatter
   */
  outputFormatters?: ModuleReference[];

  /**
   * Boolean value to display the list of found files on stdout.
   *
   * This top-level setting is valid only in the directory from which markdownlint-cli2 is run
   * and only when `noProgress` has not been set.
   *
   * @default false
   */
  showFound?: boolean;
}
