import { isSet as isSt } from 'node:util/types';

import {
  createTypeError,
  resolveTypeName
} from '../../../utils/errors/index.js';
import { createGuard, createNames } from '../../factories.js';
const TYPES = { OF: 'SetOf' } as const;

const of = createNames(TYPES.OF);
export const isSetOf = createGuard(
  of.isName,
  of.typeName,
  <V>(v: unknown, valueValidator: (val: unknown) => val is V): v is Set<V> => {
    if (!isSt(v)) return false;
    for (const val of v) if (!valueValidator(val)) return false;
    return true;
  }
);
export const checkIsSetOf = createGuard(
  of.checkIsName,
  of.typeName,
  (v: unknown, valueValidator: (val: unknown) => val is unknown): boolean =>
    isSetOf(v, valueValidator)
);
export function assertIsSetOf<V>(
  v: unknown,
  valueValidator: (val: unknown) => val is V
): asserts v is Set<V> {
  if (!isSt(v)) throw createTypeError(isSetOf.typeName, v);
  const invalid = [];
  for (const val of v)
    if (!valueValidator(val)) invalid.push(resolveTypeName(val));
  if (invalid.length > 0)
    throw createTypeError(
      isSetOf.typeName,
      v,
      `\n  Found invalid values: ${invalid.join(', ')}`
    );
}
