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
  COVERAGE_PATH,
  createRuntimeConfigModule,
  dedupeArrays,
  FILE_PATTERNS,
  GLOBS,
  matchAllDirs,
  matchAllFiles,
  THIS_PACKAGE,
  TsConfigs
} from '../../core/index.js';

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
  include: [GLOBS.allTestFiles],
  coverage: {
    clean: true,
    cleanOnRerun: true,
    enabled: true,
    ignoreEmptyLines: true,
    thresholds: { 100: true, perFile: true },
    reporter: ['text', 'html'],
    exclude: [
      GLOBS.allDataFiles,
      GLOBS.allTestFiles,
      ...ALWAYS_IGNORE,
      ...matchAllDirs(['types', 'constants', 'mock?(s)']),
      ...matchAllFiles([
        FILE_PATTERNS.index,
        FILE_PATTERNS.constants,
        FILE_PATTERNS.types,
        FILE_PATTERNS.typeDefs,
        FILE_PATTERNS.dot,
        FILE_PATTERNS.config,
        FILE_PATTERNS.rc
      ])
    ]
  }
};

export const DEFAULT_COVERAGE_EXCLUDES = [] as const;
export const { define, getTemplateString, meta } = createRuntimeConfigModule({
  filename: 'vitest.config.ts',
  importName: 'vitest',
  importFrom: THIS_PACKAGE,
  dependencies: ['vitest'],
  define: ({
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
          tsconfig: path.posix.join(root, TsConfigs.Test.META.filename),
          ...typecheck
        },
        ...restInput
      }
    }) as ProcessedConfig;
  }
});
