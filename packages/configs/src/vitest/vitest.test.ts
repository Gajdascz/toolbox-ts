import path from 'node:path';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { defineConfig, mergeConfig } from 'vitest/config';

import { DEFAULTS, define as vitestConfig } from './vitest.js';

vi.mock('vitest/config', () => ({
  configDefaults: {},
  coverageConfigDefaults: {},
  defineConfig: vi.fn(),
  mergeConfig: vi.fn()
}));

vi.mock('node:path', () => ({ default: { join: vi.fn(), resolve: vi.fn() } }));

describe('vitest config', () => {
  const mockDefineConfig = vi.mocked(defineConfig);
  const mockMergeConfig = vi.mocked(mergeConfig);
  const mockPathResolve = vi.mocked(path.resolve);
  const mockPathJoin = vi.mocked(path.join);

  beforeEach(() => {
    vi.clearAllMocks();
    mockDefineConfig.mockReturnValue({} as any);
    mockMergeConfig.mockReturnValue({} as any);
    mockPathResolve.mockReturnValue('/resolved/cache/dir');
    mockPathJoin.mockReturnValue('/joined/tsconfig/path');
  });

  it('should call defineConfig with default parameters', () => {
    const result = vitestConfig();

    expect(mockDefineConfig).toHaveBeenCalledTimes(1);
    expect(mockMergeConfig).toHaveBeenCalledTimes(1);
    expect(result).toEqual({});
  });

  it('should use custom directory parameter', () => {
    const customDirectory = '/custom/dir';

    vitestConfig({ dir: customDirectory });

    expect(mockPathJoin).toHaveBeenCalledWith(customDirectory, 'tsconfig.json');
  });

  it('should use custom tsconfig filename parameter', () => {
    const customTsconfig = 'tsconfig.build.json';

    vitestConfig({ tsconfigFilename: customTsconfig });

    expect(mockPathJoin).toHaveBeenCalledWith(
      expect.any(String),
      customTsconfig
    );
  });

  it('should use both custom directory and tsconfig filename', () => {
    const customDirectory = '/custom/dir';
    const customTsconfig = 'tsconfig.test.json';

    vitestConfig({ dir: customDirectory, tsconfigFilename: customTsconfig });

    expect(mockPathJoin).toHaveBeenCalledWith(customDirectory, customTsconfig);
  });

  it('should use custom cache directory from config', () => {
    const customCacheDir = '/custom/cache';

    vitestConfig({ cacheDir: customCacheDir });

    expect(mockPathResolve).not.toHaveBeenCalled();
  });

  it('should use default cache directory when not provided', () => {
    vitestConfig();

    expect(mockPathResolve).toHaveBeenCalledWith(
      process.cwd(),
      DEFAULTS.cacheDir
    );
  });

  it('should merge custom test config options', () => {
    const customConfig = {
      environment: 'jsdom' as const,
      globals: true,
      testTimeout: 5000
    };

    vitestConfig(customConfig as any);

    expect(mockMergeConfig).toHaveBeenCalledWith(
      expect.objectContaining({
        cacheDir: '/resolved/cache/dir',
        test: DEFAULTS.test
      }),
      expect.objectContaining({
        test: expect.objectContaining({
          environment: 'jsdom',
          globals: true,
          testTimeout: 5000
        })
      })
    );
  });

  it('should merge custom typecheck config with defaults', () => {
    const customConfig = {
      dir: '/test/dir',
      tsconfigFilename: 'custom.json',
      typecheck: { allowJs: true, ignoreSourceErrors: true }
    };

    vitestConfig(customConfig);

    expect(mockMergeConfig).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        test: expect.objectContaining({
          typecheck: expect.objectContaining({
            allowJs: true,
            enabled: true,
            ignoreSourceErrors: true,
            tsconfig: '/joined/tsconfig/path'
          })
        })
      })
    );
  });

  it('should handle empty config object', () => {
    vitestConfig({});

    expect(mockDefineConfig).toHaveBeenCalledTimes(1);
    expect(mockMergeConfig).toHaveBeenCalledTimes(1);
  });
});
