import type { AnyDefined, NonNullish } from '@toolbox-ts/types';
import type { Key, StringRecord } from '@toolbox-ts/types/defs/object';
import { Arr } from '../../../../../../../Arr/index.js';

import type {
  Context,
  CloneHandler,
  ArrayMergeStrategy,
  ArrayMergeHandler,
  PrimitiveMergeStrategy,
  PrimitiveMergeHandler,
  ObjectTypeMergeStrategy,
  MergeHandler,
  KeyMergeHandlerMapOptions,
  MergeHandlerWithContext
} from '../../../../types/index.js';
import type { HandleReplaceRequiredContext, ReplaceHandler } from '../../handle-replace/index.js';

export const getArrayMergeHandler = <N, R>(
  strategy: ArrayMergeStrategy,
  cl: CloneHandler<Arr.Arr>,
  ctx: Omit<Context<N>, 'mergeArray'>,
  _merge: MergeHandlerWithContext<N, R>
): ArrayMergeHandler => {
  if (typeof strategy === 'function') return (curr, nxt) => strategy(curr, cl(nxt));
  switch (strategy) {
    case 'concat':
      return (curr, nxt) => Arr.mergeConcat(Arr.ensure(curr), cl(nxt));
    case 'prepend':
      return (curr, nxt) => Arr.mergePrepend(Arr.ensure(curr), cl(nxt));
    case 'unique':
      return (curr, nxt) => Arr.mergeUnique(Arr.ensure(curr), cl(nxt));
    case 'replace':
      return (_, nxt) => cl(nxt);
    case 'combine': {
      const handlers: Arr.Merge.CombineOptions['handlers'] = {
        array: 'recurse',
        recursiveArrayOptions: {
          maxDepth: ctx.depth.max - ctx.depth.curr,
          behaviorAtMaxDepth: 'replace'
        },
        primitive: ctx.mergePrimitive,
        objectType: ctx.mergeObjectType
      };

      const mergeArray = (c: unknown, n: Arr.Arr): Arr.Arr =>
        Arr.mergeCombine(Arr.ensure(c), cl(n), {
          clone: cl,
          handlers: {
            ...handlers,
            object: (curr: StringRecord, next: StringRecord) =>
              _merge(curr, next, { ...ctx, mergeArray })
          }
        });
      return mergeArray;
    }
  }
};
export const getPrimitiveMergeHandler = (
  strategy: PrimitiveMergeStrategy
): PrimitiveMergeHandler => {
  if (typeof strategy === 'function') return strategy;
  return (_: unknown, next) => next;
};
export const getObjectTypeMergeHandler = (
  strategy: ObjectTypeMergeStrategy,
  cl: CloneHandler<object>
): MergeHandler<object> => {
  if (strategy === 'replace') return (_: unknown, next: object) => cl(next);
  return (curr, nxt) => strategy[nxt.constructor.name]?.(curr, cl(nxt)) ?? cl(nxt);
};

export const getKeyMergeHandler =
  <B, N = B>(
    handlers: KeyMergeHandlerMapOptions<B, N>,
    ctx: HandleReplaceRequiredContext,
    handleReplace: ReplaceHandler
  ) =>
  <K extends Key.String<N>>(key: K, current: AnyDefined, next: NonNullish<N[K]>) => {
    const handler = handlers[key];
    return typeof handler !== 'function'
      ? handleReplace(next, ctx)
      : handler(current as K extends keyof B ? NonNullish<B[K]> : undefined, next);
  };
