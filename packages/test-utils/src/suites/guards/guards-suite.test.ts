import { describe, expectTypeOf } from 'vitest';

import { type GuardSuiteConfig, runGuardSuite, runGuardSuites } from './guards-suite.ts';
const IS = {
  num: (v: unknown): v is number => typeof v === 'number',
  str: (v: unknown): v is string => typeof v === 'string'
};

const specificIs = (v: unknown): v is 'specific' => v === 'specific';

function assertNum(v: unknown): asserts v is number {
  if (!IS.num(v)) throw new TypeError('Value is not a number');
}
function assertSpecific(v: unknown): asserts v is 'specific' {
  if (!specificIs(v)) throw new TypeError('Value is not "specific"');
}
const isString = (v: unknown): v is string => typeof v === 'string';
Object.assign(isString, { typeName: 'String' });
function assertIsString(v: unknown): asserts v is string {
  if (typeof v !== 'string') throw new TypeError('Not a string');
}
const checkIsString = (v: unknown): boolean => typeof v === 'string';

const assertCustom = (v: unknown): asserts v is string => {
  if (typeof v !== 'string') throw new RangeError('Not a string');
};
describe('guards-suite', () => {
  describe('runGuardSuite', () => {
    const config: GuardSuiteConfig<string> = {
      is: isString,
      assert: assertIsString,
      check: checkIsString,
      assertType: expectTypeOf(assertIsString).asserts.toEqualTypeOf<string>(),
      expectType: expectTypeOf(isString).guards.toEqualTypeOf<string>(),
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
          cases: [{ itShould: 'pass custom case', run: () => isString('custom case') }]
        },
        { cases: [{ itShould: 'run with no describe', run: () => isString('no describe') }] }
      ]
    });
    runGuardSuite({
      typeName: 'Should throw custom error',
      ...config,
      error: RangeError, //<- assigning a different error would fail
      assert: assertCustom
    });
    function testFunc(v: unknown): v is string {
      return typeof v === 'string';
    }

    runGuardSuite({
      is: testFunc,
      check: testFunc,
      assert: assertIsString,
      assertType: expectTypeOf(assertIsString).asserts.toEqualTypeOf<string>(),
      expectType: expectTypeOf(testFunc).guards.toEqualTypeOf<string>(),
      invalidValues: [42, null],
      validValues: ['hello', 'world']
    });
  });
  describe('runs multiple guard suites', () => {
    runGuardSuites(
      {
        is: isString,
        assert: assertIsString,
        check: checkIsString,
        assertType: expectTypeOf(assertIsString).asserts.toEqualTypeOf<string>(),
        expectType: expectTypeOf(isString).guards.toEqualTypeOf<string>(),
        validValues: ['hello', 'world'],
        invalidValues: [42, null],
        typeName: 'String Suite'
      },
      {
        typeName: 'Specific String Suite',
        is: specificIs,
        assertType: expectTypeOf(assertSpecific).asserts.toEqualTypeOf<'specific'>(),
        assert: assertSpecific,
        expectType: expectTypeOf(specificIs).guards.toEqualTypeOf<'specific'>(),
        check: (v: unknown): boolean => v === 'specific',
        validValues: ['specific'],
        invalidValues: ['one', null]
      },
      {
        typeName: 'Number Suite',
        is: IS.num,
        assert: assertNum,
        assertType: expectTypeOf(assertNum).asserts.toEqualTypeOf<number>(),
        check: IS.num,
        expectType: expectTypeOf(IS.num).guards.toBeNumber(),
        validValues: [1, 2, 3],
        invalidValues: ['one', null]
      }
    );
  });
});
