import type { CompilerOptions, TsConfigMeta } from '@toolbox-ts/types/tsconfig';

import {
  ALWAYS_IGNORE,
  matchAllSuffixed,
  REPO_DOMAINS,
  TEST_FILE_SUFFIXES
} from '../base.js';

export const ALL_TEST_FILES = matchAllSuffixed(TEST_FILE_SUFFIXES);

export const DEPENDENCIES = ['typescript', '@types/node'] as const;

export const SCHEMA = 'https://json.schemastore.org/tsconfig';
export const TSCONFIG = 'tsconfig.json';
export const DOMAINS = ['base', 'reference', ...REPO_DOMAINS] as const;
export type TsConfigDomain<I extends number = number> = (typeof DOMAINS)[I];

export const TS_BUILD_INFO_EXT = 'tsbuildinfo';
export type TsBuildInfoExt = typeof TS_BUILD_INFO_EXT;
export type TsBuildInfoFile<N extends string = 'tsconfig'> =
  `${N}.${TsBuildInfoExt}`;

export const FILENAMES = {
  [DOMAINS[0]]: `tsconfig.${DOMAINS[0]}.json`,
  [DOMAINS[1]]: TSCONFIG,
  [DOMAINS[2]]: `tsconfig.${DOMAINS[2]}.json`,
  [DOMAINS[3]]: `tsconfig.${DOMAINS[3]}.json`,
  [DOMAINS[4]]: `tsconfig.${DOMAINS[4]}.json`
} as const;

export const BASE_META: TsConfigMeta<TsConfigDomain<0>> = {
  $schema: SCHEMA,
  filename: `tsconfig.${DOMAINS[0]}.json`,
  name: DOMAINS[0],
  description:
    'Base TypeScript configuration shared across all other configurations.'
} as const;
export type BaseMeta = typeof BASE_META;

export const REFERENCE_META: TsConfigMeta<TsConfigDomain<1>> = {
  $schema: SCHEMA,
  filename: TSCONFIG,
  name: DOMAINS[1],
  description:
    'Provides full VSCode IDE typing and intellisense support. This is required to correctly match configurations to their targeted files.'
} as const;
export type ReferenceMeta = typeof REFERENCE_META;

export const BUILD_META: TsConfigMeta<TsConfigDomain<2>> = {
  $schema: SCHEMA,
  filename: `tsconfig.${DOMAINS[2]}.json`,
  name: DOMAINS[2],
  description: 'Strict configuration for building production code.'
} as const;
export type BuildMeta = typeof BUILD_META;

export const DEV_META: TsConfigMeta<TsConfigDomain<3>> = {
  $schema: SCHEMA,
  filename: `tsconfig.${DOMAINS[3]}.json`,
  name: DOMAINS[3],
  description: 'Development configuration for tooling, mocks, and config files.'
} as const;
export type DevMeta = typeof DEV_META;

export const TEST_META: TsConfigMeta<TsConfigDomain<4>> = {
  $schema: SCHEMA,
  filename: `tsconfig.${DOMAINS[4]}.json`,
  name: DOMAINS[4],
  description: 'TypeScript configuration for test files with relaxed rules.'
} as const;
export type TestMeta = typeof TEST_META;

export const ROOT_TO_BASE_TSCONFIG_PATH = `./${BASE_META.filename}` as const;
export type RootToBaseTsConfigPath = typeof ROOT_TO_BASE_TSCONFIG_PATH;

export const SHARED_SRC_EXCLUDE = [
  ...ALWAYS_IGNORE,
  ...ALL_TEST_FILES
] as const;

export const SHARED_DEFAULT_BUILD_COMPILER_OPTIONS: CompilerOptions = {
  declaration: true,
  declarationMap: true,
  sourceMap: true,
  rewriteRelativeImportExtensions: true,
  removeComments: true,
  esModuleInterop: true
} as const;
