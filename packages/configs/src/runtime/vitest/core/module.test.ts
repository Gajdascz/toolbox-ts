import { describe, expect, it } from 'vitest';

import { define, toFileEntry } from './module.ts';

describe('configs/runtime/vitest', () => {
  describe('define', () => {
    it('returns config when called without arguments', () => {
      const result = define('/');

      expect(result).toBeDefined();
      expect(result.cacheDir).toBeDefined();
      expect(result.test).toBeDefined();
    });
    it('uses provided root for paths', () => {
      const result = define('/custom/path');

      expect(result.cacheDir).toContain('/custom/path');
    });
    it('merges custom include patterns', () => {
      const result = define('', { include: ['custom/**/*.test.js'] });

      expect(result.test?.include).toContain('custom/**/*.test.js');
    });
    it('sets custom testTimeout', () => {
      const result = define('', { testTimeout: 60_000 });

      expect(result.test?.testTimeout).toBe(60_000);
    });
    it('configures coverage with defaults', () => {
      const result = define('', {});

      expect(result.test?.coverage).toBeDefined();
    });
    it('merges custom coverage exclude patterns', () => {
      const result = define('', { coverage: { exclude: ['custom-exclude/**'] } });

      expect(result.test?.coverage).toBeDefined();
    });
    it('passes through additional coverage options', () => {
      const result = define('', { coverage: { all: true } });

      expect(result.test?.coverage?.all).toBe(true);
    });
    it('configures typecheck with defaults', () => {
      const result = define('', {});

      expect(result.test?.typecheck?.enabled).toBe(true);
    });
    it('merges custom typecheck options', () => {
      const result = define('', { typecheck: { only: true } });
      expect(result.test?.typecheck?.only).toBe(true);
    });
    it('passes through additional test options', () => {
      const result = define('', { globals: true });
      expect(result.test?.globals).toBe(true);
    });
    it('handles all destructured coverage options', () => {
      const cov = {
        clean: false,
        cleanOnRerun: false,
        enabled: false,
        reporter: ['json'],
        ignoreEmptyLines: false,
        thresholds: { src: { 100: true } }
      };
      const result = define('', { coverage: cov });
      const {
        provider,
        clean,
        cleanOnRerun,
        enabled,
        reporter,
        ignoreEmptyLines,
        thresholds,
        exclude,
        reportsDirectory
      } = result.test?.coverage || {};
      expect(provider).toBe('v8');
      expect(clean).toBe(cov.clean);
      expect(cleanOnRerun).toBe(cov.cleanOnRerun);
      expect(enabled).toBe(cov.enabled);
      expect(reporter).toEqual(cov.reporter);
      expect(ignoreEmptyLines).toBe(cov.ignoreEmptyLines);
      expect(thresholds).toEqual(cov.thresholds);
      expect(exclude).toBeDefined();
      expect(reportsDirectory).toBeDefined();
    });
    it('omits default excludes when omitDefaultExcludes is set', () => {
      const result = define('', { omitDefaultExcludes: { test: true, coverage: true } });
      expect(result.test?.exclude).toEqual([]);
      expect(result.test?.coverage?.exclude).toEqual([]);
    });
  });
  it('toFileEntry should produce correct file entry', () => {
    const content = toFileEntry({
      hookTimeout: 20_000,
      alias: { '@': './src' },
      api: true,
      allowOnly: true,
      coverage: { all: true, reporter: ['json'] },
      disableConsoleIntercept: true,
      logHeapUsage: true,
      maxConcurrency: 4
    });
    expect(content).toMatchSnapshot();
  });
});
