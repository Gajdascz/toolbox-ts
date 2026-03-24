import { describe, expect, it } from 'vitest';

import { DEFAULTS, define, toFileEntry } from './module.js';

const DEFAULT_VER = DEFAULTS.version;
describe('configs/static/packageJson', () => {
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
        const result = define({ version: null } as any);
        expect(result.version).toBe(DEFAULT_VER);
      });
    });

    it('should override defaults with input', () => {
      const result = define({ private: true, license: 'Apache-2.0', keywords: ['test'] });

      expect(result.private).toBe(true);
      expect(result.license).toBe('Apache-2.0');
      expect(result.keywords).toEqual(['test']);
    });
  });
  it('toFileEntry should produce correct file entry', () => {
    const content = toFileEntry({
      name: 'my-package',
      version: '1.2.3',
      description: 'Test package',
      private: true,
      license: 'Apache-2.0',
      keywords: ['test']
    });
    expect(content).toMatchSnapshot();
  });
});
