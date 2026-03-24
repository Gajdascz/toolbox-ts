import {
  isObjectEmpty,
  isObject,
  isObjectAny
} from '../../../../../../../core/guards/objs/base/index.js';
import { Arr } from '../../../../../../Arr/index.js';

import type { Context } from '../../../types/index.js';

export type HandleReplaceRequiredContext = Pick<
  Context<unknown>,
  'cloneArray' | 'cloneObjectType' | 'clonePlainObject'
>;
export type ReplaceHandler = (next: unknown, ctx: HandleReplaceRequiredContext) => unknown;
/**
 * 1. If the value is not any kind of object, return it as is.
 * 2. If the value is an array:
 *    i. If the array is empty, return a new empty array.
 *    ii. Otherwise, return a cloned array.
 * 3. If the value is not a plain object, return a cloned object of the same type.
 * 4. If the value is a plain object:
 *    i. If the object is empty, return a new empty object.
 *    ii. Otherwise return a cloned version of the object.
 */
export const handleReplace = (next: unknown, ctx: HandleReplaceRequiredContext) => {
  if (!isObjectAny(next)) return next;
  else if (Arr.is.any(next)) return Arr.is.empty(next) ? [] : ctx.cloneArray(next);
  else if (!isObject(next)) return ctx.cloneObjectType(next);
  return isObjectEmpty(next) ? {} : ctx.clonePlainObject(next);
};
