import type { Fn } from '@toolbox-ts/types/function';

import { createTypeError, resolveTypeName } from '../../../utils/errors/index.js';
import {
  createGenericIsGuards,
  createGuard,
  createIsGuards,
  createTypeNames
} from '../../factories.js';
const { Of, Tuple, Any } = createTypeNames('Array', ['Any', 'Of', 'Tuple']);
const NON_ARRAY = 'a non-array value';
const testItems = <T>(
  typeName: string,
  arr: unknown[],
  guard: ((item: unknown, index: number) => boolean) | Fn.IsGuard<T, [i: number]>
) => {
  const invalid = arr.entries().reduce<string[]>((acc, [i, item]) => {
    if (!guard(item, i)) acc.push(`at index ${i}: ${resolveTypeName(item)}`);
    return acc;
  }, []);
  if (invalid.length > 0)
    throw createTypeError(
      typeName,
      arr,
      `\n  Found ${invalid.length} invalid item(s):\n    ${invalid.join('\n    ')}`
    );
};
//#region> Any
const _any = createIsGuards(Any, Array.isArray);
export const isArrayAny = _any.is;
export const checkIsArrayAny = _any.check;
export function assertIsArrayAny(input: unknown): asserts input is any[] {
  if (!isArrayAny(input)) throw createTypeError(isArrayAny.typeName, input);
}
//#endregion
//#region> Array Of Type
const _of = createGenericIsGuards(
  Of,
  <T>(v: unknown, guard: Fn.IsGuard<T, [i?: number]>): v is T[] =>
    Array.isArray(v) && v.every(guard)
);
//
export const isArrayOf = _of.is;
export const checkIsArrayOf = _of.check;
export function assertIsArrayOf<V>(
  v: unknown,
  guard: Fn.IsGuard<V, [i?: number]>
): asserts v is V[] {
  if (Array.isArray(v)) testItems(isArrayOf.typeName, v, guard);
  else throw createTypeError(isArrayOf.typeName, v);
}
//#endregion
//#region> Tuple
const _tuple = createGenericIsGuards(
  Tuple,
  <T extends readonly unknown[]>(
    v: unknown,
    guard: Readonly<{ [K in keyof T]: Fn.IsGuard<T[K]> }>
  ): v is Readonly<T> =>
    Array.isArray(v) && v.length === guard.length && v.every((item, i) => guard[i](item))
);
//
export const isTuple = _tuple.is;
export const checkIsTuple = _tuple.check;
export function assertIsTuple<T extends readonly unknown[]>(
  v: unknown,
  guard: { [K in keyof T]: Fn.IsGuard<T[K]> }
): asserts v is Readonly<T> {
  if (Array.isArray(v)) {
    if (v.length !== guard.length) {
      throw createTypeError(
        isTuple.typeName,
        v,
        `Expected length ${guard.length}, but got ${v.length}`
      );
    }
    testItems(isTuple.typeName, v, (item, i) => guard[i](item));
  } else throw createTypeError(isTuple.typeName, v);
}
//#endregion

//#region> Bounds
export const checkIsInArrayBounds = createGuard(
  `checkIsInArrayBounds`,
  'InArrayBounds',
  (arr: unknown, index: number): boolean =>
    Array.isArray(arr) && Number.isSafeInteger(index) && index >= 0 && index < arr.length
);
export function assertIsInArrayBounds(arr: unknown, index: number) {
  if (!checkIsInArrayBounds(arr, index))
    throw new RangeError(
      Array.isArray(arr)
        ? `Index ${index} is out of bounds for array of length ${arr.length}. Valid indices are from 0 to ${arr.length - 1}.`
        : `Cannot validate bounds of a non-array value`
    );
}
//#endregion

//#region> Empty
export const isArrayEmpty = createGuard(
  'isArrayEmpty',
  'ArrayEmpty',
  (arr: unknown): arr is [] => Array.isArray(arr) && arr.length === 0
);
export const checkIsArrayEmpty = createGuard(
  'checkIsArrayEmpty',
  'ArrayEmpty',
  (arr: unknown): boolean => Array.isArray(arr) && arr.length === 0
);
export function assertIsArrayEmpty(arr: unknown): asserts arr is [] {
  if (!isArrayEmpty(arr))
    throw new TypeError(
      `Expected an empty array, but got ${
        Array.isArray(arr) ? `an array of length ${arr.length}` : NON_ARRAY
      }`
    );
}
export const isNotArrayEmpty = createGuard(
  'isArrayNotEmpty',
  'ArrayNotEmpty',
  <T>(arr: unknown): arr is [T, ...(T | undefined)[]] => Array.isArray(arr) && arr[0] !== undefined
);
export const checkIsNotArrayEmpty = createGuard(
  'checkIsArrayNotEmpty',
  'ArrayNotEmpty',
  (arr: unknown): boolean => Array.isArray(arr) && arr[0] !== undefined
);
export function assertIsNotArrayEmpty<T>(arr: unknown): asserts arr is [T, ...(T | undefined)[]] {
  if (!isNotArrayEmpty(arr))
    throw new TypeError(
      `Expected a non-empty array, but got ${Array.isArray(arr) ? 'an empty array' : NON_ARRAY}`
    );
}
//#endregion
