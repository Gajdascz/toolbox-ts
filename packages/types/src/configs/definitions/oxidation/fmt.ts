/**
 * Sort import statements.
 * Uses an algorithm similar to [eslint-plugin-perfectionist/sort-imports](https://perfectionist.dev/rules/sort-imports). For details, see each field's documentation.
 * @experimental
 * @default null
 */
export interface SortImports {
  /** @see {@link CustomGroupItem} */
  customGroups?: CustomGroupItem[];
  /**
   * Specifies a list of predefined import groups for sorting.
   * - Each import will be assigned a single group specified in the groups option (or the `unknown` group if no match is found).
   * - The order of items in the `groups` option determines how groups are ordered.
   * - Within a given group, members will be sorted according to the type, order, ignoreCase, etc. options.
   * - Individual groups can be combined together by placing them in an array.
   * - The order of groups in that array does not matter.
   * - All members of the groups in the array will be sorted together as if they were part of a single group.
   * - Predefined groups are characterized by a single selector and potentially multiple modifiers. You may enter modifiers in any order, but the selector must always come at the end.
   * - The list of selectors is sorted from most to least important:
   *    - `type` — TypeScript type imports.
   *    - `side-effect-style` — Side effect style imports.
   *    - `side-effect` — Side effect imports.
   *    - `style` — Style imports.
   *    - `index` — Main file from the current directory.
   *    - `sibling` — Modules from the same directory.
   *    - `parent` — Modules from the parent directory.
   *    - `subpath` — Node.js subpath imports.
   *    - `internal` — Your internal modules.
   *    - `builtin` — Node.js Built-in Modules.
   *    - `external` — External modules installed in the project.
   *    - `import` — Any import.
   * - The list of modifiers is sorted from most to least important:
   *    - `side-effect` — Side effect imports.
   *    - `type` — TypeScript type imports.
   *    - `value` — Value imports.
   *    - `default` — Imports containing the default specifier.
   *    - `wildcard` — Imports containing the wildcard (`* as`) specifier.
   *    - `named` — Imports containing at least one named specifier.
   *    - `multiline` — Imports on multiple lines.
   *    - `singleline` — Imports on a single line.
   *
   * @see {@link https://perfectionist.dev/rules/sort-imports#groups}
   * @default
   * ```json
   * [
   *   "type-import",
   *   ["value-builtin", "value-external"],
   *   "type-internal",
   *   "value-internal",
   *   ["type-parent", "type-sibling", "type-index"],
   *   ["value-parent", "value-sibling", "value-index"],
   *   "ts-equals-import",
   *   "unknown"
   * ]
   * ```
   */
  groups?: (string | string[])[];
  /**
   * Specifies whether sorting should be case-sensitive
   * @default true
   */
  ignoreCase?: boolean;
  /**
   * Specifies a prefix for identifying internal imports.
   * - This is useful for distinguishing your own modules from external dependencies.
   * @default ["~\", "@\"]
   */
  internalPattern?: string[];
  /**
   * Specifies whether to add newlines between groups.\n\nWhen `false`, no newlines are added between groups.
   * @default true
   */
  newlinesBetween?: boolean;
  /**
   * Specifies whether to sort items in ascending or descending order.
   * @default \"asc\"
   */
  order?: 'asc' | 'desc';
  /**
   * Enables the use of comments to separate imports into logical groups.
   * - When `true`, all comments will be treated as delimiters, creating partitions.
   * ```ts
   * import { b1, b2 } from 'b'
   * // PARTITION
   * import { a } from 'a'
   * import { c } from 'c'
   * ```
   * @default false
   */
  partitionByComment?: boolean;
  /**
   * Enables the empty line to separate imports into logical groups.
   * - When `true`, formatter will not sort imports if there is an empty line between them. This helps maintain the defined order of logically separated groups of members.
   * ```ts
   * import { b1, b2 } from 'b'
   * import { a } from 'a'
   * import { c } from 'c'
   * ```
   * @default false
   */
  partitionByNewline?: boolean;
  /**
   * Specifies whether side effect imports should be sorted.
   * - By default, sorting side-effect imports is disabled for security reasons.
   * @default false
   */
  sortSideEffects?: boolean;
}
/**
 * Define your own groups for matching very specific imports.
 * `customGroups` list is ordered: The first definition that matches an element will be used.Custom groups have a higher priority than any predefined group.\n\nIf you want a predefined group to take precedence over a custom group,\nyou must write a custom group definition that does the same as what the predefined group does, and put it first in the list.
 *
 * @default []
 */
export interface CustomGroupItem {
  /** List of import name prefixes to match for this group. */
  elementNamePattern?: string[];
  /** Name of the custom group, used in the `groups` option. */
  groupName?: string;
}
/**
 *
 * Sort `package.json` keys.
 * - The algorithm is NOT compatible with [prettier-plugin-sort-packagejson](https://github.com/matzkoh/prettier-plugin-packagejson). But we believe it is clearer and easier to navigate. For details, see each field's documentation.
 * @experimental
 * @default true
 */
export interface SortPackageJson {
  /**
   * Sort the `scripts` field alphabetically.
   *
   * @default false
   */
  sortScripts?: boolean;
}
/**
 * Sort Tailwind CSS classes.
 * - Uses the [prettier-plugin-tailwindcss](https://github.com/tailwindlabs/prettier-plugin-tailwindcss) algorithm.
 * - Option names omit the `tailwind` prefix used in the original plugin (e.g., `config` instead of `tailwindConfig`).
 * -For details, see each field's documentation.
 * @experimental
 * @default null
 */
export interface Tailwindcss {
  /**
   * List of attribute prefixes that contain Tailwind CSS classes.
   * @important Regex patterns are not yet supported.
   * @default ["class", "className"]
   * @example
   * ```ts
   * ["myClassProp", ":class"]`
   * ```
   */
  attributes?: string[];
  /**
   * Path to your Tailwind CSS configuration file (v3).
   * @important Paths are resolved relative to the Oxfmt configuration file.
   * @default null (automatically find `tailwind.config.js`)
   */
  config?: string;
  /**
   * List of custom function name prefixes that contain Tailwind CSS classes.
   * @important Regex patterns are not yet supported.
   * @default []
   * @example
   * ```
   * ["clsx", "cn", "cva", "tw"]
   * ```
   */
  functions?: string[];
  /** Preserve duplicate classes.
   * @default `false` */
  preserveDuplicates?: boolean;
  /** Preserve whitespace around classes.
   * @default `false` */
  preserveWhitespace?: boolean;
  /** Path to your Tailwind CSS stylesheet (v4).
   * @important Paths are resolved relative to the Oxfmt configuration file.
   * @default null (Installed Tailwind CSS's `theme.css`)
   */
  stylesheet?: string;
}
/**
 * File-specific overrides.\nWhen a file matches multiple overrides, the later override takes precedence (array order matters).
 * @default []
 */
export interface Override {
  /**
   * Glob patterns to match files for this override.
   * @important All patterns are relative to the Oxfmt configuration file.
   */
  files: string[];
  /** Glob patterns to exclude from this override. */
  excludeFiles?: string[];
  /** @see {@link Config} */
  options?: Partial<Config>;
}

/**
 * Oxfmt configuration options interface.
 * Each property corresponds to a configuration option in the schema.
 */
export interface Config {
  /**
   * Schema URI for editor tooling.
   */
  $schema?: string;

  /** Include parentheses around a sole arrow function parameter.
   * @default "always"
   */
  arrowParens?: 'always' | 'avoid';

  /**
   * Put the '>' of a multi-line HTML element at the end of the last line.
   * @default false
   */
  bracketSameLine?: boolean;

  /**
   * Print spaces between brackets in object literals.
   * @default true
   */
  bracketSpacing?: boolean;

  /**
   * Control whether to format embedded language parts.
   * @default "auto"
   */
  embeddedLanguageFormatting?: 'auto' | 'off';

  /** Which end of line characters to apply.
   * @default "lf"
   */
  endOfLine?: 'lf' | 'crlf' | 'cr';

  /**
   * Sort import statements.
   * @experimental
   * @default null
   */
  experimentalSortImports?: SortImports;

  /**
   * Sort package.json keys.
   *
   * @experimental
   * @default true
   */
  experimentalSortPackageJson?: boolean | SortPackageJson;

  /**
   * Sort Tailwind CSS classes.
   * @experimental
   * @default null
   */
  experimentalTailwindcss?: Tailwindcss;

  /**
   * Specify the global whitespace sensitivity for HTML, Vue, Angular, and Handlebars.
   * @default "css"
   */
  htmlWhitespaceSensitivity?: 'css' | 'strict' | 'ignore';

  /**
   * Ignore files matching these glob patterns.
   * @default []
   */
  ignorePatterns?: string[];

  /**
   * Whether to insert a final newline at the end of the file.
   * @default true
   */
  insertFinalNewline?: boolean;

  /**
   * Use single quotes instead of double quotes in JSX.
   * @default false
   */
  jsxSingleQuote?: boolean;

  /**
   * How to wrap object literals.
   * @default "preserve"
   */
  objectWrap?: 'preserve' | 'collapse';

  /**
   * File-specific overrides.
   * @default []
   */
  overrides?: Override[];

  /**
   * Specify the line length that the printer will wrap on.
   * @default 100
   */
  printWidth?: number;

  /**
   * How to wrap prose.
   * @default "preserve"
   */
  proseWrap?: 'always' | 'never' | 'preserve';

  /**
   * Change when properties in objects are quoted.
   * @default "as-needed"
   */
  quoteProps?: 'as-needed' | 'consistent' | 'preserve';

  /**
   * Print semicolons at the ends of statements.
   * @default true
   */
  semi?: boolean;

  /**
   * Enforce single attribute per line in HTML, Vue, and JSX.
   * @default false
   */
  singleAttributePerLine?: boolean;

  /**
   * Use single quotes instead of double quotes.
   * @default false
   */
  singleQuote?: boolean;

  /**
   * Specify the number of spaces per indentation-level.
   * @default 2
   */
  tabWidth?: number;

  /**
   * Print trailing commas wherever possible.
   * @default "all"
   */
  trailingComma?: 'all' | 'es5' | 'none';

  /**
   * Indent lines with tabs instead of spaces.
   * @default false
   */
  useTabs?: boolean;

  /**
   * Whether or not to indent code inside <script> and <style> tags in Vue files.
   * @default false
   */
  vueIndentScriptAndStyle?: boolean;
}
