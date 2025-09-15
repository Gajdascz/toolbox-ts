import path from 'node:path';
import {
  type configDefaults,
  coverageConfigDefaults,
  defineConfig,
  mergeConfig,
  type ViteUserConfig
} from 'vitest/config';

export interface TestConfig
  extends Omit<
    NestedPartial<typeof configDefaults> & ViteUserConfig['test'],
    'cache'
  > {
  cacheDir?: string;
  tsconfigFilename?: string;
}

type NestedPartial<T> = {
  [K in keyof T]?: T[K] extends object ? NestedPartial<T[K]> : T[K];
};

export const DEFAULTS: { cacheDir: string; test: ViteUserConfig['test'] } = {
  cacheDir: 'node_modules/.cache',

  test: {
    coverage: {
      ...coverageConfigDefaults,
      clean: true,
      cleanOnRerun: true,
      enabled: true,
      exclude: [
        '**/.*',
        '**/index.{ts,js,tsx,jsx}',
        '**/{node_modules,dist,build,docs,examples,templates}/**',
        '**/*.{md,json,yml,yaml,lock,tsbuildinfo}',
        '**/*.d.ts',
        '**/types.ts',
        '**/types/**',
        '**/constants.ts',
        '**/constants/**',
        '**/bin/**',
        '*.config.*',
        '**/mock?(s)/**',
        '**/*.{test,spec,bench}.{ts,tsx,js,jsx}'
      ],
      ignoreEmptyLines: true,
      provider: 'v8',
      reporter: ['text', 'html'],
      reportsDirectory: 'coverage',
      thresholds: { 100: true, perFile: true }
    },
    include: ['**/*.{test,spec,bench}.{ts,tsx,js,jsx}'],
    testTimeout: 300_000,
    typecheck: { enabled: true, tsconfig: 'tsconfig.json' }
  }
};

export const define = ({
  cacheDir = path.resolve(process.cwd(), DEFAULTS.cacheDir),
  dir = process.cwd(),
  tsconfigFilename = 'tsconfig.json',
  ...rest
}: TestConfig = {}) =>
  defineConfig(
    mergeConfig<
      { cacheDir?: string } & { test: NonNullable<ViteUserConfig['test']> },
      { test: NonNullable<TestConfig> }
    >(
      { cacheDir, test: { ...DEFAULTS.test } },
      {
        test: {
          ...rest,
          typecheck: {
            enabled: true,
            tsconfig: path.join(dir, tsconfigFilename),
            ...rest.typecheck
          }
        }
      }
    )
  );
