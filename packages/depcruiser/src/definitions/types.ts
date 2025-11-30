import type { OverwriteBehavior } from '@toolbox-ts/file';
import type {
  DependencyType,
  IConfiguration,
  ICruiseOptions,
  IFormatOptions,
  ProgressType
} from 'dependency-cruiser';

import type {
  GraphCfg,
  Loggable,
  ReportCfg,
  Type
} from './output-types/types.js';
import type { forbidden } from './rules/index.js';

//#region> Native Interfaces
export interface IBabelConfig {
  fileName: string;
}
export interface ICache {
  /**
   * Whether to compress the cache or not
   *
   *  Setting this to true adds a few ms to the execution time, but
   * typically reduces the cache size by 80-90%.
   *
   * Defaults to false.
   */
  compress: boolean;
  /**
   * The folder to store the cache in.
   *
   * Defaults to node_modules/.cache/dependency-cruiser/
   */
  folder: string;
  /**
   * The strategy to use for caching.
   * - 'metadata': use git metadata to detect changes;
   * - 'content': use (a checksum of) the contents of files to detect changes.
   *
   * 'content'is useful if you're not on git or work on partial clones
   * (which is typical on CI's). Trade-of: the 'content' strategy is typically
   * slower.
   *
   * Defaults to 'metadata'
   */
  strategy: 'content' | 'metadata';
}
export interface IDoNotFollow {
  /**
   * an array of dependency types to include, but not follow further
   */
  dependencyTypes?: DependencyType[];
  /**
   * a regular expression for modules to include, but not follow further
   */
  path: string[];
}
export interface IExclude {
  /**
   * a boolean indicating whether or not to exclude dynamic dependencies
   * leave out to match both
   */
  dynamic?: boolean;
  /**
   * a regular expression for modules to exclude
   */
  path: string | string[];
}
export interface IFocus {
  /**
   * by default 'focus' only inlcudes the direct neighbours of the focus'ed module(s).
   * This property makes dependency-cruiser will also include neighbors of neighbors,
   * up to the specified depth.
   */
  depth: number;
  /**
   * dependency-cruiser will include modules matching this regular expression
   * in its output, as well as their neighbours (direct dependencies and
   * dependents)
   */
  path: string | string[];
}
export interface IFormattingOptions extends IFormatOptions {
  collapse: number | string;
  exclude: IExclude;
  focus: IFocus;
  includeOnly: IIncludeOnly;
  outputType: Type;
  prefix: string;
  reaches: IReaches | string;
}
export interface IHighlight {
  /**
   * dependency-cruiser will mark modules matching this regular expression
   * as 'highlighted' in its output
   */
  path: string | string[];
}
export interface IIncludeOnly {
  /**
   * regular expression describing which dependencies the function
   * should cruise - anything not matching this will be skipped
   */
  path: string | string[];
}
/**
 * Whether or not to show progress feedback when the command line
 * app is running.
 */
export interface IProgress {
  /**
   * The maximum log level to emit messages at. Ranges from OFF (-1, don't " +
   * show any messages), via SUMMARY (40), INFO (50), DEBUG (60) all the " +
   * way to show ALL messages (99)."
   */
  maximumLevel: -1 | 40 | 50 | 60 | 70 | 80 | 99;
  /**
   * The type of progress to show; `none` to not show anything at all;
   * `cli-feedback` to show a progress bar on stderr that disappears when
   * processing is done or `performance-log` to print timings and memory usage
   * of each major step to stderr.
   */
  type: ProgressType;
}
export interface IReaches {
  /**
   * dependency-cruiser will include modules matching this regular expression
   * in its output, as well as _any_ module that reaches them - either directly
   * or via via.
   */
  path: string | string[];
}
export interface ITsConfig {
  fileName: string;
}
/**
 * The webpack configuration options used for the cruise
 */
export interface IWebpackConfig {
  /**
   * The arguments used
   */
  arguments: { [key: string]: unknown };
  /**
   * The 'env' parameters passed
   */
  env: Record<string, unknown> | string;
  /**
   * The name of the webpack configuration file used
   */
  fileName: string;
}
//#endregion

export interface InputConfig extends Omit<
  IConfiguration,
  'forbidden' | 'options'
> {
  configFileName?: string;
  extendForbidden?: IConfiguration['forbidden'];
  /**
   * Native Forbidden rules configuration
   * - Rules explicitly set to false are omitted entirely
   * - Rules mentioned with a configuration object are merged with the default
   * - Rules explicitly set to true are included with their default configuration
   * - Rules not mentioned are included with their default configuration
   */
  forbidden?: Partial<forbidden.Config>;
  options?: InputCruiseOptions;
}
export interface InputCruiseOptions extends Omit<
  ICruiseOptions,
  'babelConfig' | 'doNotFollow' | 'outputType' | 'tsConfig' | 'webpackConfig'
> {
  affected?: string;
  babelConfig?: Partial<IBabelConfig> | string;
  cache?: boolean | Partial<ICache>;
  doNotFollow?: Partial<IDoNotFollow>;
  graph?: Toggleable<Partial<GraphCfg>>;
  log?: Toggleable<Loggable>;
  /**
   * Defines what to do when writing output files and the file(s) already exist
   * - 'prompt': Ask user for confirmation.
   * - 'force': Always overwrite without asking
   * - 'skip': Never overwrite, return false if directory is not empty
   */
  overwriteBehavior?: OverwriteBehavior;
  report?: Toggleable<Partial<ReportCfg>>;
  tsConfig?: Partial<ITsConfig> | string;
  webpackConfig?: Partial<IWebpackConfig> | string;
}

export interface ResolvedConfig extends IConfiguration {
  configFileName: string;
  options: ResolvedCruiseOptions;
}

export interface ResolvedCruiseOptions extends Omit<
  ICruiseOptions,
  'outputType'
> {
  affected?: string;
  babelConfig?: IBabelConfig;
  cache: Toggleable<Partial<ICache>>;
  doNotFollow: IDoNotFollow;
  exclude?: IExclude;
  focus?: IFocus;
  graph: Toggleable<GraphCfg>;
  highlight?: IHighlight;
  includeOnly?: IIncludeOnly;
  log: Toggleable<Loggable>;
  outputTo: string;
  /**
   * Defines what to do when writing output files and the file(s) already exist
   * - 'prompt': Ask user for confirmation.
   * - 'force': Always overwrite without asking
   * - 'skip': Never overwrite, return false if directory is not empty
   */
  overwriteBehavior: OverwriteBehavior;
  progress: IProgress;
  reaches?: IReaches;
  report: Toggleable<ReportCfg>;
  tsConfig?: ITsConfig;
  webpackConfig?: IWebpackConfig;
}

export type Toggleable<T> = false | T;
