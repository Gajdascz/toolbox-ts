import { describe, expect, it } from 'vitest';

import * as unitInterval from './unit-interval.ts';

describe('unitInterval', () => {
  describe('is', () => {
    it('returns true for numbers in [0, 1]', () => {
      expect(unitInterval.is(0)).toBe(true);
      expect(unitInterval.is(0.5)).toBe(true);
      expect(unitInterval.is(1)).toBe(true);
    });
    it('returns false for numbers outside [0, 1]', () => {
      expect(unitInterval.is(-0.1)).toBe(false);
      expect(unitInterval.is(1.1)).toBe(false);
      expect(unitInterval.is(Number.NaN)).toBe(false);
      expect(unitInterval.is(Infinity)).toBe(false);
      expect(unitInterval.is(-Infinity)).toBe(false);
    });
    it('returns false for non-numbers', () => {
      expect(unitInterval.is('0.5')).toBe(false);
      expect(unitInterval.is(null)).toBe(false);
      expect(unitInterval.is(undefined)).toBe(false);
      expect(unitInterval.is({})).toBe(false);
    });
  });

  describe('parse', () => {
    it('returns the value if in [0, 1]', () => {
      expect(unitInterval.parse(0)).toBe(0);
      expect(unitInterval.parse(0.5)).toBe(0.5);
      expect(unitInterval.parse(1)).toBe(1);
      expect(unitInterval.parse('0.5')).toBe(0.5);
    });
    it('returns 0 if value < 0', () => {
      expect(unitInterval.parse(-0.1)).toBe(0);
      expect(unitInterval.parse('-1')).toBe(0);
    });
    it('returns 1 if value > 1', () => {
      expect(unitInterval.parse(1.1)).toBe(1);
      expect(unitInterval.parse('2')).toBe(1);
    });
    it('returns 0 for NaN', () => {
      expect(unitInterval.parse(Number.NaN)).toBe(0);
      expect(unitInterval.parse('not-a-number' as any)).toBe(0);
    });
  });

  describe('clamp', () => {
    it('clamps values below 0 to 0', () => {
      expect(unitInterval.clamp(-1)).toBe(0);
    });
    it('clamps values above 1 to 1', () => {
      expect(unitInterval.clamp(2)).toBe(1);
    });
    it('returns value if in [0, 1]', () => {
      expect(unitInterval.clamp(0.5)).toBe(0.5);
    });
  });

  describe('scale', () => {
    it('scales 0 to min', () => {
      expect(unitInterval.scale({ value: 0, min: 10, max: 20 })).toBe(10);
    });
    it('scales 1 to max', () => {
      expect(unitInterval.scale({ value: 1, min: 10, max: 20 })).toBe(20);
    });
    it('scales 0.5 to midpoint', () => {
      expect(unitInterval.scale({ value: 0.5, min: 10, max: 20 })).toBe(15);
    });
    it('clamps scaled values', () => {
      expect(unitInterval.scale({ value: -1, min: 10, max: 20 })).toBe(10);
      expect(unitInterval.scale({ value: 2, min: 10, max: 20 })).toBe(20);
    });
  });

  describe('normalize', () => {
    it('normalizes min to 0', () => {
      expect(unitInterval.normalize({ value: 10, min: 10, max: 20 })).toBe(0);
    });
    it('normalizes max to 1', () => {
      expect(unitInterval.normalize({ value: 20, min: 10, max: 20 })).toBe(1);
    });
    it('normalizes midpoint to 0.5', () => {
      expect(unitInterval.normalize({ value: 15, min: 10, max: 20 })).toBe(0.5);
    });
    it('returns 0 for equal min and max', () => {
      expect(unitInterval.normalize({ value: 10, min: 10, max: 10 })).toBe(0);
    });
    it('clamps normalized values', () => {
      expect(unitInterval.normalize({ value: 5, min: 10, max: 20 })).toBe(0);
      expect(unitInterval.normalize({ value: 25, min: 10, max: 20 })).toBe(1);
    });
  });
});
