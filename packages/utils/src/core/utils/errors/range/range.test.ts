import { describe, expect, it } from 'vitest';

import { createNumRangeError } from './range.js';

describe('createNumRangeError', () => {
  // Mock guard object
  const inclusive = {
    typeName: 'TestRange',
    min: 0,
    max: 100,
    inclusive: true
  };
  const exclusive = {
    typeName: 'TestRange',
    min: 0,
    max: 100,
    inclusive: false
  };

  describe('with IsGuardNumRange parameter', () => {
    describe('creation and errors', () => {
      it('handles typeName and options', () => {
        const error = createNumRangeError('TestRange', 'invalid', {
          inclusive: false,
          max: 10,
          min: 0
        });
        expect(error).toBeInstanceOf(RangeError);
        expect(error.message).toContain('Range Type: TestRange');
        expect(error.message).toContain(
          'expected a number value, within the exclusive range (0, 10)'
        );
        expect(error.message).toContain('but received a string');
      });
      it('throws if opts.min > opts.max', () => {
        expect(() =>
          createNumRangeError('TestRange', 'invalid', {
            inclusive: false,
            max: 0,
            min: 10
          })
        ).toThrowError();
      });
      it('throws if diff is zero (value is in range)', () => {
        expect(() =>
          createNumRangeError('TestRange', 10, {
            inclusive: true,
            max: 10,
            min: 10
          })
        ).toThrowError();
      });
    });
  });

  describe('inclusive', () => {
    it('creates error for non-number value with inclusive range', () => {
      const error = createNumRangeError(
        inclusive.typeName,
        'not a number',
        inclusive
      );

      expect(error).toBeInstanceOf(RangeError);
      expect(error.message).toContain('Range Type: TestRange');
      expect(error.message).toContain(
        'expected a number value, within the inclusive range [0, 100]'
      );
      expect(error.message).toContain('but received a string');
    });
    it('creates error for number below min with inclusive range', () => {
      const error = createNumRangeError(inclusive.typeName, -10, inclusive);

      expect(error).toBeInstanceOf(RangeError);
      expect(error.message).toContain('Range Type: TestRange');
      expect(error.message).toContain('within the inclusive range [0, 100]');
      expect(error.message).toContain('under by 10');
    });
    it('creates error for number above max with inclusive range', () => {
      const error = createNumRangeError(inclusive.typeName, 150, inclusive);

      expect(error).toBeInstanceOf(RangeError);
      expect(error.message).toContain('Range Type: TestRange');
      expect(error.message).toContain('within the inclusive range [0, 100]');
      expect(error.message).toContain('over by 50');
    });
  });
  describe('exclusive', () => {
    it('creates error for non-number value with exclusive range', () => {
      const error = createNumRangeError(
        exclusive.typeName,
        'not a number',
        exclusive
      );

      expect(error).toBeInstanceOf(RangeError);
      expect(error.message).toContain('Range Type: TestRange');
      expect(error.message).toContain(
        'expected a number value, within the exclusive range (0, 100)'
      );
      expect(error.message).toContain('but received a string');
    });
    it('creates error for number below min with exclusive range', () => {
      const error = createNumRangeError(exclusive.typeName, 0, exclusive);
      expect(error).toBeInstanceOf(RangeError);
      expect(error.message).toContain('Range Type: TestRange');
      expect(error.message).toContain('within the exclusive range (0, 100)');
      expect(error.message).toContain('under by 1');
    });
    it('creates error for number above max with exclusive range', () => {
      const error = createNumRangeError(exclusive.typeName, 100, exclusive);
      expect(error).toBeInstanceOf(RangeError);
      expect(error.message).toContain('Range Type: TestRange');
      expect(error.message).toContain('within the exclusive range (0, 100)');
      expect(error.message).toContain('over by 1');
    });
  });
});
