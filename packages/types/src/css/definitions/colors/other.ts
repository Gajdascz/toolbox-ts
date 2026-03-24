import type { ColorSpace } from './keywords.js';
import type { NumberWithVar } from '../shared.js';
import type { Percent, PercentWithVar } from '../units.js';
/** https://www.w3.org/TR/css-color-4/#funcdef-color */
export type ColorFn =
  | `color(${ColorSpace} ${string})`
  | `color(from ${string} ${ColorSpace} ${string})`;

/** https://www.w3.org/TR/css-color-4/#funcdef-lab */
export type Lab = `lab(${Percent} ${number} ${string})`;
/** https://www.w3.org/TR/css-color-4/#funcdef-lab */
export type LabWithVar = `lab(${PercentWithVar} ${NumberWithVar} ${string})`;

/** https://www.w3.org/TR/css-color-4/#funcdef-lch */
export type Lch = `lch(${Percent} ${number} ${string})`;
/** https://www.w3.org/TR/css-color-4/#funcdef-lch */
export type LchWithVar = `lch(${PercentWithVar} ${NumberWithVar} ${string})`;
