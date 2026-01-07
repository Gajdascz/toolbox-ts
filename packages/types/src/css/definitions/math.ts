import type { SharedKeyword } from './shared.js';
/** https://www.w3.org/TR/css-values-4/#comp-func */
type Comparison = 'clamp' | 'max' | 'min';

/** https://drafts.csswg.org/css-values/#exponent-funcs */
type Exponential = 'exp' | 'hypot' | 'log' | 'pow' | 'sqrt';

type Function<T extends Type> = `${T}(${string})`;

type Keyword = '-infinity' | 'e' | 'infinity' | 'NaN' | 'pi' | SharedKeyword;

/**  https://www.w3.org/TR/css-values-4/#sign-funcs */
type SignRelated = 'abs' | 'sign';

/** https://www.w3.org/TR/css-values-4/#round-func */
type SteppedValue = 'mod' | 'rem' | 'round';

/** https://www.w3.org/TR/css-values-4/#trig-funcs */
type Trigonometric = 'acos' | 'asin' | 'atan' | 'atan2' | 'cos' | 'sin' | 'tan';

type Type =
  /** https://www.w3.org/TR/css-values-4/#calc-func */
  | 'calc'
  | Comparison
  | Exponential
  | SignRelated
  | SteppedValue
  | Trigonometric;

export type { Function, Keyword, Type };
