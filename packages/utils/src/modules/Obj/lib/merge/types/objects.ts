import type { MergeStrategy, CloneStrategy } from './base.js';
import type { Obj } from '@toolbox-ts/types';

export type CloneObjectTypeHandler = { [K: string]: (value: object) => object } & {
  default?: ((o: object, ...args: unknown[]) => object) | CloneStrategy;
};
export type ClonePlainObjectHandler = (value: Obj.StringRecord) => Obj.StringRecord;
export type ClonePlainObjectStrategy = CloneStrategy<ClonePlainObjectHandler>;
export type CloneBaseStrategy = CloneStrategy<ClonePlainObjectHandler>;
export type CloneObjectTypeStrategy = CloneStrategy<CloneObjectTypeHandler>;

export type ObjectTypeMergeHandler = { [K: string]: (curr: unknown, next: object) => object };
export type ObjectTypeMergeStrategy = MergeStrategy<ObjectTypeMergeHandler>;
