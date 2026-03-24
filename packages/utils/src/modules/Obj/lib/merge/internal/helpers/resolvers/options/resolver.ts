import type { Key, StringRecord } from '@toolbox-ts/types/defs/object';
import { clone } from '../../../../../clone/clone.js';
import type {
  Context,
  CloneObjectTypeStrategy,
  ClonePlainObjectHandler,
  InitOptions,
  CloneArrayStrategy,
  ClonePlainObjectStrategy,
  MergeHandlerWithContext
} from '../../../../types/index.js';
import {
  getArrayCloneHandler,
  getCloneHandler,
  getObjectTypeCloneHandler
} from '../clone-handlers/index.js';
import {
  getArrayMergeHandler,
  getKeyMergeHandler,
  getObjectTypeMergeHandler,
  getPrimitiveMergeHandler
} from '../merge-handlers/index.js';
import type { ReplaceHandler } from '../../handle-replace/index.js';
/**
 * Resolves merge options into a merge {@link Context}.
 *
 * 1. Applies default cloning strategies {@link MergeCloneStrategyOptions}
 * 2. Applies default merge strategies and resolves handlers {@link MergeDataTypeHandlerOptions}
 */
export const resolveOptions = <B, N>(
  opts: InitOptions<B, N> & { maxDepth?: number } = {},
  _merge: MergeHandlerWithContext<N, unknown>,
  _replace: ReplaceHandler
): Context<N> & { cloneBase: ClonePlainObjectHandler } => {
  const { maxDepth = Infinity, clone: cl = true, on = {} } = opts;
  let clBase: ClonePlainObjectStrategy,
    clArray: CloneArrayStrategy,
    clObjType: Partial<CloneObjectTypeStrategy>,
    clPlainObject: ClonePlainObjectStrategy;
  switch (cl) {
    case true:
      clBase = 'deep';
      clArray = 'shallow';
      clObjType = 'shallow';
      clPlainObject = 'shallow';
      break;
    case 'none':
    case false:
      clBase = 'none';
      clArray = 'none';
      clObjType = 'none';
      clPlainObject = 'none';
      break;
    case 'structured':
      clBase = 'structured';
      clArray = 'structured';
      clObjType = 'structured';
      clPlainObject = 'structured';
      break;
    case 'deep':
      clBase = 'deep';
      clArray = 'structured';
      clObjType = 'deep';
      clPlainObject = 'deep';
      break;
    default:
      ({
        base: clBase = 'deep',
        array: clArray = 'shallow',
        objectType: clObjType = 'shallow',
        plainObject: clPlainObject = 'shallow'
      } = cl);
  }

  const {
    array: onArray = 'replace',
    objectType: onObjectType = 'replace',
    primitive: onPrimitive = 'replace',
    key: onKey = {},
    null: onNull = 'overwrite',
    emptyObject: onEmptyObject = 'skip',
    emptyArray: onEmptyArray = 'skip'
  } = on;
  const cloneBase =
    clBase === 'none'
      ? (value: unknown) => value as StringRecord
      : typeof clBase === 'function'
        ? clBase
        : (value: unknown) => clone(value, { strategy: clBase }) as StringRecord;
  const cloneArray = getArrayCloneHandler(clArray);
  const clonePlainObject = getCloneHandler(clPlainObject);
  const cloneObjectType = getObjectTypeCloneHandler(clObjType, 'shallow');
  const mergePrimitive = getPrimitiveMergeHandler(onPrimitive);
  const mergeObjectType = getObjectTypeMergeHandler(onObjectType, cloneObjectType);
  const overwriteWithEmptyObjects = onEmptyObject === 'overwrite';
  const overwriteWithEmptyArrays = onEmptyArray === 'overwrite';
  const mergeKey = getKeyMergeHandler<B, N>(
    onKey,
    { clonePlainObject, cloneArray, cloneObjectType },
    _replace
  );
  const ctx: Omit<Context<N>, 'mergeArray'> & {
    mergeArray: unknown;
    cloneBase: ClonePlainObjectHandler;
  } = {
    depth: { max: maxDepth, curr: 0 },
    overwriteWithEmptyObjects,
    overwriteWithEmptyArrays,
    clonePlainObject,
    cloneBase,
    cloneArray,
    cloneObjectType,
    mergePrimitive,
    nullBehavior: onNull,
    mergeObjectType,
    mergeKey,
    hasKeyHandler: (key: string): key is Key.String<N> => key in onKey,
    mergeArray: undefined
  };
  const mergeArray = getArrayMergeHandler(onArray, cloneArray, ctx, _merge);
  ctx.mergeArray = mergeArray;
  return ctx as Context<N> & { cloneBase: ClonePlainObjectHandler };
};
