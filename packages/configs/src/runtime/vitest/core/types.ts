import type { CoverageV8Options, UserConfig } from 'vitest/dist/node.js';
import type { ViteUserConfig, configDefaults } from 'vitest/config.js';
import type { DeepPartial } from '@toolbox-ts/types/defs/object';

export type InputConfig = {
  coverage?: Partial<Omit<CoverageV8Options, 'reportsDirectory'>>;
  omitDefaultExcludes?: { coverage?: boolean; test?: boolean };
} & Omit<
  DeepPartial<typeof configDefaults> & ViteUserConfig['test'],
  'cache' | 'coverage' | 'root'
>;

export interface Defaults extends InputConfig {
  testTimeout: number;
  include: string[];
  exclude: string[];
  coverage: {
    clean: boolean;
    cleanOnRerun: boolean;
    enabled: boolean;
    ignoreEmptyLines: boolean;
    thresholds: Record<string, boolean | number>;
    reporter: string[];
    exclude: string[];
  };
}
export interface ProcessedConfig extends ViteUserConfig {
  cacheDir: string;
  test: { coverage: { provider: 'v8' } & UserConfig['coverage'] } & Omit<UserConfig, 'coverage'>;
}
