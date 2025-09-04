import { describe, expect, it, vi } from 'vitest';

import { flagMeta, kebabToFlagEntry, toFlag } from './flags.ts';

describe('cli-kit: Flag Utils', () => {
  describe('kebabKeyToFlagEntry', () => {
    it('maps kebab keys to camel keys and flag values', () => {
      const keys = ['foo-bar', 'baz-qux'] as const;
      const map = keys.map(kebabToFlagEntry);
      expect(map).toEqual([
        ['fooBar', '--foo-bar'],
        ['bazQux', '--baz-qux']
      ]);
    });
  });
  describe('toFlag', () => {
    it('converts string to flag', () => {
      const res = toFlag('foo-bar');
      expect(res).toEqual('--foo-bar');
      const res2 = toFlag('bazQux');
      expect(res2).toEqual('--baz-qux');
    });
    it('throws on invalid input', () => {
      expect(() => toFlag(123 as any)).toThrow();
    });
  });
  describe('flagMeta', () => {
    it('capitalizes the first letter of the description', () => {
      const desc = 'some description';
      const result = flagMeta('flag', desc);
      expect(result.description.charAt(0)).toBe('S');
    });
    it('adds period to description if no punctuation', () => {
      const desc = 'some description';
      const result = flagMeta('flag', desc);
      expect(result.description.endsWith('.')).toBe(true);
      const desc2 = 'some description!';
      const result2 = flagMeta('flag', desc2);
      expect(result2.description.endsWith('!')).toBe(true);
      const desc3 = 'some description?';
      const result3 = flagMeta('flag', desc3);
      expect(result3.description.endsWith('?')).toBe(true);
      const desc4 = 'some description.';
      const result4 = flagMeta('flag', desc4);
      expect(result4.description.endsWith('.')).toBe(true);
    });
    it('converts camelCase name to kebab-case alias', () => {
      const result = flagMeta('someFlagName', 'desc');
      result.aliases.includes('some-flag-name');
      expect(result.name).toBe('someFlagName');
    });
    it('adds comma separated note when acceptsCommaSeparated is true', () => {
      const result = flagMeta('flag', 'desc', { acceptsCommaSeparated: true });
      expect(result.description).toMatch(/comma-separated/);
    });
  });
});
