import type { Fn } from '@toolbox-ts/types';

import { isMap as isMp } from 'node:util/types';

import { createTypeError } from '../../../utils/errors/index.js';
import { createGenericIsGuards, createTypeNames } from '../../factories.js';
const { WithEntries, WithKeys, WithValues } = createTypeNames('Map', [
  'WithKeys',
  'WithValues',
  'WithEntries'
]);
//#region> MapWithKeys
const _withKeys = createGenericIsGuards(
  WithKeys,
  <K extends string>(v: unknown, keys: readonly K[]): v is Map<K, unknown> =>
    isMp(v) && keys.every((k) => v.has(k))
);
export const isMapWithKeys = _withKeys.is;
export const checkIsMapWithKeys = _withKeys.check;
export function assertIsMapWithKeys<K extends string>(
  v: unknown,
  keys: readonly K[]
): asserts v is Map<K, unknown> {
  if (!isMapWithKeys(v, keys))
    throw createTypeError(isMapWithKeys.typeName, v, `keys: [${keys.join(', ')}]`);
}
//#endregion

//#region> MapWithValues
const _withValues = createGenericIsGuards(
  WithValues,
  <V>(v: unknown, valueGuard: (x: unknown) => x is V): v is Map<unknown, V> =>
    isMp(v) && [...v.values()].every((val) => valueGuard(val))
);
export const isMapWithValues = _withValues.is;
export const checkIsMapWithValues = _withValues.check;
export function assertIsMapWithValues<V>(
  v: unknown,
  valueGuard: (x: unknown) => x is V,
  expectedTypeName: string = valueGuard.name
): asserts v is Map<unknown, V> {
  if (!isMapWithValues(v, valueGuard))
    throw createTypeError(isMapWithValues.typeName, v, `values: ${expectedTypeName}`);
}

//#endregion

//#region> MapWithEntries

const _withEntries = createGenericIsGuards(
  WithEntries,
  <T extends Record<string, (x: unknown) => x is unknown>>(
    v: unknown,
    validators: T
  ): v is Map<
    keyof T & string,
    T[keyof T & string] extends ((x: unknown) => x is infer U) ? U : never
  > => {
    if (!isMp(v)) return false;
    return (Object.keys(validators) as (keyof T & string)[]).every((k) => {
      const item = v.get(k);
      return item !== undefined && validators[k](item);
    });
  }
);
export const isMapWithEntries = _withEntries.is;
export const checkIsMapWithEntries = _withEntries.check;

export function assertIsMapWithEntries<T extends Record<string, (x: unknown) => x is unknown>>(
  v: unknown,
  validators: T
): asserts v is Map<keyof T & string, Fn.InferValueFromGuard<T[keyof T & string]>> {
  if (!isMapWithEntries(v, validators)) {
    throw createTypeError(
      isMapWithEntries.typeName,
      v,
      `valid entries at keys: ${Object.keys(validators).join(', ')}`
    );
  }
}
//#endregion
