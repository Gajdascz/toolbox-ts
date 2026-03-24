import { runGuardSuites } from '@toolbox-ts/test-utils';
import { describe, expect, expectTypeOf, it } from 'vitest';

import {
  assertIsArrayOf,
  assertIsInArrayBounds,
  assertIsTuple,
  assertIsArrayAny,
  checkIsArrayAny,
  isArrayAny,
  assertIsArrayEmpty,
  assertIsNotArrayEmpty,
  checkIsArrayEmpty,
  checkIsNotArrayEmpty,
  isArrayEmpty,
  isNotArrayEmpty,
  checkIsArrayOf,
  checkIsTuple,
  isArrayOf,
  checkIsInArrayBounds,
  isTuple
} from './array.ts';

const defaultFail = [null, undefined, {}, { a: 1 }, () => {}, new Date(), new Map()];
const isNum = (v: unknown): v is number => typeof v === 'number';
const numArr = [1, 2, 3];
runGuardSuites(
  {
    is: (v) => isArrayOf(v, isNum),
    assert: (v) => assertIsArrayOf(v, isNum),
    check: (v) => checkIsArrayOf(v, isNum),
    validValues: [numArr],

    invalidValues: [...defaultFail, [0n, 42n], [1, 2, 3, 'x']],
    expectType: expectTypeOf(isArrayOf<number>).guards.toEqualTypeOf<number[]>(),
    assertType: expectTypeOf(assertIsArrayOf<number>).asserts.toEqualTypeOf<number[]>(),
    customCases: [
      {
        describe: 'Array with mixed types',
        cases: [
          {
            itShould: 'correctly identify an array with mixed types',
            expectType: expectTypeOf(isArrayOf<number | string>).guards.toEqualTypeOf<
              (number | string)[]
            >(),
            run: () =>
              isArrayOf(
                [1, 'a', 3],
                (val): val is number | string => typeof val === 'number' || typeof val === 'string'
              )
          }
        ]
      },
      {
        cases: [
          {
            itShould: 'assertIsArrayOf formats found invalid values correctly',
            run: () => {
              const arr = [1, 'a', 3];
              expect(() =>
                assertIsArrayOf(arr, (val): val is number => typeof val === 'number')
              ).toThrow(/a/);
            }
          }
        ]
      }
    ]
  },
  {
    is: (v): v is readonly [number, number, number] => isTuple(v, [isNum, isNum, isNum]),
    assert: (v): asserts v is readonly [number, number, number] =>
      assertIsTuple(v, [isNum, isNum, isNum]),
    check: (v) => checkIsTuple(v, [isNum, isNum, isNum]),
    invalidValues: [...defaultFail, [1, 2], [1, 2, 3, 4], [1, 'a', 3]],
    expectType: expectTypeOf(isTuple<readonly [number, number, number]>).guards.toEqualTypeOf<
      readonly [number, number, number]
    >(),
    assertType: expectTypeOf(
      assertIsTuple<readonly [number, number, number]>
    ).asserts.toEqualTypeOf<readonly [number, number, number]>(),
    validValues: [[1, 2, 3]],
    customCases: [
      {
        describe: 'Tuple with different types',
        cases: [
          {
            itShould: 'correctly identify a tuple with different types',
            expectType: expectTypeOf(
              isTuple<readonly [number, string, boolean]>
            ).guards.toEqualTypeOf<readonly [number, string, boolean]>(),
            run: () => {
              const tuple: [number, string, boolean] = [1, 'a', true];
              expect(
                isTuple(tuple, [
                  isNum,
                  (v): v is string => typeof v === 'string',
                  (v): v is boolean => typeof v === 'boolean'
                ])
              ).toBe(true);
            }
          },
          {
            itShould: 'preserve literal types',
            expectType: expectTypeOf(isTuple<readonly [1, 'a', true]>).guards.toEqualTypeOf<
              readonly [1, 'a', true]
            >(),
            run: () => {
              const tuple = [1, 'a', true] as const;
              expect(
                isTuple(tuple, [isNum, (v): v is 'a' => v === 'a', (v): v is true => v === true])
              ).toBe(true);
            }
          }
        ]
      },
      {
        cases: [
          {
            itShould:
              'assertIsTuple throws when an array of guards does not match the length of the tuple',
            run: () => {
              const tuple = [1, 'a', true] as const;
              expect(() => assertIsTuple(tuple, [(v): v is true => v === true])).toThrow(/length/);
            }
          }
        ]
      }
    ]
  },
  {
    is: isArrayEmpty,
    assert: assertIsArrayEmpty,
    check: checkIsArrayEmpty,
    validValues: [[], Object.freeze([])],
    invalidValues: [...defaultFail, [1], [1, 2]],
    expectType: expectTypeOf(isArrayEmpty).guards.toEqualTypeOf<[]>(),
    assertType: expectTypeOf(assertIsArrayEmpty).asserts.toEqualTypeOf<[]>(),
    customCases: [
      {
        cases: [
          {
            itShould: 'assertIsArrayEmpty formats found invalid values correctly',
            run: () => {
              const arr: unknown = [1, 2];
              expect(() => assertIsArrayEmpty(arr)).toThrow(/Expected an empty array/);
            }
          }
        ]
      }
    ]
  },
  {
    is: isNotArrayEmpty,
    assert: assertIsNotArrayEmpty,
    check: checkIsNotArrayEmpty,
    validValues: [[1], [1, 2], Object.freeze([1])],
    invalidValues: [...defaultFail, []],
    expectType: expectTypeOf(isNotArrayEmpty<number>).guards.toEqualTypeOf<
      [number, ...(number | undefined)[]]
    >(),
    assertType: expectTypeOf(assertIsNotArrayEmpty<number>).asserts.toEqualTypeOf<
      [number, ...(number | undefined)[]]
    >(),
    customCases: [
      {
        cases: [
          {
            itShould: 'assertIsNotArrayEmpty formats found invalid values correctly',
            run: () => {
              const arr: unknown = [];
              expect(() => assertIsNotArrayEmpty(arr)).toThrow(/Expected a non-empty array/);
            }
          }
        ]
      }
    ]
  },
  {
    is: isArrayAny,
    check: checkIsArrayAny,
    assert: assertIsArrayAny,
    validValues: [[], [1, 'a'], Object.freeze([1, 2])],
    invalidValues: [...defaultFail, {}],
    expectType: expectTypeOf(isArrayAny).guards.toEqualTypeOf<any[]>(),
    assertType: expectTypeOf(assertIsArrayAny).asserts.toEqualTypeOf<any[]>()
  }
);

describe('ArrBounds', () => {
  it('checkIsInArrayBounds should return true for valid indices', () => {
    expect(checkIsInArrayBounds([1, 2, 3], 0)).toBe(true);
    expect(checkIsInArrayBounds([1, 2, 3], 1)).toBe(true);
    expect(checkIsInArrayBounds([1, 2, 3], 2)).toBe(true);
  });
  it('checkIsInArrayBounds should return false for invalid indices', () => {
    expect(checkIsInArrayBounds([1, 2, 3], -1)).toBe(false);
    expect(checkIsInArrayBounds([1, 2, 3], 3)).toBe(false);
    expect(checkIsInArrayBounds([1, 2, 3], 100)).toBe(false);
  });
  describe('assertIsInArrayBounds', () => {
    it('should throw a RangeError when asserting out of bounds', () => {
      expect(() => assertIsInArrayBounds([1, 2, 3], -1)).toThrow(RangeError);
      expect(() => assertIsInArrayBounds([1, 2, 3], 3)).toThrow(RangeError);
      expect(() => assertIsInArrayBounds([1, 2, 3], 100)).toThrow(RangeError);
    });
    it('should not throw when asserting valid indices', () => {
      expect(() => assertIsInArrayBounds([1, 2, 3], 0)).not.toThrow();
      expect(() => assertIsInArrayBounds([1, 2, 3], 1)).not.toThrow();
      expect(() => assertIsInArrayBounds([1, 2, 3], 2)).not.toThrow();
    });
    it('should format error message correctly', () => {
      expect(() => assertIsInArrayBounds([1, 2, 3], 3)).toThrow(/length 3/);
      expect(() => assertIsInArrayBounds({}, 0)).toThrow(/non-array value/);
    });
  });
});
