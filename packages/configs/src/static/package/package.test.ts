import { describe, expect, it } from 'vitest';

import { DEFAULTS, define, resolveRepositoryUrl } from './package.ts';

const DEFAULT_VER = DEFAULTS.version;
describe('package', () => {
  describe('define', () => {
    it('should return defaults when called without arguments', () => {
      const result = define();

      expect(result.name).toBe('');
      expect(result.version).toBe(DEFAULT_VER);
      expect(result.type).toBe(DEFAULTS.type);
      expect(result.license).toBe(DEFAULTS.license);
    });

    it('should merge custom properties with defaults', () => {
      const result = define({ description: 'Test package' });

      expect(result.description).toBe('Test package');
      expect(result.version).toBe(DEFAULT_VER);
    });

    it('should format name as string', () => {
      const result = define({ name: 'my-package' });

      expect(result.name).toBe('my-package');
    });

    it('should format scoped name', () => {
      const result = define({ name: { scope: '@org', package: 'pkg' } });

      expect(result.name).toBe('@org/pkg');
    });

    it('should format name from package property only', () => {
      const result = define({ name: { package: 'pkg' } });

      expect(result.name).toBe('pkg');
    });

    it('should invalidate malformed names', () => {
      const result = define({ name: 'Invalid Name!' });

      expect(result.name).toBe('');
    });
    describe('validates version', () => {
      it('valid semver', () => {
        const result = define({ version: '1.2.3' });

        expect(result.version).toBe('1.2.3');
      });

      it('invalid semver', () => {
        const result = define({ version: 'invalid' });

        expect(result.version).toBe(DEFAULT_VER);
      });
      it('null version', () => {
        const result = define({ version: null });

        expect(result.version).toBe(DEFAULT_VER);
      });
    });

    it('should override defaults with input', () => {
      const result = define({
        private: true,
        license: 'Apache-2.0',
        keywords: ['test']
      });

      expect(result.private).toBe(true);
      expect(result.license).toBe('Apache-2.0');
      expect(result.keywords).toEqual(['test']);
    });
  });
  describe('formatName', () => {
    it('should format name from string', () => {
      expect(define({ name: 'simple-name' }).name).toBe('simple-name');
    });

    it('should format name from scoped object', () => {
      expect(
        define({ name: { scope: '@scope', package: 'package-name' } }).name
      ).toBe('@scope/package-name');
    });

    it('should format name from package-only object', () => {
      expect(define({ name: { package: 'package-only' } }).name).toBe(
        'package-only'
      );
    });

    it('should return empty string for invalid names', () => {
      expect(define({ name: 'Invalid Name!' }).name).toBe('');
    });
  });
  describe('resolveRepositoryUrl', () => {
    it('should return repository URL from string', () => {
      const url = resolveRepositoryUrl('link.com');
      expect(url).toBe('link.com');
    });
    it('should return repository URL from object', () => {
      const url = resolveRepositoryUrl({ type: 'git', url: 'gitlink.com' });
      expect(url).toBe('gitlink.com');
    });
    it('should return empty string for missing repository', () => {
      const url = resolveRepositoryUrl(undefined);
      expect(url).toBe('');
    });
  });
});
