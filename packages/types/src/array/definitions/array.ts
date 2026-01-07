import type { Falsy, Nullish } from '../../general.js';

export type Append<T extends Arr, E extends Arr> = [...T, ...E];

export type Arr<T = unknown> = Immutable<T> | Mutable<T>;
export type ArrFrom<T> =
  T extends undefined ? []
  : T extends unknown[] ? ElementNotUndefined<T>[]
  : T extends readonly unknown[] ? readonly ElementNotUndefined<T>[]
  : Arr<T>;

export type Chunk<T extends Arr> = Arr<ElementNotUndefined<T>[]>;
export type Element<T extends Arr> = T[number] | undefined;
export type ElementNotUndefined<T extends Arr> = Exclude<T[number], undefined>;
export type Grouped<T extends Arr, K extends number | string | symbol> = Record<
  K,
  ElementNotUndefined<T>[]
>;
export type Immutable<T = unknown> = readonly T[];
export type Insert<T extends Arr, E extends Arr> = (E[number] | T[number])[];

export type Merge<T extends Arr, U extends Arr | Arr<Arr>> =
  U extends Arr<Arr> ? Insert<T, U[number]> : Insert<T, U>;

export type Mutable<T = unknown> = T[];

export type Prepend<T extends Arr, E extends Arr> = [...E, ...T];
export type Split<T extends Arr> = [
  ElementNotUndefined<T>[],
  ElementNotUndefined<T>[]
];
export type Zip<A extends Arr, B extends Arr> = Arr<
  [ElementNotUndefined<A>, ElementNotUndefined<B>]
>;
export type ZipFill<A extends Arr, B extends Arr, F> = Arr<
  [ElementNotUndefined<A> | F, ElementNotUndefined<B> | F]
>;
export type ZipRemainder<A extends Arr, B extends Arr> = [
  Zip<A, B>,
  [ElementNotUndefined<A> | ElementNotUndefined<B>][]
];
export interface ZipRemainderObj<A extends Arr, B extends Arr> {
  remainder: (ElementNotUndefined<A> | ElementNotUndefined<B>)[];
  zipped: Zip<A, B>;
}
//#region> With
export type With<T extends Arr, E> = Arr<E | ElementNotUndefined<T>>;
export type WithFalsy<T extends Arr = Arr> = With<T, Falsy>;
export type WithNull<T extends Arr = Arr> = With<T, null>;
export type WithNullish<T extends Arr = Arr> = With<T, Nullish>;
export type WithUndefined<T extends Arr = Arr> = With<T, undefined>;
//#endregion

//#region> Without
export type Without<T extends Arr, E> = Arr<Exclude<ElementNotUndefined<T>, E>>;
export type WithoutFalsy<T extends Arr = Arr> = Without<T, Falsy>;
export type WithoutNull<T extends Arr = Arr> = Without<T, null>;
export type WithoutNullish<T extends Arr = Arr> = Without<T, Nullish>;
export type WithoutUndefined<T extends Arr = Arr> = Without<T, undefined>;
//#endregion
