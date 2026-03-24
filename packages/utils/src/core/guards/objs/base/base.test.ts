import type { Obj } from '@toolbox-ts/types';
import type { Frozen } from '@toolbox-ts/types/defs/object';

import { runGuardSuites } from '@toolbox-ts/test-utils';
import { expect, expectTypeOf } from 'vitest';

import {
  assertIsNotObjectEmpty,
  assertIsObjectNotPlain,
  checkIsObjectNotPlain,
  assertIsObject,
  assertIsObjectEmpty,
  assertIsObjectExtensible,
  assertIsObjectFrozen,
  assertIsObjectIterable,
  assertIsObjectPrototypeKey,
  assertIsObjectProxy,
  assertIsObjectSealed,
  assertIsObjectWithEntry,
  assertIsObjectWithKeys,
  assertIsObjectWithValues,
  checkIsNotObjectEmpty,
  checkIsObject,
  checkIsObjectEmpty,
  checkIsObjectExtensible,
  checkIsObjectFrozen,
  checkIsObjectIterable,
  checkIsObjectPrototypeKey,
  checkIsObjectProxy,
  checkIsObjectSealed,
  checkIsObjectWithEntry,
  checkIsObjectWithKeys,
  checkIsObjectWithValues,
  isNotObjectEmpty,
  isObject,
  isObjectEmpty,
  isObjectExtensible,
  isObjectFrozen,
  isObjectIterable,
  isObjectPrototypeKey,
  isObjectProxy,
  isObjectSealed,
  isObjectWithEntry,
  isObjectWithKeys,
  isObjectWithValues,
  assertIsObjectAny,
  checkIsObjectAny,
  isObjectAny,
  isObjectNotPlain
} from './base.ts';

runGuardSuites(
  //#region> Any
  {
    is: isObjectAny,
    assert: assertIsObjectAny,
    check: checkIsObjectAny,
    expectType: expectTypeOf(isObjectAny).guards.toEqualTypeOf<object>(),
    assertType: expectTypeOf(assertIsObjectAny).asserts.toEqualTypeOf<object>(),
    validValues: [{}, { a: 1 }, [], new Date()],
    invalidValues: [null, undefined, 42, 'string', true]
  },
  //#endregion
  //#region> Object
  {
    is: isObject,
    assert: assertIsObject,
    check: checkIsObject,
    expectType: expectTypeOf(isObject).guards.toEqualTypeOf<Record<string, unknown>>(),
    assertType: expectTypeOf(assertIsObject).asserts.toEqualTypeOf<Record<string, unknown>>(),
    validValues: [{}, { a: 1 }, [], new Date()],
    invalidValues: [null, undefined, 42, 'string', true]
  },
  //#endregion
  //#region> NotPlain
  {
    is: isObjectNotPlain,
    assert: assertIsObjectNotPlain,
    check: checkIsObjectNotPlain,
    expectType: expectTypeOf(isObjectNotPlain).guards.toEqualTypeOf<object>(),
    assertType: expectTypeOf(assertIsObjectNotPlain).asserts.toEqualTypeOf<object>(),
    validValues: [new Date(), new Map(), new Set(), () => {}],
    invalidValues: [{}, { a: 1 }, [], null, undefined, 42, 'string', true]
  },
  //#endregion
  //#region> Empty
  {
    is: isObjectEmpty,
    assert: assertIsObjectEmpty,
    check: checkIsObjectEmpty,
    expectType: expectTypeOf(isObjectEmpty).guards.toEqualTypeOf<Record<string, never>>(),
    assertType: expectTypeOf(assertIsObjectEmpty).asserts.toEqualTypeOf<Record<string, never>>(),
    validValues: [{}],
    invalidValues: [{ a: 1 }, [], null, undefined, 42, 'string', true]
  },
  //#endregion
  //#region> NotEmpty
  {
    is: isNotObjectEmpty,
    assert: assertIsNotObjectEmpty,
    check: checkIsNotObjectEmpty,
    expectType: expectTypeOf(isNotObjectEmpty).guards.toEqualTypeOf<{ [key: string]: unknown }>(),
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
    expectType: expectTypeOf(isObjectIterable).guards.toEqualTypeOf<Iterable<unknown>>(),
    assertType: expectTypeOf(assertIsObjectIterable).asserts.toEqualTypeOf<Iterable<unknown>>()
  },
  //#endregion
  //#region> PrototypeKey
  {
    is: isObjectPrototypeKey,
    assert: assertIsObjectPrototypeKey,
    check: checkIsObjectPrototypeKey,

    validValues: ['constructor', '__proto__', 'prototype'],
    invalidValues: [null, undefined, {}, [], 42, true, 'nonExistentKey'],
    expectType: expectTypeOf(isObjectPrototypeKey).guards.toEqualTypeOf<Obj.Key.Prototype>(),
    assertType: expectTypeOf(assertIsObjectPrototypeKey).asserts.toEqualTypeOf<Obj.Key.Prototype>()
  },
  //#endregion
  //#region> Proxy
  {
    is: isObjectProxy,
    assert: assertIsObjectProxy,
    check: checkIsObjectProxy,

    validValues: [new Proxy({}, {}), new Proxy([], {})],
    invalidValues: [{}, [], null, undefined, 42, 'string', true],
    expectType: expectTypeOf(isObjectProxy).guards.toEqualTypeOf<InstanceType<typeof Proxy>>(),
    assertType:
      expectTypeOf(assertIsObjectProxy).asserts.toEqualTypeOf<InstanceType<typeof Proxy>>()
  },
  //#endregion
  //#region> Frozen
  {
    is: isObjectFrozen,
    assert: assertIsObjectFrozen,
    check: checkIsObjectFrozen,
    expectType: expectTypeOf(isObjectFrozen<{ a: number }>).guards.toEqualTypeOf<
      Frozen<{ a: number }>
    >(),
    assertType: expectTypeOf(assertIsObjectFrozen).asserts.toEqualTypeOf<Frozen<object>>(),
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
    assertType: expectTypeOf(assertIsObjectSealed).asserts.toEqualTypeOf<object>(),
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
    assertType: expectTypeOf(assertIsObjectExtensible).asserts.toEqualTypeOf<object>(),
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
    assertType: expectTypeOf(assertIsObjectWithKeys<'a' | 'b'>).asserts.toEqualTypeOf<
      object & Record<'a' | 'b', unknown>
    >(),
    validValues: [{ a: 1, b: 2 }],
    invalidValues: [{}, { a: 1 }, { b: 2 }, [], null, undefined, 42, 'string', true],
    customCases: [
      {
        cases: [
          {
            itShould: 'error should have proper keys',
            run: () => {
              const keys = ['a', 'b'] as const;
              expect(() => assertIsObjectWithKeys({ x: 1 }, keys)).toThrow(/x/);
            }
          },
          {
            itShould: 'only provide expected keys if value is not an object',
            run: () => {
              const keys = ['a', 'b'] as const;
              expect(() => assertIsObjectWithKeys(42, keys)).toThrow(/a, b/);
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
    is: (v: unknown) => isObjectWithValues(v, (val: unknown) => typeof val === 'number'),
    assert: (v: unknown) => assertIsObjectWithValues(v, (val: unknown) => typeof val === 'number'),
    check: (v: unknown) => checkIsObjectWithValues(v, (val: unknown) => typeof val === 'number'),
    expectType: expectTypeOf(isObjectWithValues<number>).guards.toEqualTypeOf<
      Record<string, number>
    >(),
    assertType: expectTypeOf(assertIsObjectWithValues<number>).asserts.toEqualTypeOf<
      Record<string, number>
    >(),
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
            itShould: 'assertIsObjectWithValues should use expectedTypeName if provided',
            run: () =>
              expect(() =>
                assertIsObjectWithValues(
                  { a: 'a', b: 'b' },
                  (val: unknown) => typeof val === 'number',
                  'ExpectedTypeName'
                )
              ).toThrow(/ExpectedTypeName/)
          },
          {
            itShould: 'return false when value is not an object',
            run: () =>
              expect(isObjectWithValues(42, (val: unknown) => typeof val === 'number')).toBe(false)
          }
        ]
      }
    ]
  },
  //#endregion
  //#region> WithEntry
  {
    is: (v: unknown) =>
      isObjectWithEntry(v, 'a', (val: unknown): val is number => typeof val === 'number'),
    assert: (v: unknown) =>
      assertIsObjectWithEntry(v, 'a', (val: unknown): val is number => typeof val === 'number'),
    check: (v: unknown) =>
      checkIsObjectWithEntry(v, 'a', (val: unknown): val is number => typeof val === 'number'),
    validValues: [{ a: 1 }],
    invalidValues: [{}, { a: 'a' }],
    expectType: expectTypeOf(isObjectWithEntry<'a.b.c', number>).guards.toEqualTypeOf<
      { a: { b: { c: number } } } & object
    >(),
    assertType: expectTypeOf(assertIsObjectWithEntry<'a', number>).asserts.toEqualTypeOf<
      { a: number } & object
    >(),
    customCases: [
      {
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
          },
          {
            itShould: 'split key path and validate nested entries',
            run: () =>
              expect(() =>
                assertIsObjectWithEntry(
                  { a: { b: { c: 'not a number' } } },
                  'a.b.c',
                  (val: unknown): val is number => typeof val === 'number'
                )
              ).toThrow()
          },
          {
            itShould: 'pass for valid nested entries',
            run: () =>
              expect(() =>
                assertIsObjectWithEntry(
                  { a: { b: { c: 42 } } },
                  'a.b.c',
                  (val: unknown): val is number => typeof val === 'number'
                )
              ).not.toThrow()
          },
          {
            itShould: 'check if value is undefined when no valueGuard provided',
            run: () => {
              expect(() => assertIsObjectWithEntry({ a: undefined }, 'a')).toThrow(
                /With valid entry at key: a/
              );
              expect(() => assertIsObjectWithEntry({ a: 1 }, 'a')).not.toThrow();
            }
          }
        ]
      }
    ]
  }
  //#endregion
);
