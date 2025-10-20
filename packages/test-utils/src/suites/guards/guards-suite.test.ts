import { describe, expect, it } from 'vitest';

import {
  type GuardSuiteConfig,
  IS,
  runGuardSuite,
  runGuardSuites
} from './guards-suite.ts';

describe('guards-suite', () => {
  describe('IS', () => {
    describe('num', () => {
      it('should return true for numbers', () => {
        expect(IS.num(42)).toBe(true);
        expect(IS.num(0)).toBe(true);
        expect(IS.num(-1)).toBe(true);
      });

      it('should return false for non-numbers', () => {
        expect(IS.num('42')).toBe(false);
        expect(IS.num(null)).toBe(false);
        expect(IS.num(undefined)).toBe(false);
      });
      describe('str', () => {
        it('should return true for strings', () => {
          expect(IS.str('hello')).toBe(true);
          expect(IS.str('')).toBe(true);
        });

        it('should return false for non-strings', () => {
          expect(IS.str(42)).toBe(false);
          expect(IS.str(null)).toBe(false);
        });
      });
    });
  });
  const isString = (v: unknown): v is string => typeof v === 'string';
  Object.assign(isString, { typeName: 'String' });
  const assertIsString = (v: unknown): asserts v is string => {
    if (typeof v !== 'string') throw new TypeError('Not a string');
  };
  const checkIsString = (v: unknown): boolean => typeof v === 'string';

  const assertCustom = (v: unknown): asserts v is string => {
    if (typeof v !== 'string') throw new RangeError('Not a string');
  };
  describe('runGuardSuite', () => {
    const config: GuardSuiteConfig<string> = {
      is: isString,
      assert: assertIsString,
      check: checkIsString,
      validValues: ['hello', 'world'],
      invalidValues: [42, null]
    } as const;
    runGuardSuite({ typeName: 'Should test valid values', ...config });
    runGuardSuite({
      typeName: 'Should run custom cases',
      ...config,
      customCases: [
        {
          describe: 'Custom Cases',
          cases: [
            { itShould: 'pass custom case', run: () => isString('custom case') }
          ]
        },
        {
          cases: [
            {
              itShould: 'run with no describe',
              run: () => isString('no describe')
            }
          ]
        }
      ]
    });
    runGuardSuite({
      typeName: 'Should throw custom error',
      ...config,
      error: RangeError, //<- assigning a different error would fail
      assert: assertCustom
    });
  });
  describe('runs multiple guard suites', () => {
    const specificIs = (v: unknown): v is 'specific' => v === 'specific';
    runGuardSuites([
      {
        is: isString,
        assert: assertIsString,
        check: checkIsString,
        validValues: ['hello', 'world'],
        invalidValues: [42, null],
        typeName: 'String Suite'
      },
      {
        typeName: 'Specific String Suite',
        is: specificIs,
        assert: (v: unknown): asserts v is 'specific' => {
          if (!specificIs(v)) throw new TypeError('Value is not "specific"');
        },
        check: (v: unknown): boolean => v === 'specific',
        validValues: ['specific'],
        invalidValues: ['one', null]
      },
      {
        typeName: 'Number Suite',
        is: IS.num,
        assert: (v: unknown): asserts v is number => {
          if (!IS.num(v)) throw new TypeError('Value is not a number');
        },
        check: IS.num,
        validValues: [1, 2, 3],
        invalidValues: ['one', null]
      }
    ]);
  });
});
