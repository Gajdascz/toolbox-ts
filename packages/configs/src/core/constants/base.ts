export const THIS_PACKAGE = '@toolbox-ts/configs';
export const CHANGESET_MARKER = 'Version Packages';
export const REPO_DOMAINS = ['build', 'dev', 'test'] as const;
export type RepoDomain = (typeof REPO_DOMAINS)[number];
export const REPO_TYPES = ['monorepo', 'singlePackage'] as const;
export type RepoType = (typeof REPO_TYPES)[number];

//#region> Dirs
export const ARTIFACTS_DIR = '.artifacts';
export type ArtifactsDir = typeof ARTIFACTS_DIR;
export const OUT_DIR = `dist`;
export type OutDir = typeof OUT_DIR;
export const DOCS_DIR = 'docs';
export type DocsDir = typeof DOCS_DIR;
export const DEV_DIR = 'dev';
export type DevDir = typeof DEV_DIR;
export const NODE_MODULES_DIR = 'node_modules';
export type NodeModulesDir = typeof NODE_MODULES_DIR;
export const SRC_DIR = 'src';
export type SrcDir = typeof SRC_DIR;
export const PACKAGES_DIR = 'packages';
export type PackagesDir = typeof PACKAGES_DIR;
export const CACHE_DIR = '.cache';
export type CacheDir = typeof CACHE_DIR;
export const REPORTS_DIR = 'reports';
export type ReportsDir = typeof REPORTS_DIR;
export const COVERAGE_DIR = 'coverage';
export type CoverageDir = typeof COVERAGE_DIR;
export const DEV_DIRS = [DEV_DIR, `_${DEV_DIR}`, `.${DEV_DIR}`] as const;
//#endregion

export const SRC_FILE_EXTS = ['ts', 'tsx', 'js', 'jsx', 'cjs', 'mjs'] as const;
export type SrcFileExt = (typeof SRC_FILE_EXTS)[number];
export const DATA_FILE_EXTS = [
  'json',
  'yaml',
  'yml',
  'toml',
  'csv',
  'xml',
  'md'
] as const;
export type DataFileExt = (typeof DATA_FILE_EXTS)[number];

export const TEST_FILE_SUFFIXES = [
  'test',
  'spec',
  'bench',
  'mock',
  'int',
  'integration',
  'unit'
] as const;
export type TestFileSuffix = (typeof TEST_FILE_SUFFIXES)[number];

//#region> Paths
export const CACHE_PATH = `${ARTIFACTS_DIR}/${CACHE_DIR}`;
export type CachePath = typeof CACHE_PATH;
export const REPORTS_PATH = `${ARTIFACTS_DIR}/${REPORTS_DIR}`;
export type ReportsPath = typeof REPORTS_PATH;
export const COVERAGE_PATH = `${REPORTS_PATH}/${COVERAGE_DIR}`;
export type CoveragePath = typeof COVERAGE_PATH;

//#endregion

//#region> Patterns
export const FILE_PATTERNS = {
  dot: '.*',
  config: `*.config.*`,
  rc: '*rc.*',
  typeDefs: `*.d.ts`,
  types: `types.*`,
  constants: `constants.*`,
  index: `index.*`,
  tsconfig: `tsconfig.*`,
  tsconfigSuffixed: `tsconfig.*.json`
} as const;
export const ALL_SRC_DIRS = [SRC_DIR, PACKAGES_DIR] as const;
export const matchAllDirs = (
  dirs: readonly string[] | string[]
): `**/${string}/**`[] =>
  dirs.map((dir) => `**/${dir}/**`) as `**/${string}/**`[];
export const matchAllFiles = (
  files: readonly string[] | string[]
): `**/${string}`[] => files.map((file) => `**/${file}`) as `**/${string}`[];
export const matchAllSuffixed = (
  suffixes: readonly string[] | string[]
): `**/*.${string}.*`[] =>
  suffixes.map((suffix) => `**/*.${suffix}.*`) as `**/*.${string}.*`[];
export const matchAllInDirs = (
  dirs: readonly string[] | string[]
): `${string}/**/*`[] => dirs.map((dir) => `${dir}/**/*`) as `${string}/**/*`[];

export const matchAllInCurrDir = (
  files: readonly string[] | string[]
): `./${string}`[] => files.map((file) => `./${file}`) as `./${string}`[];
export const matchAllExtsInCurrDir = (
  exts: readonly string[] | string[]
): `./*.${string}`[] => exts.map((ext) => `./*.${ext}`) as `./*.${string}`[];

/**
 * ```ts
 * - **\/node_modules**\/
 * - **\/.artifacts**\/
 * - **\/docs**\/
 * - **\/dist**\/
 * ```
 */
export const ALWAYS_IGNORE = matchAllDirs([
  NODE_MODULES_DIR,
  ARTIFACTS_DIR,
  DOCS_DIR,
  OUT_DIR
]);
const SRC_FILE_EXTS_STR = SRC_FILE_EXTS.join(',');
export const ENV_FILE_PATTERNS = ['.env', '*.env', '*.env.*'] as const;
export type EnvFilePattern = (typeof ENV_FILE_PATTERNS)[number];

export const LOCK_FILE_PATTERNS = [
  '*-lock.json',
  '*-lock.yaml',
  '*-lock.yml'
] as const;
export type LockFilePattern = (typeof LOCK_FILE_PATTERNS)[number];
export const GLOBS = {
  srcFileExts: `{${SRC_FILE_EXTS_STR}}`,
  allSrcFiles: `{${ALL_SRC_DIRS.join(',')}}/**/*.{${SRC_FILE_EXTS_STR}}`,
  allDevFiles: `{${DEV_DIRS.join(',')}}/**/*.{${SRC_FILE_EXTS_STR}}`,
  allTestFiles: `**/*.{${TEST_FILE_SUFFIXES.join(',')}}.{${SRC_FILE_EXTS_STR}}`,
  allDataFiles: `**/*.{${DATA_FILE_EXTS.join(',')}}`
} as const;
/**
 * Validates a semantic version string.
 *
 * @see  https://semver.org/#is-there-a-suggested-regular-expression-regex-to-check-a-semver-string
 */
export const SEMVER =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;
//#endregion
