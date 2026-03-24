import type { NullBehavior, CloneHandler, MergeHandler, Depth } from './base.js';
import type { ArrayMergeHandler } from './arrays.js';
import type { ClonePlainObjectHandler } from './objects.js';
import type { Arr, Obj } from '@toolbox-ts/types';
import type { PrimitiveMergeHandler } from './primitives.js';
import type { KeyMergeHandler } from './key-handler.js';
import type { StringRecord } from '@toolbox-ts/types/defs/object';

export interface Context<N> {
  overwriteWithEmptyObjects: boolean;
  overwriteWithEmptyArrays: boolean;
  depth: Depth;
  nullBehavior: NullBehavior;
  clonePlainObject: ClonePlainObjectHandler;
  cloneArray: CloneHandler<Arr.Arr>;
  cloneObjectType: CloneHandler<object>;
  mergeArray: ArrayMergeHandler;
  mergePrimitive: PrimitiveMergeHandler;
  mergeObjectType: MergeHandler<object>;
  mergeKey: KeyMergeHandler<N>;
  hasKeyHandler: (key: string) => key is Obj.Key.String<N>;
}
export type MergeHandlerWithContext<N, T> = (
  current: StringRecord,
  next: StringRecord,
  ctx: Context<N>
) => T;
