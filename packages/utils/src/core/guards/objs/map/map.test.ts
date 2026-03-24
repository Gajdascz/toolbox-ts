import { runGuardSuites } from '@toolbox-ts/test-utils';
import { expectTypeOf } from 'vitest';

import {
  assertIsMapWithEntries,
  assertIsMapWithKeys,
  assertIsMapWithValues,
  checkIsMapWithEntries,
  checkIsMapWithKeys,
  checkIsMapWithValues,
  isMapWithEntries,
  isMapWithKeys,
  isMapWithValues
} from './map.ts';

const defaultFail = [null, undefined, {}, { a: 1 }, [], [1, 2, 3], () => {}, new Date(), new Set()];
const KEYS = ['a', 'b'] as const;
const isStr = (v: unknown): v is string => typeof v === 'string';
const isNum = (v: unknown): v is number => typeof v === 'number';
const ENTRIES = { a: isNum, b: isStr };
runGuardSuites(
  {
    typeName: isMapWithKeys.typeName,
    is: (v) => isMapWithKeys(v, KEYS),
    assert: (v) => assertIsMapWithKeys(v, KEYS),
    check: (v) => checkIsMapWithKeys(v, KEYS),
    expectType: expectTypeOf(isMapWithKeys<'a' | 'b'>).guards.toEqualTypeOf<
      Map<'a' | 'b', unknown>
    >(),
    assertType: expectTypeOf(assertIsMapWithKeys<'a' | 'b'>).asserts.toEqualTypeOf<
      Map<'a' | 'b', unknown>
    >(),
    validValues: [
      new Map([
        ['a', 1],
        ['b', 2]
      ]),
      new Map([
        ['a', 'hello'],
        ['b', 'world']
      ])
    ],
    invalidValues: [
      ...defaultFail,
      new Map(),
      new Map([
        ['x', 1],
        ['y', 2]
      ]),
      new Map([['a', 1]]),
      ['a', 'b']
    ]
  },
  {
    typeName: isMapWithValues.typeName,
    is: (v) => isMapWithValues(v, isNum),
    assert: (v) => assertIsMapWithValues(v, isNum),
    check: (v) => checkIsMapWithValues(v, isNum),
    expectType: expectTypeOf(isMapWithValues<number>).guards.toEqualTypeOf<Map<unknown, number>>(),
    assertType: expectTypeOf(assertIsMapWithValues<number>).asserts.toEqualTypeOf<
      Map<unknown, number>
    >(),
    validValues: [
      new Map([['a', 1]]),
      new Map([
        ['a', 1],
        ['b', 2],
        ['c', 3]
      ]),
      new Map([['x', Infinity]]),
      new Map([
        ['a', -Infinity],
        ['b', Number.NaN],
        ['c', 0]
      ])
    ],

    invalidValues: [
      ...defaultFail,
      new Map(),
      new (Map as any)([
        ['a', 1],
        ['b', 'mixed']
      ]),
      new Map([
        ['a', 'hello'],
        ['b', 'world']
      ]),
      new Map([
        ['a', 0n],
        ['b', 1n]
      ])
    ]
  },
  {
    typeName: isMapWithEntries.typeName,
    is: (v) => isMapWithEntries(v, ENTRIES),
    assert: (v) => assertIsMapWithEntries(v, ENTRIES),
    check: (v) => checkIsMapWithEntries(v, ENTRIES),
    expectType: expectTypeOf(
      isMapWithEntries<Record<'a' | 'b', (v: unknown) => v is number | string>>
    ).guards.toEqualTypeOf<Map<'a' | 'b', number | string>>(),
    assertType: expectTypeOf(
      assertIsMapWithEntries<Record<'a' | 'b', (v: unknown) => v is number | string>>
    ).asserts.toEqualTypeOf<Map<'a' | 'b', number | string>>(),
    validValues: [
      new Map<'a' | 'b', number | string>([
        ['a', 1],
        ['b', '2']
      ]),
      new Map<'a' | 'b', number | string>([
        ['a', 1],
        ['b', 'hello']
      ])
    ],
    invalidValues: [
      ...defaultFail,
      new Map(),
      new Map([['a', 'wrong']]),
      new Map([
        ['a', 1],
        ['b', 2]
      ]),
      new Map([['b', 'hello']])
    ]
  }
);
