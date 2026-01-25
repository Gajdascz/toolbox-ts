import type { NestedPartial } from '@toolbox-ts/types';
import type { CoverageV8Options, UserConfig } from 'vitest/node';

import path from 'node:path';
import {
  type configDefaults,
  defineConfig,
  type ViteUserConfig
} from 'vitest/config';

import {
  ALWAYS_IGNORE,
  CACHE_PATH,
  CONFIG_FILE_PATTERN,
  CONSTANTS_FILE_PATTERN,
  COVERAGE_PATH,
  dedupeArrays,
  DOT_FILE_PATTERN,
  GLOB_ALL_DATA_FILES,
  GLOB_ALL_TEST_FILES,
  INDEX_FILE,
  matchAllDirs,
  matchAllFiles,
  RC_FILE_PATTERN,
  TSCONFIG_TEST_FILE,
  TYPE_DEFS_FILE_PATTERN,
  TYPES_FILE_PATTERN
} from '../../../../../core/index.js';

export const VITEST_UI_PKG = '@vitest/ui';
export const TEST_UTILS_PKG = '@toolbox-ts/test-utils';
export const TEST_UTILS_SETUP_PATH = `${TEST_UTILS_PKG}/setup`;

export type Config = {
  coverage?: Partial<Omit<CoverageV8Options, 'reportsDirectory'>>;
} & Omit<
  NestedPartial<typeof configDefaults> & ViteUserConfig['test'],
  'cache' | 'coverage' | 'dir'
>;
export interface ProcessedConfig extends ViteUserConfig {
  cacheDir: string;
  test: { coverage: { provider: 'v8' } & UserConfig['coverage'] } & Omit<
    UserConfig,
    'coverage'
  >;
}

export const DEFAULTS = {
  testTimeout: 300_000,
  include: [GLOB_ALL_TEST_FILES],
  coverage: {
    clean: true,
    cleanOnRerun: true,
    enabled: true,
    ignoreEmptyLines: true,
    thresholds: { 100: true, perFile: true },
    reporter: ['text', 'html'],
    exclude: [
      GLOB_ALL_DATA_FILES,
      GLOB_ALL_TEST_FILES,
      ...ALWAYS_IGNORE,
      ...matchAllDirs(['types', 'constants', 'mock?(s)', 'data']),
      ...matchAllFiles([
        ...Object.values(INDEX_FILE),
        CONSTANTS_FILE_PATTERN,
        TYPES_FILE_PATTERN,
        TYPE_DEFS_FILE_PATTERN,
        DOT_FILE_PATTERN,
        CONFIG_FILE_PATTERN,
        RC_FILE_PATTERN
      ])
    ]
  }
};

export const DEFAULT_COVERAGE_EXCLUDES = [] as const;
export const define = ({
  root = process.cwd(),
  coverage = {},
  include = [],
  testTimeout = DEFAULTS.testTimeout,
  typecheck = {},
  ...restInput
}: Config = {}): ProcessedConfig => {
  const { exclude: defaultExclude, ...restCoverageDefaults } =
    DEFAULTS.coverage;
  const { exclude: inputExclude = [], ...restCoverageInput } = coverage;

  return defineConfig({
    cacheDir: path.posix.join(root, CACHE_PATH),
    test: {
      include: dedupeArrays(DEFAULTS.include, include),
      testTimeout,
      coverage: {
        reportsDirectory: path.posix.join(root, COVERAGE_PATH),
        provider: 'v8',
        exclude: dedupeArrays(defaultExclude, inputExclude),
        ...restCoverageDefaults,
        ...restCoverageInput
      },
      typecheck: {
        enabled: true,
        tsconfig: path.posix.join(root, TSCONFIG_TEST_FILE),
        ...typecheck
      },
      ...restInput
    }
  }) as ProcessedConfig;
};
// export const vitest = ({
//   includeTestUtils = false,
//   includeUI = true,
//   setupFiles = undefined
// }: {
//   includeUI?: boolean;
//   includeTestUtils?: boolean;
//   setupFiles?: string | string[];
// }) => {
//   const dependencies = [{ packageName: 'vitest', isDev: true }];
//   if (includeUI) dependencies.push({ packageName: VITEST_UI_PKG, isDev: true });
//   if (includeTestUtils) {
//     dependencies.push({ packageName: TEST_UTILS_PKG, isDev: true });
//     switch (typeof setupFiles) {
//       case 'string':
//         setupFiles = [TEST_UTILS_SETUP_PATH, setupFiles];
//         break;
//       case 'object':
//         setupFiles.push(TEST_UTILS_SETUP_PATH);
//         break;
//       default:
//         setupFiles = [TEST_UTILS_SETUP_PATH];
//     }
//   }
//   return createConfigModule({
//     fileType: 'runtime',
//     filename: 'vitest.config.ts',
//     importName: 'vitest',
//     importFrom: THIS_PACKAGE,
//     dependencies,
//     name: 'vitest',
//     description: 'Vite-native unit testing framework.',
//     url: 'https://vitest.dev/',

//     packagePatch: {
//       scripts: {
//         test: `pnpm vitest --config ${VITEST_CONFIG_FILE}`,
//         ...(includeUI && { 'test:ui': 'pnpm test --ui' })
//       }
//     }
//   });
// };
