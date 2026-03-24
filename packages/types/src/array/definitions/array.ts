import type { Falsy, Nullish } from '../../general.js';
import type { Simplify } from '../../object/definitions/general.js';

//#region> Base
export type Arr<T = unknown> = Immutable<T> | Mutable<T>;
export type Element<T extends Arr> = T[number] | undefined;
export type ElementNotUndefined<T extends Arr> = Exclude<T[number], undefined>;
export type Entries<T extends Arr> = [number, ElementNotUndefined<T>][];
export type From<T> = T extends undefined
  ? []
  : T extends unknown[]
    ? ElementNotUndefined<T>[]
    : T extends readonly unknown[]
      ? readonly ElementNotUndefined<T>[]
      : T[];
export type Immutable<T = unknown> = readonly T[];
export type Mutable<T = unknown> = T[];
//#endregion

//#region> Insertion
export type Append<T extends Arr, E extends Arr> = [...T, ...E];
export type Insert<T extends Arr, E extends Arr> = (E[number] | T[number])[];
export type Prepend<T extends Arr, E extends Arr> = [...E, ...T];
//#region> Zip
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
//#endregion
//#endregion

//#region> Operations
export type Chunk<T extends Arr> = ElementNotUndefined<T>[][];
export type Group<T extends Arr, K extends number | string | symbol> = Record<
  K,
  ElementNotUndefined<T>[]
>;
export type Merged<T extends Arr, U extends Arr | Arr<Arr>> = Simplify<
  U extends Arr<Arr> ? (T[number] | U[number][number])[] : (T[number] | U[number])[]
>;
export type Split<T extends Arr> = [ElementNotUndefined<T>[], ElementNotUndefined<T>[]];
//#endregion

//#region> With
export type With<T extends Arr, E> = (E | T[number])[];
export type WithFalsy<T extends Arr = Arr> = With<T, Falsy>;
export type WithNull<T extends Arr = Arr> = With<T, null>;
export type WithNullish<T extends Arr = Arr> = With<T, Nullish>;
export type WithUndefined<T extends Arr = Arr> = With<T, undefined>;
//#endregion

//#region> Without
export type Without<T extends Arr, E> = Exclude<T[number], E>[];
export type WithoutFalsy<T extends Arr = Arr> = Without<T, Falsy>;
export type WithoutNull<T extends Arr = Arr> = Without<T, null>;
export type WithoutNullish<T extends Arr = Arr> = Without<T, Nullish>;
export type WithoutUndefined<T extends Arr = Arr> = Without<T, undefined>;
//#endregion
