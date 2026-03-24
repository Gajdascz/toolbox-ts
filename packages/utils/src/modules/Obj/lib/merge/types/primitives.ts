import type { MergeStrategy } from './base.js';
import type { AnyDefined, DefinedPrimitive } from '@toolbox-ts/types';

export type PrimitiveMergeHandler = (current: AnyDefined, next: DefinedPrimitive) => unknown;
export type PrimitiveMergeStrategy = MergeStrategy<PrimitiveMergeHandler>;
