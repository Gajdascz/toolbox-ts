import { describe, expect, it } from 'vitest';

import { define, getTemplateString } from './vitest.js';

describe('vitest', () => {
  describe('define', () => {
    it('should return config when called without arguments', () => {
      const result = define();

      expect(result).toBeDefined();
      expect(result.cacheDir).toBeDefined();
      expect(result.test).toBeDefined();
    });

    it('should use provided root for paths', () => {
      const result = define({ root: '/custom/path' });

      expect(result.cacheDir).toContain('/custom/path');
    });

    it('should merge custom include patterns', () => {
      const result = define({ include: ['custom/**/*.test.ts'] });

      expect(result.test?.include).toContain('custom/**/*.test.ts');
    });

    it('should set custom testTimeout', () => {
      const result = define({ testTimeout: 60_000 });

      expect(result.test?.testTimeout).toBe(60_000);
    });

    it('should configure coverage with defaults', () => {
      const result = define({});

      expect(result.test?.coverage).toBeDefined();
    });

    it('should merge custom coverage exclude patterns', () => {
      const result = define({ coverage: { exclude: ['custom-exclude/**'] } });

      expect(result.test?.coverage).toBeDefined();
    });

    it('should pass through additional coverage options', () => {
      const result = define({ coverage: { all: true } });

      expect(result.test?.coverage?.all).toBe(true);
    });

    it('should configure typecheck with defaults', () => {
      const result = define({});

      expect(result.test?.typecheck?.enabled).toBe(true);
    });

    it('should merge custom typecheck options', () => {
      const result = define({ typecheck: { only: true } });

      expect(result.test?.typecheck?.only).toBe(true);
    });

    it('should pass through additional test options', () => {
      const result = define({ globals: true });

      expect(result.test?.globals).toBe(true);
    });

    it('should handle all destructured coverage options', () => {
      const cov = {
        clean: false,
        cleanOnRerun: false,
        enabled: false,
        reporter: ['json'],
        ignoreEmptyLines: false,
        thresholds: { src: { 100: true } }
      };
      const result = define({ coverage: cov });
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
  });

  describe('getTemplateString', () => {
    it('should generate valid template string', () => {
      const template = getTemplateString({});

      expect(template).toContain('import { vitest }');
      expect(template).toContain('export default vitest.define(');
    });
  });
});
