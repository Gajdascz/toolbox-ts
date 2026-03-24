import { isSet as isSt } from 'node:util/types';

import { createTypeError, resolveTypeName } from '../../../utils/errors/index.js';
import { createGenericIsGuards } from '../../factories.js';

const _of = createGenericIsGuards(
  'SetOf',
  <V>(v: unknown, valueValidator: (val: unknown) => val is V): v is Set<V> => {
    if (!isSt(v)) return false;
    for (const val of v) if (!valueValidator(val)) return false;
    return true;
  }
);
export const isSetOf = _of.is;
export const checkIsSetOf = _of.check;
export function assertIsSetOf<V>(
  v: unknown,
  valueValidator: (val: unknown) => val is V
): asserts v is Set<V> {
  if (!isSt(v)) throw createTypeError(isSetOf.typeName, v);
  const invalid = [];
  for (const val of v) if (!valueValidator(val)) invalid.push(resolveTypeName(val));
  if (invalid.length > 0)
    throw createTypeError(isSetOf.typeName, v, `\n  Found invalid values: ${invalid.join(', ')}`);
}
