import type { IsNull, IsNullish, IsPlainObject, IsArray } from '@toolbox-ts/types';
import type { WithoutUndefined, Arr, Merged } from '@toolbox-ts/types/defs/array';
import type { Simplify, DeepSimplify } from '@toolbox-ts/types/defs/object';
import type { Decrement } from '@toolbox-ts/types/defs/number';
import type { NullBehavior } from './base.js';
import type { InitOptions } from './options.js';

//#region> Shared
/**
 * - If B is Nullish, return N.
 * - If N is Nullish, return B.
 * - Else Continue
 */
export type CheckInitialNullish<B, N> =
  IsNullish<B> extends true ? N : IsNullish<N> extends true ? B : void;

/**
 * - If B is a plain object && N is not a plain object, return B.
 * - If N is a plain object && B is not a plain object, return N.
 * - Else Continue
 */
export type CheckInitialObjects<B, N> =
  IsPlainObject<B> extends true ? (IsPlainObject<N> extends true ? void : B) : N;
/**
 * Use to determine if a deep merge should proceed.
 * - If B is Nullish, return N.
 * - If N is Nullish, return B.
 * - Else Continue
 *    - If N is not a plain object, return B.
 *    - If B is not a plain object, return N.
 *    - Else return void to continue merging.
 */
export type CheckInitialMergeInput<B, N> =
  CheckInitialNullish<B, N> extends infer R
    ? R extends B | N
      ? R
      : CheckInitialObjects<B, N> extends infer S
        ? S extends B | N
          ? S
          : void
        : N
    : N;

export type MergeArray<B, N extends Arr> =
  CheckInitialNullish<B, N> extends infer R
    ? R extends B | N
      ? R
      : B extends unknown[] | readonly unknown[]
        ? WithoutUndefined<Merged<B, N>>
        : N
    : N;
export type ExtractNullBehavior<O extends InitOptions> = O extends { on: { null: infer NB } }
  ? NB
  : 'overwrite';
export type HandleNull<K, B, Null extends NullBehavior> = Null extends 'omit'
  ? never
  : Null extends 'overwrite' | undefined
    ? null
    : K extends keyof B
      ? Null extends 'skip'
        ? B[K]
        : never
      : never;
//#endregion
//#region> Shallow
export type MergeShallow<B, N, Null extends NullBehavior> = {
  [K in keyof B | keyof N]: K extends keyof N
    ? N[K] extends null
      ? HandleNull<K, B, Null>
      : N[K] extends undefined
        ? K extends keyof B
          ? B[K]
          : never
        : N[K]
    : K extends keyof B
      ? B[K]
      : never;
};
export type ShallowMerge<B, N, Null extends NullBehavior> = Simplify<{
  [K in keyof MergeShallow<B, N, Null> as MergeShallow<B, N, Null>[K] extends
    | never
    | undefined
    | void
    ? never
    : K]: MergeShallow<B, N, Null>[K];
}>;
//#endregion
//#region> Deep
export type MergeValue<B, N, Null extends NullBehavior> = undefined extends N
  ? B | Exclude<N, undefined>
  : IsPlainObject<N> extends true
    ? MergePlainObjects<B, N, Null>
    : IsArray<N> extends true
      ? MergeArray<B, Extract<N, Arr>>
      : N;

export type MergePlainObjects<B, N, Null extends NullBehavior> =
  CheckInitialMergeInput<B, N> extends infer R
    ? R extends B | N
      ? R
      : {
          [K in keyof B | keyof N]: K extends keyof N
            ? IsNull<N[K]> extends true
              ? HandleNull<K, B, Null>
              : K extends keyof B
                ? MergeValue<B[K], N[K], Null>
                : N[K]
            : K extends keyof B
              ? B[K]
              : never;
        }
    : N;

export type DeepMerge<B, N, Null extends NullBehavior> = DeepSimplify<{
  [K in keyof MergePlainObjects<B, N, Null> as MergePlainObjects<B, N, Null>[K] extends
    | never
    | undefined
    | void
    ? never
    : K]: MergePlainObjects<B, N, Null>[K];
}>;
//#endregion
//#region> ToDepth
export type MergeValueDepth<
  B,
  N,
  Null extends NullBehavior,
  MaxDepth extends number,
  CurrentDepth extends number = MaxDepth
> = CurrentDepth extends 0
  ? // At max depth: replace N keys, keep B keys not in N
    Omit<B, keyof N> & N
  : CheckInitialMergeInput<B, N> extends infer R
    ? R extends B | N
      ? R
      : {
          [K in keyof B | keyof N]: K extends keyof N
            ? IsNull<N[K]> extends true
              ? HandleNull<K, B, Null>
              : K extends keyof B
                ? MergeValueDepth<B[K], N[K], Null, MaxDepth, Decrement<CurrentDepth>>
                : N[K]
            : K extends keyof B
              ? B[K]
              : never;
        }
    : N;
export type MergeToDepth<
  B,
  N,
  Null extends NullBehavior,
  MaxDepth extends number,
  CurrentDepth extends number = MaxDepth
> = CurrentDepth extends 0
  ? Omit<B, keyof N> & N
  : CheckInitialMergeInput<B, N> extends infer R
    ? R extends B | N
      ? R
      : {
          [K in keyof B | keyof N]: K extends keyof N
            ? IsNull<N[K]> extends true
              ? HandleNull<K, B, Null>
              : K extends keyof B
                ? MergeValueDepth<B[K], N[K], Null, MaxDepth, Decrement<CurrentDepth>>
                : N[K]
            : K extends keyof B
              ? B[K]
              : never;
        }
    : N;
export type DepthMerge<B, N, Null extends NullBehavior, MaxDepth extends number> = DeepSimplify<{
  [K in keyof MergeToDepth<B, N, Null, MaxDepth> as MergeToDepth<B, N, Null, MaxDepth>[K] extends
    | never
    | undefined
    | void
    ? never
    : K]: MergeToDepth<B, N, Null, MaxDepth>[K];
}>;
export type MergeAllToDepth<
  B,
  N extends readonly unknown[],
  Null extends NullBehavior,
  MaxDepth extends number
> = DeepSimplify<
  N extends readonly [...infer Rest, infer Last]
    ? Last extends object
      ? DepthMerge<MergeAllToDepth<B, Rest, Null, MaxDepth>, Last, Null, MaxDepth>
      : MergeAllToDepth<B, Rest, Null, MaxDepth>
    : B
>;
//#endregion
