import type { Fn } from '@toolbox-ts/types';

import { isMap as isMp } from 'node:util/types';

import { createTypeError } from '../../../utils/errors/index.js';
import { createGuard, createNames } from '../../factories.js';
const TYPES = {
  WITH_KEYS: 'MapWithKeys',
  WITH_VALUES: 'MapWithValues',
  WITH_ENTRIES: 'MapWithEntries'
};
//#region> MapWithKeys
const withKeys = createNames(TYPES.WITH_KEYS);
export const isMapWithKeys = createGuard(
  withKeys.isName,
  withKeys.typeName,
  <K extends string>(v: unknown, keys: readonly K[]): v is Map<K, unknown> =>
    isMp(v) && keys.every((k) => v.has(k))
);
export const checkIsMapWithKeys = createGuard(
  withKeys.checkIsName,
  withKeys.typeName,
  isMapWithKeys as (v: unknown, keys: readonly string[]) => boolean
);
export function assertIsMapWithKeys<K extends string>(
  v: unknown,
  keys: readonly K[]
): asserts v is Map<K, unknown> {
  if (!isMapWithKeys(v, keys))
    throw createTypeError(
      isMapWithKeys.typeName,
      v,
      `keys: [${keys.join(', ')}]`
    );
}
//#endregion

//#region> MapWithValues
const withValues = createNames(TYPES.WITH_VALUES);
export const isMapWithValues = createGuard(
  withValues.isName,
  withValues.typeName,
  <V>(v: unknown, valueGuard: (x: unknown) => x is V): v is Map<unknown, V> =>
    isMp(v) && [...v.values()].every((val) => valueGuard(val))
);
export const checkIsMapWithValues = createGuard(
  withValues.checkIsName,
  withValues.typeName,
  isMapWithValues as unknown as (
    v: unknown,
    valueGuard: (x: unknown) => boolean
  ) => boolean
);

export function assertIsMapWithValues<V>(
  v: unknown,
  valueGuard: (x: unknown) => x is V,
  expectedTypeName: string = valueGuard.name
): asserts v is Map<unknown, V> {
  if (!isMapWithValues(v, valueGuard))
    throw createTypeError(
      isMapWithValues.typeName,
      v,
      `values: ${expectedTypeName}`
    );
}

//#endregion

//#region> MapWithEntries

const withEntries = createNames(TYPES.WITH_ENTRIES);
export const isMapWithEntries = createGuard(
  withEntries.isName,
  withEntries.typeName,
  <T extends Record<string, (x: unknown) => x is unknown>>(
    v: unknown,
    validators: T
  ): v is Map<
    keyof T & string,
    T[keyof T & string] extends (x: unknown) => x is infer U ? U : never
  > => {
    if (!isMp(v)) return false;
    return (Object.keys(validators) as (keyof T & string)[]).every((k) => {
      const item = v.get(k);
      return item !== undefined && validators[k](item);
    });
  }
);
export const checkIsMapWithEntries = createGuard(
  withEntries.checkIsName,
  withEntries.typeName,
  (v: unknown, validators: Record<string, (v: unknown) => boolean>): boolean =>
    isMp(v)
    && Object.keys(validators).every((k) => v.has(k) && validators[k](v.get(k)))
);
export function assertIsMapWithEntries<
  T extends Record<string, (x: unknown) => x is unknown>
>(
  v: unknown,
  validators: T
): asserts v is Map<
  keyof T & string,
  Fn.InferValueFromGuard<T[keyof T & string]>
> {
  if (!isMapWithEntries(v, validators)) {
    throw createTypeError(
      isMapWithEntries.typeName,
      v,
      `valid entries at keys: ${Object.keys(validators).join(', ')}`
    );
  }
}
//#endregion
