import { describe, expect, it, vi } from 'vitest';

import { define } from './tseslint.js';
// const tsconfigFilePath = findConfigFile(
//   projectRootDir,
//   sys.fileExists.bind(sys),
//   tsconfigFilename
// );
vi.mock('typescript', async (actual) => {
  const ts: any = await actual();
  return {
    ...ts,
    findConfigFile: (rootDir: string, _: any, filename: string) =>
      `${rootDir}/${filename}`
  };
});

describe('tseslint', () => {
  describe('define', () => {
    it('should return config array when called without arguments', () => {
      const result = define();

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should include build config', () => {
      const result = define({ build: {} });

      const buildConfig = result.find((c) => c.name === 'build');
      expect(buildConfig).toBeDefined();
    });

    it('should include dev config', () => {
      const result = define({ dev: {} });

      const devConfig = result.find((c) => c.name === 'dev');
      expect(devConfig).toBeDefined();
    });

    it('should include test config', () => {
      const result = define({ test: {} });

      const testConfig = result.find((c) => c.name === 'test');
      expect(testConfig).toBeDefined();
    });

    it('should pass options to build config', () => {
      const result = define({ build: { projectRootDir: '/custom/path' } });

      expect(result.length).toBeGreaterThan(0);
    });

    it('should pass options to dev config', () => {
      const result = define({ dev: { files: ['custom/**/*.ts'] } });

      expect(result.length).toBeGreaterThan(0);
    });

    it('should pass options to test config', () => {
      const result = define({ test: { rules: { 'no-console': 'error' } } });

      expect(result.length).toBeGreaterThan(0);
    });

    it('should include root config when provided', () => {
      const result = define({ root: { ignores: ['custom-ignore/**'] } });

      expect(result.length).toBeGreaterThan(0);
    });

    it('should include custom configs', () => {
      const customBase = {
        name: 'custom' as const,
        tsconfigFilename: 'tsconfig.custom.json',
        importResolverNodeExtensions: ['.js'],
        files: ['custom/**/*.ts']
      };

      const result = define({
        custom: [[customBase, { rules: { 'no-debugger': 'error' } }]]
      });

      const customConfig = result.find((c) => c.name === 'custom');
      expect(customConfig).toBeDefined();
    });

    it('should include multiple custom configs', () => {
      const custom1 = {
        name: 'custom1' as const,
        tsconfigFilename: 'tsconfig.json',
        importResolverNodeExtensions: ['.js'],
        files: ['src/**']
      };

      const custom2 = {
        name: 'custom2' as const,
        tsconfigFilename: 'tsconfig.json',
        importResolverNodeExtensions: ['.ts'],
        files: ['lib/**']
      };

      const result = define({
        custom: [
          [custom1, {}],
          [custom2, {}]
        ]
      });

      expect(result.find((c) => c.name === 'custom1')).toBeDefined();
      expect(result.find((c) => c.name === 'custom2')).toBeDefined();
    });

    it('should handle custom config without input options', () => {
      const customBase = {
        name: 'minimal' as const,
        tsconfigFilename: 'tsconfig.json',
        importResolverNodeExtensions: ['.js'],
        files: ['*.ts']
      };

      const result = define({ custom: [[customBase]] });

      expect(result.find((c) => c.name === 'minimal')).toBeDefined();
    });

    it('should handle all options together', () => {
      const customBase = {
        name: 'all-together' as const,
        tsconfigFilename: 'tsconfig.json',
        importResolverNodeExtensions: ['.js'],
        files: ['all/**']
      };

      const result = define({
        root: { ignores: ['node_modules/**'] },
        build: { projectRootDir: '/build' },
        dev: { files: ['dev/**'] },
        test: { rules: {} },
        custom: [[customBase, { rules: {} }]]
      });

      expect(result.length).toBeGreaterThan(4);
    });

    it('should maintain config order', () => {
      const result = define({});
      const totalConfigs = result.length;
      expect(result[totalConfigs - 4].name).toContain('root');
      expect(result[totalConfigs - 3].name).toBe('build');
      expect(result[totalConfigs - 2].name).toBe('dev');
      expect(result[totalConfigs - 1].name).toBe('test');
    });
  });
});
