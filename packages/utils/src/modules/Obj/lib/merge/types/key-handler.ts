import type { AnyDefined, Obj, NonNullish } from '@toolbox-ts/types';

export type KeyMergeHandlerMapOptions<B, N> = {
  [key in Obj.Key.String<N>]?:
    | ((
        current: key extends keyof B ? NonNullish<B[key]> : undefined,
        next: NonNullish<N[key]>
      ) => unknown)
    | 'replace';
};
export type KeyMergeHandlerMap<
  B,
  N,
  O extends KeyMergeHandlerMapOptions<B, N> = KeyMergeHandlerMapOptions<B, N>
> = {
  [K in keyof O]: NonNullish<Exclude<O[K], 'replace'>>;
};
export type KeyMergeHandler<N> = <K extends Obj.Key.String<N>>(
  key: K,
  current: NonNullish<AnyDefined>,
  next: NonNullish<N[K]>
) => unknown;
