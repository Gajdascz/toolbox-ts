import { DATA_FILE_EXTS, SRC_FILE_EXTS, TEST_FILE_SUFFIXES } from './exts.js';
import {
  ANY_ROOT_SRC_DIR,
  ARTIFACTS_DIR,
  DEV_DIR,
  DOCS_DIR,
  NODE_MODULES_DIR,
  OUT_DIR,
  PACKAGES_DIR,
  SRC_DIR
} from './fs-names.js';

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

export const globAnyFileWithExts = (
  exts: readonly string[] | string[]
): `**/*.{${string}}` => `**/*.{${exts.join(',')}}`;
export const globAllFilesWithExts = (
  files: readonly string[] | string[],
  exts: readonly string[] | string[]
): `**/{${string}}.{${string}}` =>
  `**/{${files.join(',')}}.{${exts.join(',')}}`;
export const globAnyFileWithExtsInDirs = (
  dirs: readonly string[] | string[],
  exts: readonly string[] | string[]
): `{${string}}/**/*.{${string}}` =>
  `{${dirs.join(',')}}/**/*.{${exts.join(',')}}`;
export const globAnyFileWithSuffixes = (
  suffixes: readonly string[] | string[]
): `**/*.{${string}}.*` => `**/*.{${suffixes.join(',')}}.*`;
export const globAnyFileWithSuffixesAndExts = (
  suffixes: readonly string[] | string[],
  exts: readonly string[] | string[]
): `**/*.{${string}}.{${string}}` =>
  `**/*.{${suffixes.join(',')}}.{${exts.join(',')}}`;

export const DOT_FILE_PATTERN = '.*' as const;
export const CONFIG_FILE_PATTERN = `*.config.*` as const;
export const RC_FILE_PATTERN = '*rc.*' as const;
export const TYPE_DEFS_FILE_PATTERN = `*.d.ts` as const;
export const TYPES_FILE_PATTERN = `types.*` as const;
export const CONSTANTS_FILE_PATTERN = `constants.*` as const;
export const INDEX_FILE_PATTERN = `index.*` as const;
export const TSCONFIG_FILE_PATTERN = `tsconfig.*` as const;
export const TSCONFIG_SUFFIXED_FILE_PATTERN = `tsconfig.*.json` as const;

export const NPM_PACKAGE_NAME =
  /^(?=.{1,214}$)(?:@([a-z0-9._-]*)\/[._a-z0-9][a-z0-9._-]*|[a-z0-9][a-z0-9._-]*)$/;

export const ALWAYS_IGNORE = matchAllDirs([
  NODE_MODULES_DIR,
  ARTIFACTS_DIR,
  DOCS_DIR,
  OUT_DIR
]);

export const withAlwaysIgnore = (patterns: readonly string[]) => [
  ...new Set(...[...ALWAYS_IGNORE, ...patterns])
];

export const ALL_TEST_FILES = matchAllSuffixed(TEST_FILE_SUFFIXES);

export const GLOB_ALL_SRC_FILES = globAnyFileWithExtsInDirs(
  ANY_ROOT_SRC_DIR,
  SRC_FILE_EXTS
);
export const GLOB_ALL_DATA_FILES = globAnyFileWithExts(DATA_FILE_EXTS);
export const GLOB_ALL_TEST_FILES = globAnyFileWithSuffixesAndExts(
  TEST_FILE_SUFFIXES,
  SRC_FILE_EXTS
);
export const GLOB_ALL_DEV_FILES = globAnyFileWithExtsInDirs(
  [DEV_DIR],
  SRC_FILE_EXTS
);
export const GLOB_ALL_MONOREPO_SRC_DIRS =
  `${PACKAGES_DIR}/**/${SRC_DIR}` as const;
export const CHANGESET_MARKER = 'Version Packages';
