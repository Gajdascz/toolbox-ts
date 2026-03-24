import { Arr } from '@toolbox-ts/utils';
import path from 'node:path';
import { defineConfig } from 'vitest/config';
import { FILES, GLOBS, PATHS } from '@toolbox-ts/constants/fs';
import type { InputConfig, ProcessedConfig, Defaults } from './types.ts';
import { serializeJson, runtimeConfigToFileContent } from '../../../helpers.js';

const EXCLUDE = [...GLOBS.ALL.COMMON_IGNORE, ...GLOBS.ALL.STATIC, GLOBS.DIR.FIXTURES.DEEP];

export const DEFAULTS: Defaults = {
  testTimeout: 300_000,
  include: GLOBS.ALL.TESTS as unknown as string[],
  exclude: EXCLUDE,
  coverage: {
    clean: true,
    cleanOnRerun: true,
    enabled: true,
    ignoreEmptyLines: true,
    thresholds: { 100: true, perFile: true },
    reporter: ['text', 'html'],
    exclude: [...EXCLUDE, ...GLOBS.FILES.TESTS.DEEP]
  }
};
const resolveExclude = (defaults: string[], input: string[] = [], omit?: boolean) =>
  omit ? input : Arr.mergeUnique(defaults, input);

export const define = (
  root: string,
  {
    coverage = {},
    include = [],
    exclude = [],
    testTimeout = DEFAULTS.testTimeout,
    typecheck = {},
    omitDefaultExcludes = {},
    dir = root,
    ...restInput
  }: InputConfig = {}
): ProcessedConfig => {
  const { exclude: defaultCoverageExclude, ...restCoverageDefaults } = DEFAULTS.coverage;
  const { exclude: inputCoverageExclude = [], ...restCoverageInput } = coverage;
  const { exclude: defaultTestExclude } = DEFAULTS;

  return defineConfig({
    cacheDir: path.posix.join(root, PATHS.ARTIFACTS.CACHE.ROOT),
    test: {
      root,
      dir,
      include: Arr.mergeUnique(DEFAULTS.include, include),
      exclude: resolveExclude(defaultTestExclude, exclude, omitDefaultExcludes?.test),
      testTimeout,
      coverage: {
        reportsDirectory: path.posix.join(root, PATHS.ARTIFACTS.REPORTS.COVERAGE),
        provider: 'v8',
        exclude: resolveExclude(
          defaultCoverageExclude,
          inputCoverageExclude,
          omitDefaultExcludes?.coverage
        ),
        ...restCoverageDefaults,
        ...restCoverageInput
      },
      typecheck: { enabled: true, ...typecheck },
      ...restInput
    }
  }) as ProcessedConfig;
};

export const toFileContent = (config?: InputConfig, root = 'import.meta.dirname') =>
  runtimeConfigToFileContent('vitest', [root, serializeJson(config)]);

export const toFileEntry = (config?: InputConfig, root = 'import.meta.dirname') => ({
  [FILES.CONFIG.VITEST]: toFileContent(config, root)
});
