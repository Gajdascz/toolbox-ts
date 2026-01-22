import type { Obj } from '@toolbox-ts/types';
import type { Constructor } from '@toolbox-ts/types/defs/function';
import type { Frozen } from '@toolbox-ts/types/defs/object';

import { runGuardSuites } from '@toolbox-ts/test-utils';
import { expect, expectTypeOf } from 'vitest';

import {
  assertIsNotObjectEmpty,
  assertIsObject,
  assertIsObjectEmpty,
  assertIsObjectExtensible,
  assertIsObjectFrozen,
  assertIsObjectIterable,
  assertIsObjectPlain,
  assertIsObjectPrototypeKey,
  assertIsObjectProxy,
  assertIsObjectSealed,
  assertIsObjectWithConstructor,
  assertIsObjectWithEntries,
  assertIsObjectWithEntry,
  assertIsObjectWithKeys,
  assertIsObjectWithPropertyKey,
  assertIsObjectWithValues,
  checkIsNotObjectEmpty,
  checkIsObject,
  checkIsObjectEmpty,
  checkIsObjectExtensible,
  checkIsObjectFrozen,
  checkIsObjectIterable,
  checkIsObjectPlain,
  checkIsObjectPrototypeKey,
  checkIsObjectProxy,
  checkIsObjectSealed,
  checkIsObjectWithConstructor,
  checkIsObjectWithEntries,
  checkIsObjectWithEntry,
  checkIsObjectWithKeys,
  checkIsObjectWithPropertyKey,
  checkIsObjectWithValues,
  isNotObjectEmpty,
  isObject,
  isObjectEmpty,
  isObjectExtensible,
  isObjectFrozen,
  isObjectIterable,
  isObjectPlain,
  isObjectPrototypeKey,
  isObjectProxy,
  isObjectSealed,
  isObjectWithConstructor,
  isObjectWithEntries,
  isObjectWithEntry,
  isObjectWithKeys,
  isObjectWithPropertyKey,
  isObjectWithValues
} from './base.ts';

runGuardSuites(
  //#region> Object
  {
    is: isObject,
    assert: assertIsObject,
    check: checkIsObject,
    expectType: expectTypeOf(isObject).guards.toEqualTypeOf<object>(),
    assertType: expectTypeOf(assertIsObject).asserts.toEqualTypeOf<object>(),
    validValues: [{}, { a: 1 }, [], new Date()],
    invalidValues: [null, undefined, 42, 'string', true]
  },
  //#endregion
  //#region> Empty
  {
    is: isObjectEmpty,
    assert: assertIsObjectEmpty,
    check: checkIsObjectEmpty,
    expectType:
      expectTypeOf(isObjectEmpty).guards.toEqualTypeOf<Record<string, never>>(),
    assertType:
      expectTypeOf(assertIsObjectEmpty).asserts.toEqualTypeOf<
        Record<string, never>
      >(),
    validValues: [{}],
    invalidValues: [{ a: 1 }, [], null, undefined, 42, 'string', true]
  },
  //#endregion
  //#region> NotEmpty
  {
    is: isNotObjectEmpty,
    assert: assertIsNotObjectEmpty,
    check: checkIsNotObjectEmpty,
    expectType: expectTypeOf(isNotObjectEmpty).guards.toEqualTypeOf<{
      [key: string]: unknown;
    }>(),
    assertType: expectTypeOf(assertIsNotObjectEmpty).asserts.toEqualTypeOf<{
      [key: string]: unknown;
    }>(),
    validValues: [{ a: 1 }],
    invalidValues: [{}]
  },
  //#endregion
  //#region> Iterable
  {
    is: isObjectIterable,
    assert: assertIsObjectIterable,
    check: checkIsObjectIterable,

    validValues: [new Map(), new Set(), []],
    invalidValues: [{}, { a: 1 }, null, undefined, 42, 'string', true],
    expectType:
      expectTypeOf(isObjectIterable).guards.toEqualTypeOf<Iterable<unknown>>(),
    assertType: expectTypeOf(assertIsObjectIterable).asserts.toEqualTypeOf<
      Iterable<unknown>
    >()
  },
  //#endregion
  //#region> PrototypeKey
  {
    is: isObjectPrototypeKey,
    assert: assertIsObjectPrototypeKey,
    check: checkIsObjectPrototypeKey,

    validValues: ['constructor', '__proto__', 'prototype'],
    invalidValues: [null, undefined, {}, [], 42, true, 'nonExistentKey'],
    expectType:
      expectTypeOf(
        isObjectPrototypeKey
      ).guards.toEqualTypeOf<Obj.Key.Prototype>(),
    assertType: expectTypeOf(
      assertIsObjectPrototypeKey
    ).asserts.toEqualTypeOf<Obj.Key.Prototype>()
  },
  //#endregion
  //#region> Proxy
  {
    is: isObjectProxy,
    assert: assertIsObjectProxy,
    check: checkIsObjectProxy,

    validValues: [new Proxy({}, {}), new Proxy([], {})],
    invalidValues: [{}, [], null, undefined, 42, 'string', true],
    expectType:
      expectTypeOf(isObjectProxy).guards.toEqualTypeOf<
        InstanceType<typeof Proxy>
      >(),
    assertType:
      expectTypeOf(assertIsObjectProxy).asserts.toEqualTypeOf<
        InstanceType<typeof Proxy>
      >()
  },
  //#endregion
  //#region> Frozen
  {
    is: isObjectFrozen,
    assert: assertIsObjectFrozen,
    check: checkIsObjectFrozen,
    expectType: expectTypeOf(
      isObjectFrozen<{ a: number }>
    ).guards.toEqualTypeOf<Frozen<{ a: number }>>(),
    assertType:
      expectTypeOf(assertIsObjectFrozen).asserts.toEqualTypeOf<
        Frozen<object>
      >(),
    validValues: [Object.freeze({ a: 1 }), Object.freeze([])],
    invalidValues: [{ a: 1 }, [], null, undefined, 42, 'string', true]
  },
  //#endregion
  //#region> Sealed
  {
    is: isObjectSealed,
    assert: assertIsObjectSealed,
    check: checkIsObjectSealed,
    expectType: expectTypeOf(isObjectSealed).guards.toEqualTypeOf<object>(),
    assertType:
      expectTypeOf(assertIsObjectSealed).asserts.toEqualTypeOf<object>(),
    validValues: [Object.seal({ a: 1 }), Object.seal([])],
    invalidValues: [{ a: 1 }, [], null, undefined, 42, 'string', true]
  },
  //#endregion
  //#region> Extensible
  {
    is: isObjectExtensible,
    assert: assertIsObjectExtensible,
    check: checkIsObjectExtensible,
    expectType: expectTypeOf(isObjectExtensible).guards.toEqualTypeOf<object>(),
    assertType: expectTypeOf(
      assertIsObjectExtensible
    ).asserts.toEqualTypeOf<object>(),
    validValues: [{ a: 1 }, []],
    invalidValues: [
      Object.preventExtensions({ a: 1 }),
      Object.seal({}),
      Object.freeze({}),
      null,
      undefined,
      42,
      'string',
      true
    ]
  },
  //#endregion
  //#region> WithKeys
  {
    is: (v: unknown) => isObjectWithKeys(v, ['a', 'b'] as const),
    assert: (v: unknown) => assertIsObjectWithKeys(v, ['a', 'b']),
    check: (v: unknown) => checkIsObjectWithKeys(v, ['a', 'b']),
    expectType: expectTypeOf(isObjectWithKeys<'a' | 'b'>).guards.toEqualTypeOf<
      object & Record<'a' | 'b', unknown>
    >(),
    assertType: expectTypeOf(
      assertIsObjectWithKeys<'a' | 'b'>
    ).asserts.toEqualTypeOf<object & Record<'a' | 'b', unknown>>(),
    validValues: [{ a: 1, b: 2 }],
    invalidValues: [
      {},
      { a: 1 },
      { b: 2 },
      [],
      null,
      undefined,
      42,
      'string',
      true
    ],
    customCases: [
      {
        cases: [
          {
            itShould: 'error should have proper keys',
            run: () => {
              const keys = ['a', 'b'] as const;
              expect(() => assertIsObjectWithKeys({ x: 1 }, keys)).toThrowError(
                /x/
              );
            }
          },
          {
            itShould: 'only provide expected keys if value is not an object',
            run: () => {
              const keys = ['a', 'b'] as const;
              expect(() => assertIsObjectWithKeys(42, keys)).toThrowError(
                /a, b/
              );
            }
          }
        ]
      }
    ]
  },
  //#endregion
  //#region> WithValues
  {
    typeName: isObjectWithValues.typeName,
    is: (v: unknown) =>
      isObjectWithValues(v, (val: unknown) => typeof val === 'number'),
    assert: (v: unknown) =>
      assertIsObjectWithValues(v, (val: unknown) => typeof val === 'number'),
    check: (v: unknown) =>
      checkIsObjectWithValues(v, (val: unknown) => typeof val === 'number'),
    expectType: expectTypeOf(isObjectWithValues<number>).guards.toEqualTypeOf<
      Record<string, number>
    >(),
    assertType: expectTypeOf(
      assertIsObjectWithValues<number>
    ).asserts.toEqualTypeOf<Record<string, number>>(),
    invalidValues: [
      {},
      { a: 'a', b: 'b' },
      { a: 1, b: 'b' },
      [],
      null,
      undefined,
      42,
      'string',
      true
    ],
    validValues: [{ a: 1, b: 2 }],
    customCases: [
      {
        cases: [
          {
            itShould:
              'assertIsObjectWithValues should use expectedTypeName if provided',
            run: () =>
              expect(() =>
                assertIsObjectWithValues(
                  { a: 'a', b: 'b' },
                  (val: unknown) => typeof val === 'number',
                  'ExpectedTypeName'
                )
              ).toThrowError(/ExpectedTypeName/)
          },
          {
            itShould: 'return false when value is not an object',
            run: () =>
              expect(
                isObjectWithValues(
                  42,
                  (val: unknown) => typeof val === 'number'
                )
              ).toBe(false)
          }
        ]
      }
    ]
  },
  //#endregion
  //#region> WithEntries
  {
    typeName: isObjectWithEntries.typeName,
    is: (v: unknown) =>
      isObjectWithEntries(v, {
        a: (val: unknown) => typeof val === 'number',
        b: (val: unknown) => typeof val === 'number'
      }),
    assert: (v: unknown) =>
      assertIsObjectWithEntries(v, {
        a: (val: unknown) => typeof val === 'number',
        b: (val: unknown) => typeof val === 'number'
      }),
    check: (v: unknown) =>
      checkIsObjectWithEntries(v, {
        a: (val: unknown) => typeof val === 'number',
        b: (val: unknown) => typeof val === 'number'
      }),
    expectType: expectTypeOf(
      isObjectWithEntries<Record<'a' | 'b', (v: unknown) => v is number>>
    ).guards.toEqualTypeOf<Record<'a' | 'b', number>>(),
    assertType: expectTypeOf(
      assertIsObjectWithEntries<Record<'a' | 'b', (v: unknown) => v is number>>
    ).asserts.toEqualTypeOf<Record<'a' | 'b', number>>(),
    validValues: [{ a: 1, b: 2 }],
    invalidValues: [
      {},
      { a: 'a', b: 'b' },
      { a: 1, b: 'b' },
      [],
      null,
      undefined,
      42,
      'string',
      true
    ]
  },
  //#endregion
  //#region> WithPropertyKey
  {
    is: (v: unknown) => isObjectWithPropertyKey(v, 'key'),
    assert: (v: unknown) => assertIsObjectWithPropertyKey(v, 'key'),
    check: (v: unknown) => checkIsObjectWithPropertyKey(v, 'key'),
    validValues: [{ key: 'value' }],
    invalidValues: [{}, { badKey: 'value' }],
    expectType: expectTypeOf(
      isObjectWithPropertyKey<'key'>
    ).guards.toEqualTypeOf<object & Record<'key', unknown>>(),
    assertType: expectTypeOf(
      assertIsObjectWithPropertyKey<'key'>
    ).asserts.toEqualTypeOf<object & Record<'key', unknown>>()
  },
  //#endregion
  //#region> Plain
  {
    is: isObjectPlain,
    assert: assertIsObjectPlain,
    check: checkIsObjectPlain,
    expectType: expectTypeOf(isObjectPlain<{ a: 1 }>).guards.toEqualTypeOf<
      { a: 1 } & Record<string, unknown>
    >(),
    assertType: expectTypeOf(
      assertIsObjectPlain<{ a: 1 }, PropertyKey>
    ).asserts.toEqualTypeOf<{ a: 1 } & Record<PropertyKey, unknown>>(),
    validValues: [{}, { a: 1 }],
    invalidValues: [new Date(), [], null, undefined, 42, 'string', true],
    customCases: [
      {
        describe: 'Returns false when value is not an object',
        cases: [
          {
            itShould: 'return false for null',
            run: () => expect(isObjectPlain(null)).toBe(false)
          }
        ]
      }
    ]
  },
  //#endregion
  //#region> WithConstructor
  {
    is: isObjectWithConstructor,
    assert: assertIsObjectWithConstructor,
    check: checkIsObjectWithConstructor,
    expectType: expectTypeOf(
      isObjectWithConstructor<object>
    ).guards.toEqualTypeOf<{ constructor: Constructor } & object>(),
    assertType: expectTypeOf(
      assertIsObjectWithConstructor<object>
    ).asserts.toEqualTypeOf<{ constructor: Constructor } & object>(),
    validValues: [{ constructor: Object }],
    invalidValues: [
      { constructor: 'not a function' },
      null,
      undefined,
      42,
      'string',
      true
    ]
  },
  //#endregion
  //#region> WithEntry
  {
    is: (v: unknown) =>
      isObjectWithEntry(
        v,
        'a',
        (val: unknown): val is number => typeof val === 'number'
      ),
    assert: (v: unknown) =>
      assertIsObjectWithEntry(
        v,
        'a',
        (val: unknown): val is number => typeof val === 'number'
      ),
    check: (v: unknown) =>
      checkIsObjectWithEntry(
        v,
        'a',
        (val: unknown): val is number => typeof val === 'number'
      ),
    validValues: [{ a: 1 }],
    invalidValues: [{}, { a: 'a' }],
    expectType: expectTypeOf(
      isObjectWithEntry<'a', number>
    ).guards.toEqualTypeOf<{ a: number } & object>(),
    assertType: expectTypeOf(
      assertIsObjectWithEntry<'a', number>
    ).asserts.toEqualTypeOf<{ a: number } & object>(),
    customCases: [
      {
        describe: 'Assert Throws',
        cases: [
          {
            itShould: 'throw when entry is invalid',
            run: () =>
              expect(() =>
                assertIsObjectWithEntry(
                  { a: 'a' },
                  'a',
                  (val: unknown): val is number => typeof val === 'number'
                )
              ).toThrow()
          }
        ]
      }
    ]
  }
  //#endregion
);
