import type { Fn } from '@toolbox-ts/types/function';

import {
  createTypeError,
  resolveTypeName
} from '../../../utils/errors/index.js';
import { createGuard, createNames } from '../../factories.js';
const TYPES = {
  OF: 'ArrayOf',
  TUPLE: 'Tuple',
  IN_BOUNDS: 'InArrBounds'
} as const;
const testItems = <T>(
  typeName: string,
  arr: unknown[],
  guard:
    | ((item: unknown, index: number) => boolean)
    | Fn.IsGuard<T, [i: number]>
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

//#region> Array Of Type
const of = createNames(TYPES.OF);
export const isArrayOf = createGuard(
  of.isName,
  of.typeName,
  <T>(v: unknown, guard: Fn.IsGuard<T, [i?: number]>): v is T[] =>
    Array.isArray(v) && v.every(guard)
);
export const checkIsArrayOf = createGuard(
  of.checkIsName,
  of.typeName,
  isArrayOf as (v: unknown, guard: Fn.IsGuard<unknown, [i?: number]>) => boolean
);
export function assertIsArrayOf<V>(
  v: unknown,
  guard: Fn.IsGuard<V, [i?: number]>
): asserts v is V[] {
  if (Array.isArray(v)) testItems(isArrayOf.typeName, v, guard);
  else throw createTypeError(isArrayOf.typeName, v);
}
//#endregion

//#region> Tuple
const tuple = createNames(TYPES.TUPLE);
export const isTuple = createGuard(
  tuple.isName,
  tuple.typeName,
  <T extends readonly unknown[]>(
    v: unknown,
    guard: Readonly<{ [K in keyof T]: Fn.IsGuard<T[K]> }>
  ): v is Readonly<T> =>
    Array.isArray(v)
    && v.length === guard.length
    && v.every((item, i) => guard[i](item))
);
export const checkIsTuple = createGuard(
  tuple.checkIsName,
  tuple.typeName,
  isTuple as unknown as <T extends readonly unknown[]>(
    v: unknown,
    guard: { [K in keyof T]: Fn.IsGuard<T[K]> }
  ) => boolean
);
export function assertIsTuple<T extends readonly unknown[]>(
  v: unknown,
  guard: { [K in keyof T]: Fn.IsGuard<T[K]> }
): asserts v is Readonly<T> {
  if (Array.isArray(v)) {
    if (v.length !== guard.length) {
      throw createTypeError(
        isTuple.typeName,
        v,
        `  Expected length ${guard.length}, but got ${v.length}`
      );
    }
    testItems(isTuple.typeName, v, (item, i) => guard[i](item));
  } else throw createTypeError(isTuple.typeName, v);
}
//#endregion

//#region> Bounds
const bounds = createNames(TYPES.IN_BOUNDS);
export const isInArrBounds = createGuard(
  bounds.isName,
  bounds.typeName,
  (arr: readonly unknown[] | unknown[], index: number): boolean =>
    Number.isSafeInteger(index) && index >= 0 && index < arr.length
);
export function assertIsInArrBounds(
  arr: readonly unknown[] | unknown[],
  index: number
) {
  if (!isInArrBounds(arr, index))
    throw new RangeError(
      `Index ${index} is out of bounds for array of length ${arr.length}.`
    );
}
//#endregion
