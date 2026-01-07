export type BitDepth = 16 | 24 | 32 | 8;

export type Digit = NegDigit | PosDigit;

export type GreaterThan<A extends number, B extends number> =
  Range<B> extends [...Range<A>, ...infer _] ? false : true;
export type LessThan<A extends number, B extends number> =
  Range<A> extends [...Range<B>, ...infer _] ? false : true;
export type NegDigit = -0 | -1 | -2 | -3 | -4 | -5 | -6 | -7 | -8 | -9;

export type NonZero<N extends bigint | number = number> =
  N extends bigint ? Exclude<N, 0n> : Exclude<N, 0>;

export type NonZeroDigit = NonZeroNegDigit | NonZeroPosDigit;

export type NonZeroNegDigit = NonZero<NegDigit>;

export type NonZeroPosDigit = NonZero<PosDigit>;

export type PosDigit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type Range<
  N extends number,
  R extends readonly unknown[] | unknown[] = []
> = R['length'] extends N ? R : Range<N, [...R, R['length']]>;

export type Zero = 0 | 0n;
