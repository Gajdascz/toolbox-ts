import { describe, expect, it } from 'vitest';

import { coerceBoolean } from './boolean.ts';

describe('Coerce Boolean', () => {
  it('returns boolean as-is', () => {
    expect(coerceBoolean(true)).toBe(true);
    expect(coerceBoolean(false)).toBe(false);
  });
  describe('string input with defaults', () => {
    it('recognizes truthy strings', () => {
      expect(coerceBoolean('true')).toBe(true);
      expect(coerceBoolean('TRUE')).toBe(true);
      expect(coerceBoolean('True')).toBe(true);
    });

    it('recognizes falsy strings', () => {
      expect(coerceBoolean('false')).toBe(false);
      expect(coerceBoolean('FALSE')).toBe(false);
      expect(coerceBoolean('False')).toBe(false);
    });
  });
  describe('string input with custom options', () => {
    it('recognizes custom truthy strings', () => {
      expect(coerceBoolean('yes', { truthy: ['yes'] })).toBe(true);
      expect(coerceBoolean('on', { truthy: ['on'] })).toBe(true);
    });

    it('recognizes custom falsy strings', () => {
      expect(coerceBoolean('no', { falsy: ['no'] })).toBe(false);
      expect(coerceBoolean('off', { falsy: ['off'] })).toBe(false);
    });
  });
  describe('other input types', () => {
    it('uses standard JavaScript truthiness', () => {
      expect(coerceBoolean(1)).toBe(true);
      expect(coerceBoolean(0)).toBe(false);
      expect(coerceBoolean('hello')).toBe(true);
      expect(coerceBoolean('')).toBe(false);
      expect(coerceBoolean(null)).toBe(false);
      expect(coerceBoolean(undefined)).toBe(false);
      expect(coerceBoolean({})).toBe(true);
      expect(coerceBoolean([])).toBe(true);
    });
  });
});
