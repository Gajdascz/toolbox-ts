/**
 * Project references (composite builds).
 * Not inherited by extends.
 * @see {@link https://www.typescriptlang.org/tsconfig/#references}
 */
export type References = { path: string }[];

//#region> Compiler Options
//#region> Aliases
/**
 * Control JSX transform and output mode.
 * @see {@link https://www.typescriptlang.org/tsconfig/#jsx}
 */
export type JSXMode =
  | 'preserve'
  | 'react-jsx'
  | 'react-jsxdev'
  | 'react-native'
  | 'react';
/**
 * Determine whether a file is considered a module or a script.
 * @see {@link https://www.typescriptlang.org/tsconfig/#moduleDetection}
 */
export type ModuleDetectionKind = 'auto' | 'force' | 'legacy';
/**
 * Module system for emitted output and type checking.
 * Common modern values: "nodenext", "preserve", "esnext".
 * @see {@link https://www.typescriptlang.org/tsconfig/#module}
 */
export type ModuleKind =
  | 'amd'
  | 'commonjs'
  | 'es2015'
  | 'es2020'
  | 'es2022'
  | 'es6'
  | 'esnext'
  | 'node16'
  | 'node18'
  | 'node20'
  | 'nodenext'
  | 'none'
  | 'preserve'
  | 'system'
  | 'umd';
/**
 * Module resolution strategy.
 * Use "nodenext" or "node16" for modern Node.js, "bundler" for bundlers.
 * @see {@link https://www.typescriptlang.org/tsconfig/#moduleResolution}
 */
export type ModuleResolutionKind =
  | 'bundler'
  | 'classic'
  | 'node'
  | 'node10'
  | 'node16'
  | 'nodenext';

/**
 * Output newline style: 'crlf' or 'lf'.
 * @see {@link https://www.typescriptlang.org/tsconfig/#newLine}
 *
 */
export type NewLine = 'crlf' | 'lf';
/**
 * Language Service plugins executed by editors (e.g., VS Code).
 * Does not affect `tsc` emit or type checking.
 * @see {@link https://www.typescriptlang.org/tsconfig/#plugins}
 */
export type Plugins = { [option: string]: unknown; name: string }[];
/**
 * JavaScript language version emitted.
 * Controls downleveling and default lib selection.
 * @see {@link https://www.typescriptlang.org/tsconfig/#target}
 */
export type TargetKind =
  | 'es2015'
  | 'es2016'
  | 'es2017'
  | 'es2018'
  | 'es2019'
  | 'es2020'
  | 'es2021'
  | 'es2022'
  | 'es2023'
  | 'es2024'
  | 'es3'
  | 'es5'
  | 'es6'
  | 'esnext';
//#endregion
//#region> Interfaces
/**
 * @see {@link https://www.typescriptlang.org/tsconfig/#Compiler_Diagnostics_6251}
 */
export interface CompilerDiagnostics {
  /** Explain why each file is part of the program. */
  explainFiles?: boolean;

  /** Detailed performance breakdown. Superset of diagnostics. */
  extendedDiagnostics?: boolean;

  /** Emit V8 CPU profile (`.cpuprofile`). CLI-only. */
  generateCpuProfile?: string | true;

  /** Emit event trace + type list. */
  generateTrace?: boolean;

  /** Print emitted file paths. */
  listEmittedFiles?: boolean;

  /** Print files included in compilation (raw). */
  listFiles?: boolean;

  /** Disable full type checking; only emit/parse errors. */
  noCheck?: boolean;

  /** Print module resolution decisions. */
  traceResolution?: boolean;
}
/**
 * @see {@link https://www.typescriptlang.org/tsconfig/#Completeness_6257}
 */
export interface Completeness {
  /** Skip type checking of all .d.ts files. */
  skipLibCheck?: boolean;
}
/**
 * @see {@link https://www.typescriptlang.org/tsconfig/#Editor_Support_6249}
 */
export interface EditorSupport {
  /**
   * Disable TypeScript's memory safety limit for very large projects.
   * Useful for extremely large JS or mixed TS/JS monorepos.
   */
  disableSizeLimit?: boolean;

  plugins?: Plugins;
}
/**
 *  @see {@link https://www.typescriptlang.org/tsconfig/#Emit_6246}
 */
export interface Emission {
  /** Generate .d.ts files for all project sources. */
  declaration?: boolean;

  /** Output directory for .d.ts files. */
  declarationDir?: string;

  /** Generate source maps for .d.ts files (supports Go-to-Definition). */
  declarationMap?: boolean;

  /**
   * More accurate ES6 iteration semantics when targeting older JS.
   * Uses Symbol.iterator when available.
   */
  downlevelIteration?: boolean;

  /** Emit a UTF-8 BOM in output files. */
  emitBOM?: boolean;

  /** Emit only .d.ts files and skip JS output completely. */
  emitDeclarationOnly?: boolean;

  /**
   * Import helper functions (e.g., __extends, __awaiter) from `tslib`
   * instead of emitting inline copies.
   */
  importHelpers?: boolean;

  /** Inline source maps into emitted .js files instead of writing .map files. */
  inlineSourceMap?: boolean;

  /** Inline the original .ts sources into the source map. Requires sourceMap or inlineSourceMap. */
  inlineSources?: boolean;

  /** Override the map file location referenced inside source maps. */
  mapRoot?: string;

  newLine?: NewLine;

  /** Do not emit any JS, declaration, or map output. */
  noEmit?: boolean;

  /** Do not emit helper functions; assume global helpers exist. */
  noEmitHelpers?: boolean;

  /**
   * Skip emitting files if any type errors were reported.
   * Default false.
   */
  noEmitOnError?: boolean;

  /**
   * Output directory for emitted files (preserves folder structure).
   */
  outDir?: string;

  /**
   * Concatenate global or AMD/System modules into a single file.
   * Incompatible with CommonJS/ES modules.
   */
  outFile?: string;

  /**
   * Preserve const enums in JS output instead of erasing them.
   * Default true when isolatedModules is enabled.
   */
  preserveConstEnums?: boolean;

  /** Remove all comments from emitted JS. */
  removeComments?: boolean;

  /** Generate .js.map files for JS output. */
  sourceMap?: boolean;

  /** Override the referenced TypeScript source path inside source maps. */
  sourceRoot?: string;

  /**
   * Strip `@internal`-marked declarations from .d.ts output.
   * Does not affect JS.
   */
  stripInternal?: boolean;
}
/**
 * @see {@link https://www.typescriptlang.org/tsconfig/#Interop_Constraints_6252}
 */
export interface InteropConstraints {
  /**
   * Allow default imports when a module has no actual default export.
   * Type-check only; does not change JS emit.
   * Enabled automatically under esModuleInterop/system/bundler resolution modes.
   */
  allowSyntheticDefaultImports?: boolean;

  /**
   * Restrict code to TS syntax erasable to valid JavaScript at runtime.
   * Disallows constructs with runtime effects: enums, namespaces with code,
   * parameter properties, import/export assignment, angle-bracket assertions.
   */
  erasableSyntaxOnly?: boolean;

  /**
   * Full ES module interop compatibility for CommonJS/AMD/UMD.
   * Adds helper functions to emitted JS and enables synthetic defaults.
   * Recommended for most modern codebases.
   */
  esModuleInterop?: boolean;

  /**
   * Enforce consistent file path casing between import specifiers
   * and disk paths. Prevents cross-OS case-sensitivity bugs.
   */
  forceConsistentCasingInFileNames?: boolean;

  /**
   * Require exports to be fully annotatable so declaration generation
   * is trivially possible for external tools.
   */
  isolatedDeclarations?: boolean;

  /**
   * Validate code remains safe for single-file transpilers
   * (Babel, SWC, ts.transpileModule).
   * Disallows constructs requiring cross-file information.
   */
  isolatedModules?: boolean;

  /**
   * Preserve symbolic-link boundaries during module resolution.
   * Mirrors Node's `--preserve-symlinks`.
   */
  preserveSymlinks?: boolean;

  /**
   * Fully literal module syntax rules:
   * - No type-driven import elision.
   * - Imports/exports appear exactly as written unless `type`-qualified.
   * - Disallows rewriting ESM syntax to CJS `require`.
   * Deprecates importsNotUsedAsValues + preserveValueImports.
   */
  verbatimModuleSyntax?: boolean;
}
/**
 * @see {@link https://www.typescriptlang.org/tsconfig/#JavaScript_Support_6247}
 */
export interface JavaScriptSupport {
  /** Allow importing `.js` files within the project. */
  allowJs?: boolean;

  /**
   * Enable semantic type-checking in `.js` files.
   * Equivalent to using `// @ts-check` in all included JS files.
   */
  checkJs?: boolean;

  /**
   * Maximum dependency depth (within node_modules) to check JS files for types.
   * Only applies when allowJs is enabled.
   */
  maxNodeModuleJsDepth?: number;
}
/**
 * @see {@link https://www.typescriptlang.org/tsconfig/#Language_and_Environment_6254}
 */
export interface LanguageAndEnvironment {
  /**
   * Emit design-time type metadata for decorated declarations.
   * Requires `experimentalDecorators` and a metadata consumer (e.g., reflect-metadata).
   * Adds `__metadata("design:type", ...)` etc.
   */
  emitDecoratorMetadata?: boolean;
  /**
   * Enable the legacy experimental decorator implementation.
   * Required for all current decorator usage unless using the new TC39 decorators (TS 5+).
   */
  experimentalDecorators?: boolean;

  jsx?: JSXMode;

  /**
   * Classic JSX factory for `react` emit (e.g., "h", "preact.h", "React.createElement").
   */
  jsxFactory?: string;

  /**
   * Classic JSX fragment factory for Fragment syntax (e.g., "Fragment", "preact.Fragment").
   */
  jsxFragmentFactory?: string;

  /**
   * Module providing the runtime for automatic JSX transforms (react-jsx/react-jsxdev).
   * Defaults to "react".
   */
  jsxImportSource?: string;

  /**
   * Explicit list of built-in lib files to include.
   * Overrides default libs implied by `target`.
   * Examples: ["es2020", "dom"], ["esnext", "webworker"], etc.
   */
  lib?: string[];

  /**
   * Enable or disable substitution of default lib files with `@typescript/lib-*` packages.
   */
  libReplacement?: boolean;

  moduleDetection?: ModuleDetectionKind;

  /**
   * Disable automatic inclusion of all lib files.
   * Requires user-supplied definitions for core JS primitives.
   */
  noLib?: boolean;

  target?: TargetKind | Uppercase<TargetKind>;

  /**
   * Use standards-compliant class field semantics (`= value` defined on instances).
   * Recommended for compatibility with modern JavaScript runtimes.
   */
  useDefineForClassFields?: boolean;
}
/**
 * @see {@link https://www.typescriptlang.org/tsconfig/#Modules_6244}
 */
export interface Modules {
  /** Allow importing files with arbitrary non-TS/JS extensions when supported by the runtime/bundler. */
  allowArbitraryExtensions?: boolean;

  /** Allow importing `.ts`, `.tsx`, `.mts`, `.cts` extensions directly. Requires noEmit or emitDeclarationOnly. */
  allowImportingTsExtensions?: boolean;

  /** Allow accessing UMD global variables from within module files. */
  allowUmdGlobalAccess?: boolean;

  /** Base directory for resolving non-relative module specifiers. */
  baseUrl?: string;

  /** Extra package.json condition names to include during exports/imports resolution. */
  customConditions?: string[];

  module?: ModuleKind;

  moduleResolution?: ModuleResolutionKind;

  /** File suffix search order for module resolution. */
  moduleSuffixes?: string[];

  /** Disable automatic resolution/discovery of imported files. */
  noResolve?: boolean;

  /** Error on side-effect-only imports that cannot be resolved. */
  noUncheckedSideEffectImports?: boolean;

  /**
   * Custom path remapping relative to baseUrl.
   * Does not affect emitted JS, only type resolution.
   */
  paths?: Record<string, string[]>;

  /** Allow importing JSON modules and infer their types. */
  resolveJsonModule?: boolean;

  /** Force TypeScript to check package.json "exports". */
  resolvePackageJsonExports?: boolean;

  /** Force TypeScript to check package.json "imports". */
  resolvePackageJsonImports?: boolean;

  /** Rewrite TS extensions in relative imports to JS equivalents in emitted output. */
  rewriteRelativeImportExtensions?: boolean;

  /**
   * Root directory for emitted structure.
   * Affects output path layout but not which files are included.
   */
  rootDir?: string;

  /**
   * Virtual merged roots for resolution only.
   * Useful for generated declaration layers or mirrored directory structures.
   */
  rootDirs?: string[];

  /**
   * Include only `@types` packages located under these roots.
   * Overrides default `@types` discovery.
   */
  typeRoots?: string[];

  /**
   * Explicit list of `@types` packages to include in the global scope.
   * Limits global ambient typings.
   */
  types?: string[];
}
/**
 * @see {@link https://www.typescriptlang.org/tsconfig/#Output_Formatting_6256}
 */
export interface OutputFormatting {
  /** Do not truncate long error messages. */
  noErrorTruncation?: boolean;

  /** Keep previous terminal output in watch mode. */
  preserveWatchOutput?: boolean;

  /** Enable ANSI-styled pretty output. */
  pretty?: boolean;
}
/**
 * @see {@link https://www.typescriptlang.org/tsconfig/#Projects_6255}
 */
export interface Projects {
  /** Enforce constraints for project references + faster builds. Enables declaration. */
  composite?: boolean;

  /** Do not load referenced projects eagerly for editor features. */
  disableReferencedProjectLoad?: boolean;

  /** Exclude this project from solution-wide editor features (find refs, go-to-def). */
  disableSolutionSearching?: boolean;

  /** Use pre-3.7 behavior: project references use .d.ts boundaries instead of sources. */
  disableSourceOfProjectReferenceRedirect?: boolean;

  /** Enable incremental compilation (.tsbuildinfo). */
  incremental?: boolean;

  /** Path for .tsbuildinfo output. */
  tsBuildInfoFile?: string;
}
/**
 * @see {@link https://www.typescriptlang.org/tsconfig/#Type_Checking_6248}
 */
export interface TypeChecking {
  /** Allow unreachable statements. undefined: warn; true: ignore; false: error. */
  allowUnreachableCode?: boolean;

  /** Allow unused labels. undefined: warn; true: ignore; false: error. */
  allowUnusedLabels?: boolean;

  /**
   * Parse/emit strict mode.
   * @default true if `strict` enabled.
   */
  alwaysStrict?: boolean;

  /** Enforce exact optional property semantics. */
  exactOptionalPropertyTypes?: boolean;

  /** Disallow switch fallthrough without break/return/throw. */
  noFallthroughCasesInSwitch?: boolean;

  /**
   * Disallow implicit any inference.
   * @default true if `strict` enabled.
   */
  noImplicitAny?: boolean;

  /** Require `override` keyword when overriding superclass members. */
  noImplicitOverride?: boolean;

  /** Require all code paths to return a value. */
  noImplicitReturns?: boolean;

  /**
   * Disallow implicit `any` on `this` context.
   * @default true if `strict`.
   */
  noImplicitThis?: boolean;

  /** Require indexed signature fields to be accessed with bracket syntax. */
  noPropertyAccessFromIndexSignature?: boolean;

  /** Add `undefined` to types from indexed access on undeclared keys. */
  noUncheckedIndexedAccess?: boolean;

  /** Error when locals are declared and unused. */
  noUnusedLocals?: boolean;

  /** Error when parameters are unused (except those prefixed with `_`). */
  noUnusedParameters?: boolean;

  /** Enable all strict mode options. */
  strict?: boolean;

  /**
   * Validate arguments for `call`, `bind`, `apply`.
   * @default true if `strict`.
   */
  strictBindCallApply?: boolean;

  /**
   * Built-in iterator return type is `undefined` instead of `any`.
   * @default true if `strict`.
   */
  strictBuiltinIteratorReturn?: boolean;

  /**
   * Function parameter bivariance checking (functions only, not methods).
   * @default true if `strict`.
   */
  strictFunctionTypes?: boolean;

  /**
   * `null` and `undefined` treated as distinct types.
   * @default true if `strict`.
   */
  strictNullChecks?: boolean;

  /**
   * Class fields must be definitely assigned.
   * @default true if `strict`.
   */
  strictPropertyInitialization?: boolean;

  /** Catch variable typed as `unknown` instead of `any`. */
  useUnknownInCatchVariables?: boolean;
}
//#endregion
/**
 * @see {@link https://www.typescriptlang.org/tsconfig/#compiler-options}
 */
export type CompilerOptions = CompilerDiagnostics
  & Completeness
  & EditorSupport
  & Emission
  & InteropConstraints
  & JavaScriptSupport
  & LanguageAndEnvironment
  & Modules
  & OutputFormatting
  & Projects
  & TypeChecking;

export type CompilerOptionsWithStatic<C extends CompilerOptions> =
  CompilerOptions & Required<C>;
//#endregion

//#region> Watch Options
/**
 * Polling strategy when native watchers are unavailable.
 * @see {@link https://www.typescriptlang.org/tsconfig/#fallbackPolling}
 */
export type FallbackPollingStrategy =
  | 'dynamicpriority'
  | 'fixedchunksize'
  | 'fixedinterval'
  | 'priorityinterval';

/**
 * Strategy for directory tree watching.
 * @see {@link https://www.typescriptlang.org/tsconfig/#watch-watchDirectory}
 */
export type WatchDirectoryStrategy =
  | 'dynamicprioritypolling'
  | 'fixedchunksizepolling'
  | 'fixedpollinginterval'
  | 'usefsevents';

/**
 * Strategy for individual file watching.
 * @see {@link https://www.typescriptlang.org/tsconfig/#watch-watchFile}
 */
export type WatchFileStrategy =
  | 'dynamicprioritypolling'
  | 'fixedchunksizepolling'
  | 'fixedpollinginterval'
  | 'prioritypollinginterval'
  | 'usefsevents'
  | 'usefseventsonparentdirectory';
/**
 * @see {@link https://www.typescriptlang.org/tsconfig/#watch-options}
 */
export interface WatchOptions {
  /** Glob patterns for directories to exclude from watch. */
  excludeDirectories?: string[];

  /** Glob patterns for files to exclude from watch. */
  excludeFiles?: string[];

  fallbackPolling?: FallbackPollingStrategy;

  /** Force sync directory watching on platforms lacking recursive watchers. */
  synchronousWatchDirectory?: boolean;

  watchDirectory?: WatchDirectoryStrategy;

  watchFile?: WatchFileStrategy;
}
//#endregion

//#region> Type Acquisition
/**
 * @see {@link https://www.typescriptlang.org/tsconfig/#type-acquisition}
 */
export interface TypeAcquisition {
  /**
   * Disable filename-based inference:
   * e.g., jquery.js → automatically fetch @types/jquery
   */
  disableFilenameBasedTypeAcquisition?: boolean;

  /** Enable/disable automatic type acquisition. Default: true. */
  enable?: boolean;

  /** Packages to exclude from type acquisition. */
  exclude?: string[];

  /** Explicit list of packages to acquire types for. */
  include?: string[];
}
//#endregion

//#region> Meta
/**
 * Metadata fields for tsconfig files to provide additional details.
 */
export interface TsConfigMeta<N extends string> {
  $schema: string;
  description: string;
  filename: string;
  name: N;
}
//#endregion

/**
 * All top-level fields of a tsconfig file.
 *
 *  @see {@link https://www.typescriptlang.org/tsconfig/#root-fields}
 */
export type RootField = keyof TsConfig;

/** @see {@link https://www.typescriptlang.org/tsconfig} */
export interface TsConfig<C extends CompilerOptions = CompilerOptions> {
  compilerOptions?: C & CompilerOptions;

  /**
   * Patterns to subtract from include.
   * Does NOT prevent inclusion via imports, references, or files list.
   */
  exclude?: string[];

  /**
   * Inherit configuration from another tsconfig file.
   * Node-style resolution; relative paths resolved against originating file.
   */
  extends?: string;

  /**
   * Explicit allowlist of files to include in the program.
   * Overrides include/exclude behavior.
   */
  files?: string[];

  /**
   * Glob patterns or explicit paths that define the input set.
   * Interacts with exclude; resolved relative to tsconfig.json.
   */
  include?: string[];
  references?: References;
  typeAcquisition?: TypeAcquisition;
  watchOptions?: WatchOptions;
}

/**
 * Used for processing tsconfig inputs where certain fields are statically known.
 *
 * @example
 * ```ts
 * const tsconfigInput: TsConfigInput<'my-tsconfig', { strict: true }, { strict: true }> = {
 *   compilerOptions: {
 *     noImplicitAny: true, // allowed
 *     strict: false, // Error: Type 'false' is not assignable to type 'true'.
 *   },
 *   exclude: ['node_modules'], // allowed
 *   strict: false, // Error: Object literal may only specify known properties, and 'strict' does not exist in type 'Omit<TsConfig<"my-tsconfig">, "compilerOptions">'.
 * }
 * ```
 */
export type TsConfigInput<
  StaticFields extends Omit<Partial<TsConfig>, 'compilerOptions'>,
  StaticCompilerOptions extends CompilerOptions | object = object
> = {
  compilerOptions?: Omit<CompilerOptions, keyof StaticCompilerOptions>;
} & Omit<TsConfig, 'compilerOptions' | keyof StaticFields>;
/**
 * TsConfig with added metadata fields.
 */
export type TsConfigWithMeta<
  N extends string,
  C extends CompilerOptions = CompilerOptions
> = TsConfig<C> & TsConfigMeta<N>;
export type TsConfigWithMetaInput<
  N extends string,
  StaticFields extends Omit<Partial<TsConfigWithMeta<N>>, 'compilerOptions'>,
  StaticCompilerOptions extends CompilerOptions | object = object
> = {
  compilerOptions?: Omit<CompilerOptions, keyof StaticCompilerOptions>;
} & Omit<TsConfigWithMeta<N>, 'compilerOptions' | keyof StaticFields>;
