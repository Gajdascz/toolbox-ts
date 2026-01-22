import { describe, expect, it } from 'vitest';

import { coerceNumber } from './number.ts';

describe('Coerce Number', () => {
  describe('basic coercion', () => {
    it('converts string to number using default', () => {
      expect(coerceNumber('123.45')).toBe(123.45);
    });

    it('returns number as-is', () => {
      expect(coerceNumber(42)).toBe(42);
    });

    it('converts boolean to number by default', () => {
      expect(coerceNumber(true)).toBe(1);
      expect(coerceNumber(false)).toBe(0);
    });

    it('converts other types using Number constructor', () => {
      expect(coerceNumber(BigInt(42))).toBe(42);
    });
  });

  describe('string coercion methods', () => {
    it('uses parseFloat when specified', () => {
      expect(coerceNumber('123.45abc', { stringCoercion: 'parseFloat' })).toBe(
        123.45
      );
    });

    it('uses parseInt when specified', () => {
      expect(coerceNumber('123.45', { stringCoercion: 'parseInt' })).toBe(123);
    });

    it('uses custom radix with parseInt', () => {
      expect(
        coerceNumber('FF', { stringCoercion: 'parseInt', radix: 16 })
      ).toBe(255);
    });
  });

  describe('null/undefined handling', () => {
    it('returns fallback for null by default', () => {
      expect(coerceNumber(null)).toBe(0);
    });

    it('returns fallback for undefined by default', () => {
      expect(coerceNumber(undefined)).toBe(0);
    });

    it('uses custom fallback for null', () => {
      expect(coerceNumber(null, { fallback: 10 })).toBe(10);
    });

    it('does not use fallback for null when disabled', () => {
      expect(coerceNumber(null, { fallbackOnNull: false })).toBe(0);
    });

    it('does not use fallback for undefined when disabled', () => {
      expect(coerceNumber(undefined, { fallbackOnUndefined: false })).toBe(0);
    });
  });

  describe('boolean fallback handling', () => {
    it('returns fallback for all booleans when true', () => {
      expect(
        coerceNumber(true, { fallbackOnBoolean: true, fallback: 10 })
      ).toBe(10);
      expect(
        coerceNumber(false, { fallbackOnBoolean: true, fallback: 10 })
      ).toBe(10);
    });

    it('returns fallback only for true when specified', () => {
      expect(
        coerceNumber(true, { fallbackOnBoolean: 'true', fallback: 10 })
      ).toBe(10);
      expect(
        coerceNumber(false, { fallbackOnBoolean: 'true', fallback: 10 })
      ).toBe(0);
    });

    it('returns fallback only for false when specified', () => {
      expect(
        coerceNumber(true, { fallbackOnBoolean: 'false', fallback: 10 })
      ).toBe(1);
      expect(
        coerceNumber(false, { fallbackOnBoolean: 'false', fallback: 10 })
      ).toBe(10);
    });
  });

  describe('NaN handling', () => {
    it('returns fallback for NaN by default', () => {
      expect(coerceNumber(Number.NaN)).toBe(0);
      expect(coerceNumber('invalid')).toBe(0);
    });

    it('returns NaN when fallbackOnNaN is false', () => {
      expect(coerceNumber(Number.NaN, { fallbackOnNaN: false })).toBeNaN();
    });

    it('uses custom fallback for NaN', () => {
      expect(coerceNumber('abc', { fallback: 10 })).toBe(10);
    });
  });

  describe('infinity handling', () => {
    it('returns fallback for infinity by default', () => {
      expect(coerceNumber(Infinity)).toBe(0);
      expect(coerceNumber(-Infinity)).toBe(0);
    });

    it('allows all infinities when true', () => {
      expect(coerceNumber(Infinity, { allowInfinity: true })).toBe(Infinity);
      expect(coerceNumber(-Infinity, { allowInfinity: true })).toBe(-Infinity);
    });

    it('allows only positive infinity when specified', () => {
      expect(coerceNumber(Infinity, { allowInfinity: 'positive' })).toBe(
        Infinity
      );
      expect(
        coerceNumber(-Infinity, { allowInfinity: 'positive', fallback: 10 })
      ).toBe(10);
    });

    it('allows only negative infinity when specified', () => {
      expect(coerceNumber(-Infinity, { allowInfinity: 'negative' })).toBe(
        -Infinity
      );
      expect(
        coerceNumber(Infinity, { allowInfinity: 'negative', fallback: 10 })
      ).toBe(10);
    });
  });
});
