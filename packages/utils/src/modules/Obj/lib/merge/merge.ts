import type {
  DeepMerge,
  InitOptions,
  DepthMerge,
  ShallowMerge,
  ExtractNullBehavior,
  MergeAllToDepth
} from './types/index.js';

import type { Nullish } from '@toolbox-ts/types';
import type { IntersectElementUnions, WithoutNullish } from '@toolbox-ts/types/defs/tuple';
import { initMerge, initMergeAll } from './internal/index.js';

export type MergeOptions<B = object, N = B> = Omit<InitOptions<B, N>, 'maxDepth'>;
export const mergeDeep = <B = object, N = B, O extends MergeOptions<B, N> = MergeOptions<B, N>>(
  current: B | Nullish,
  next: N | Nullish,
  opts?: O
): DeepMerge<B, N, ExtractNullBehavior<O>> => initMerge(current, next, Infinity, opts);
export const mergeShallow = <B = object, N = B, O extends MergeOptions<B, N> = MergeOptions<B, N>>(
  current: B | Nullish,
  next: N | Nullish,
  opts?: O
): ShallowMerge<B, N, ExtractNullBehavior<O>> => initMerge(current, next, 0, opts);

export const mergeToDepth = <
  B = object,
  N = B,
  D extends number = number,
  O extends MergeOptions<B, N> = MergeOptions<B, N>
>(
  current: B | Nullish,
  next: N | Nullish,
  depth: D,
  opts?: O
): DepthMerge<B, N, ExtractNullBehavior<O>, D> => initMerge(current, next, depth, opts);

/**
 * Merges two objects of the same shape to a specified depth (default Infinity).
 */
export function merge<D = object>(
  current: D | Nullish,
  next: D,
  { depth = Infinity, ...opts }: InitOptions<D> & { depth?: number } = {}
): D {
  return initMerge(current, next, depth, opts);
}

export function mergeAll<B, N extends readonly (Nullish | B)[]>(
  base: B | Nullish,
  next: [...N],
  { depth = Infinity, ...rest }: InitOptions & { depth?: number } = {}
): B {
  return initMergeAll(base, next, depth, rest);
}
export const mergeAllDeep = <
  B,
  N extends readonly unknown[] = readonly B[],
  O extends MergeOptions<B, IntersectElementUnions<WithoutNullish<N>>> = MergeOptions<
    B,
    IntersectElementUnions<WithoutNullish<N>>
  >
>(
  base: B | Nullish,
  next: [...(N | Nullish[])],
  opts?: O
): DeepMerge<B, IntersectElementUnions<WithoutNullish<N>>, ExtractNullBehavior<O>> =>
  initMergeAll(base, next, Infinity, opts);
export const mergeAllShallow = <
  B,
  N extends readonly unknown[] = readonly B[],
  O extends MergeOptions<B, IntersectElementUnions<WithoutNullish<N>>> = MergeOptions<
    B,
    IntersectElementUnions<WithoutNullish<N>>
  >
>(
  base: B | Nullish,
  next: [...(N | Nullish[])],
  opts?: O
): ShallowMerge<B, IntersectElementUnions<WithoutNullish<N>>, ExtractNullBehavior<O>> =>
  initMergeAll(base, next, 0, opts);
export const mergeAllToDepth = <
  B,
  N extends readonly unknown[] = readonly B[],
  D extends number = number,
  O extends MergeOptions<B, IntersectElementUnions<N>> = MergeOptions<B, IntersectElementUnions<N>>
>(
  base: B | Nullish,
  next: [...(N | Nullish[])],
  depth: D,
  opts?: O
): MergeAllToDepth<B, N, ExtractNullBehavior<O>, D> => initMergeAll(base, next, depth, opts);
