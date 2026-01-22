//#region> Arithmetic
export type Add<A extends number, B extends number> = [
  ...URange<A>,
  ...URange<B>
]['length'];

export type Decrement<A extends number> = Subtract<A, 1>;
export type Increment<A extends number> = Add<A, 1>;

export type Subtract<A extends number, B extends number> =
  URange<A> extends [...URange<B>, ...infer R] ? R['length'] : never;
//#endregion
export type BitDepth = 16 | 24 | 32 | 8;
export type Digit = 0 | NegativeDigit | PositiveDigit;

export type GreaterThan<A extends number, B extends number> =
  URange<B> extends [...URange<A>, ...infer _] ? false : true;
export type IsDivisible<A extends number, B extends number> =
  A extends 0 ? true
  : Subtract<A, B> extends never ? false
  : IsDivisible<Subtract<A, B>, B>;

export type LessThan<A extends number, B extends number> =
  URange<A> extends [...URange<B>, ...infer _] ? false : true;

export type NegativeDigit = -1 | -2 | -3 | -4 | -5 | -6 | -7 | -8 | -9;

export type NonZero<N extends bigint | number = number> =
  N extends bigint ? Exclude<N, 0n> : Exclude<N, 0>;

export type NonZeroDigit = NonZeroNegativeDigit | NonZeroPositiveDigit;

export type NonZeroNegativeDigit = NonZero<NegativeDigit>;

export type NonZeroPositiveDigit = NonZero<PositiveDigit>;

export type PositiveDigit = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type StringNumber =
  | `-.${0 | PositiveDigit}${string}`
  | `.${0 | PositiveDigit}${string}`
  | `${Digit}${string}`;

export type URange<
  N extends number,
  R extends readonly unknown[] | unknown[] = []
> = R['length'] extends N ? R : URange<N, [...R, R['length']]>;

export type Zero = 0 | 0n;
