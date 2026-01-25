//#region> Dirs
export const ARTIFACTS_DIR = '.artifacts';
export type ArtifactsDir = typeof ARTIFACTS_DIR;
export const OUT_DIR = `dist`;
export type OutDir = typeof OUT_DIR;
export const DOCS_DIR = 'docs';
export type DocsDir = typeof DOCS_DIR;
export const DEV_DIR = '.dev';
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
export const GITHUB_DIR = '.github';
export type GithubDir = typeof GITHUB_DIR;
export const HUSKY_DIR = '.husky';
export type HuskyDir = typeof HUSKY_DIR;
export const CHANGESETS_DIR = '.changeset';
export type ChangesetsDir = typeof CHANGESETS_DIR;
export const VSCODE_DIR = '.vscode';
export type VscodeDir = typeof VSCODE_DIR;
export const DEPENDENCIES_REPORTS_DIR = 'dependencies';
export type DependenciesReportsDir = typeof DEPENDENCIES_REPORTS_DIR;
//#endregion

//#region> Files
export const LICENSE_FILE = 'LICENSE';
export type LicenseFile = typeof LICENSE_FILE;
export const README_FILE = 'README.md';
export type ReadmeFile = typeof README_FILE;
export const PACKAGE_JSON_FILE = 'package.json';
export type PackageJsonFile = typeof PACKAGE_JSON_FILE;
export const TSCONFIG_FILE = 'tsconfig.json';
export type TsConfigFile = typeof TSCONFIG_FILE;
export const TSCONFIG_BASE_FILE = 'tsconfig.base.json';
export type TsConfigBaseFile = typeof TSCONFIG_BASE_FILE;
export const TSCONFIG_BUILD_FILE = 'tsconfig.build.json';
export type TsConfigBuildFile = typeof TSCONFIG_BUILD_FILE;
export const TSCONFIG_TEST_FILE = 'tsconfig.test.json';
export type TsConfigTestFile = typeof TSCONFIG_TEST_FILE;
export const TSCONFIG_DEV_FILE = 'tsconfig.dev.json';
export type TsConfigDevFile = typeof TSCONFIG_DEV_FILE;
export const DEPENDENCY_CRUISER_CONFIG_FILE = '.dependency-cruiser.js';
export type DependencyCruiserConfigFile = typeof DEPENDENCY_CRUISER_CONFIG_FILE;
export const ESLINT_CONFIG_FILE = 'eslint.config.ts';
export type EslintConfigFile = typeof ESLINT_CONFIG_FILE;
export const VITEST_CONFIG_FILE = 'vitest.config.ts';
export type VitestConfigFile = typeof VITEST_CONFIG_FILE;
export const PRETTIER_CONFIG_FILE = 'prettier.config.js';
export type PrettierConfigFile = typeof PRETTIER_CONFIG_FILE;
export const TSDOC_CONFIG_FILE = 'tsdoc.json';
export type TsdocConfigFile = typeof TSDOC_CONFIG_FILE;
export const COMMITLINT_CONFIG_FILE = 'commitlint.config.ts';
export type CommitlintConfigFile = typeof COMMITLINT_CONFIG_FILE;
export const GITIGNORE_FILE = '.gitignore';
export type GitignoreFile = typeof GITIGNORE_FILE;
export const INDEX_FILE = {
  ts: 'index.js',
  js: 'index.js',
  dts: 'index.d.ts'
} as const;
export type IndexFile = (typeof INDEX_FILE)[keyof typeof INDEX_FILE];
export const ENV_FILE = '.env' as const;
export type EnvFile = typeof ENV_FILE;
export const LOCK_FILE = {
  npm: 'package-lock.json',
  yarn: 'yarn.lock',
  pnpm: { yaml: 'pnpm-lock.yaml', yml: 'pnpm-lock.yml' }
} as const;
export const PNPM_WORKSPACE_FILE = {
  yaml: 'pnpm-workspace.yaml',
  yml: 'pnpm-workspace.yml'
} as const;
export const PNPM_STORE_FILE = '.pnpm-store';
export type PnpmStoreFile = typeof PNPM_STORE_FILE;
//#endregion

//#region> Paths
export const CACHE_PATH = `${ARTIFACTS_DIR}/${CACHE_DIR}` as const;
export type CachePath = typeof CACHE_PATH;
export const REPORTS_PATH = `${ARTIFACTS_DIR}/${REPORTS_DIR}` as const;
export type ReportsPath = typeof REPORTS_PATH;
export const COVERAGE_PATH = `${REPORTS_PATH}/${COVERAGE_DIR}` as const;
export type CoveragePath = typeof COVERAGE_PATH;
export const DIST_INDEX_PATH = `${OUT_DIR}/${INDEX_FILE.js}` as const;
export type DistIndexPath = typeof DIST_INDEX_PATH;
export const SRC_INDEX_PATH = `${SRC_DIR}/${INDEX_FILE.ts}` as const;
export type SrcIndexPath = typeof SRC_INDEX_PATH;
export const DIST_TYPES_INDEX_PATH = `${OUT_DIR}/${INDEX_FILE.dts}` as const;
export type DistTypesIndexPath = typeof DIST_TYPES_INDEX_PATH;
export const DEPENDENCIES_REPORTS_PATH =
  `${REPORTS_PATH}/${DEPENDENCIES_REPORTS_DIR}` as const;
export type DependenciesReportsPath = typeof DEPENDENCIES_REPORTS_PATH;
//#endregion

//#region> Groups
export const ANY_ROOT_SRC_DIR = [SRC_DIR, PACKAGES_DIR] as const;
export const ROOT_DIRS = {
  [DEV_DIR]: `/${DEV_DIR}`,
  [ARTIFACTS_DIR]: `/${ARTIFACTS_DIR}`,
  [PACKAGE_JSON_FILE]: `/${PACKAGE_JSON_FILE}`,
  [TSCONFIG_BASE_FILE]: `/${TSCONFIG_BASE_FILE}`,
  [TSCONFIG_BUILD_FILE]: `/${TSCONFIG_BUILD_FILE}`,
  [TSCONFIG_DEV_FILE]: `/${TSCONFIG_DEV_FILE}`,
  [TSCONFIG_FILE]: `/${TSCONFIG_FILE}`,
  [TSCONFIG_TEST_FILE]: `/${TSCONFIG_TEST_FILE}`,
  [README_FILE]: `/${README_FILE}`,
  [LICENSE_FILE]: `/${LICENSE_FILE}`,
  [VSCODE_DIR]: `/${VSCODE_DIR}`,
  [GITHUB_DIR]: `/${GITHUB_DIR}`,
  [DOCS_DIR]: `/${DOCS_DIR}`,
  [HUSKY_DIR]: `/${HUSKY_DIR}`,
  [DEPENDENCY_CRUISER_CONFIG_FILE]: `/${DEPENDENCY_CRUISER_CONFIG_FILE}`,
  [GITIGNORE_FILE]: `/${GITIGNORE_FILE}`,
  [PRETTIER_CONFIG_FILE]: `/${PRETTIER_CONFIG_FILE}`,
  [TSDOC_CONFIG_FILE]: `/${TSDOC_CONFIG_FILE}`,
  [COMMITLINT_CONFIG_FILE]: `/${COMMITLINT_CONFIG_FILE}`,
  [ESLINT_CONFIG_FILE]: `/${ESLINT_CONFIG_FILE}`,
  [VITEST_CONFIG_FILE]: `/${VITEST_CONFIG_FILE}`,
  [LOCK_FILE.pnpm.yaml]: `/${LOCK_FILE.pnpm.yaml}`
} as const;
export const REPO_ARTIFACTS = {
  [REPORTS_DIR]: `${ROOT_DIRS[ARTIFACTS_DIR]}/${REPORTS_DIR}`,
  [CACHE_DIR]: `${ROOT_DIRS[ARTIFACTS_DIR]}/${CACHE_DIR}`
} as const;
export const REPO_REPORTS = {
  [COVERAGE_DIR]: `${REPO_ARTIFACTS[REPORTS_DIR]}/${COVERAGE_DIR}`,
  [DEPENDENCIES_REPORTS_DIR]: `${REPO_ARTIFACTS[REPORTS_DIR]}/${DEPENDENCIES_REPORTS_DIR}`
} as const;

export const REPO_ROOT = {
  ...ROOT_DIRS,
  [ARTIFACTS_DIR]: {
    [REPORTS_DIR]: REPO_REPORTS,
    [CACHE_DIR]: REPO_ARTIFACTS[CACHE_DIR]
  }
} as const;

export const SINGLE_PKG_REPO = {
  ...REPO_ROOT,
  [SRC_DIR]: `/${SRC_DIR}`
} as const;
export const MONOREPO = {
  ...REPO_ROOT,
  [CHANGESETS_DIR]: `/${CHANGESETS_DIR}`,
  [PACKAGES_DIR]: {
    '<package>': {
      [SRC_DIR]: `/${PACKAGES_DIR}/<package>/${SRC_DIR}`,
      [PACKAGE_JSON_FILE]: `/${PACKAGES_DIR}/<package>/${PACKAGE_JSON_FILE}`,
      [TSCONFIG_FILE]: `/${PACKAGES_DIR}/<package>/${TSCONFIG_FILE}`,
      [README_FILE]: `/${PACKAGES_DIR}/<package>/${README_FILE}`,
      [LICENSE_FILE]: `/${PACKAGES_DIR}/<package>/${LICENSE_FILE}`
    }
  }
} as const;
export const getMonorepoPackagePath = <N extends string = string>(
  packageName: N
) => `/${PACKAGES_DIR}/${packageName}` as const;

//#endregion
