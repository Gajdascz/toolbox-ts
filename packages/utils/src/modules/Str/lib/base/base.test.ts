import { describe, expect, it } from 'vitest';

import { capitalize, prefix, suffix, uncapitalize } from './base.ts';

describe('base', () => {
  describe('capitalize / uncapitalize', () => {
    it('capitalizes first letter', () => {
      expect(capitalize('hello')).toBe('Hello');
      expect(capitalize('h')).toBe('H');
    });
    it('uncapitalizes first letter', () => {
      expect(uncapitalize('Hello')).toBe('hello');
      expect(uncapitalize('H')).toBe('h');
    });
  });
  describe('prefix / suffix', () => {
    it('prefixes string', () => {
      expect(prefix('--', 'flag')).toBe('--flag');
    });
    it('suffixes string', () => {
      expect(suffix('file', '.ts')).toBe('file.ts');
    });
  });
});
