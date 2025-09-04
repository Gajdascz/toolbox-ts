import type { Str } from '@toolbox-ts/utils';
import type {
  DependencyType,
  ModuleSystemType,
  ProgressType
} from 'dependency-cruiser';

export const MODULE_SYSTEMS: { [S in ModuleSystemType]: S } = {
  cjs: 'cjs',
  es6: 'es6',
  amd: 'amd',
  tsd: 'tsd'
} as const;
export const DEPENDENCY_TYPES: {
  [K in DependencyType as Str.KebabToCamel<K>]: K;
} = {
  aliasedSubpathImport: 'aliased-subpath-import',
  aliasedTsconfigBaseUrl: 'aliased-tsconfig-base-url',
  aliasedTsconfigPaths: 'aliased-tsconfig-paths',
  aliasedTsconfig: 'aliased-tsconfig',
  aliasedWebpack: 'aliased-webpack',
  aliasedWorkspace: 'aliased-workspace',
  aliased: 'aliased',
  amdDefine: 'amd-define',
  amdRequire: 'amd-require',
  amdExoticRequire: 'amd-exotic-require',
  core: 'core',
  deprecated: 'deprecated',
  dynamicImport: 'dynamic-import',
  exoticRequire: 'exotic-require',
  export: 'export',
  importEquals: 'import-equals',
  import: 'import',
  jsdoc: 'jsdoc',
  jsdocBracketImport: 'jsdoc-bracket-import',
  jsdocImportTag: 'jsdoc-import-tag',
  local: 'local',
  localmodule: 'localmodule',
  npmBundled: 'npm-bundled',
  npmDev: 'npm-dev',
  npmNoPkg: 'npm-no-pkg',
  npmOptional: 'npm-optional',
  npmPeer: 'npm-peer',
  npmUnknown: 'npm-unknown',
  npm: 'npm',
  preCompilationOnly: 'pre-compilation-only',
  require: 'require',
  tripleSlashAmdDependency: 'triple-slash-amd-dependency',
  tripleSlashDirective: 'triple-slash-directive',
  tripleSlashFileReference: 'triple-slash-file-reference',
  tripleSlashTypeReference: 'triple-slash-type-reference',
  typeImport: 'type-import',
  typeOnly: 'type-only',
  undetermined: 'undetermined',
  unknown: 'unknown'
} as const;
export const PROGRESS_TYPES: { [P in ProgressType as Str.KebabToCamel<P>]: P } =
  {
    cliFeedback: 'cli-feedback',
    performanceLog: 'performance-log',
    ndjson: 'ndjson',
    none: 'none'
  } as const;
export const CACHE_STRATEGIES = {
  metadata: 'metadata',
  content: 'content'
} as const;

export const PROGRESS_MAXIMUM_LEVEL = {
  OFF: -1,
  SUMMARY: 40,
  INFO: 50,
  DEBUG: 60,
  VERBOSE: 70,
  SILLY: 80,
  ALL: 99
} as const;

export const EXTS = [
  'cjs',
  'cjsx',
  'coffee',
  'csx',
  'cts',
  'js',
  'json',
  'jsx',
  'litcoffee',
  'ls',
  'mjs',
  'mts',
  'svelte',
  'ts',
  'tsx',
  'vue',
  'vuex'
] as const;
