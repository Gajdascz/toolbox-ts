import type { NumberWithVar } from '../shared.js';
import type { Opacity, OpacityWithVar } from './shared.js';

/** https://www.w3.org/TR/css-color-4/#funcdef-rgb */
export type Rgb = `rgb(${number}, ${number}, ${number})` | `rgb(${number} ${number} ${number})`;
/** https://www.w3.org/TR/css-color-4/#funcdef-rgb */
export type RgbWithVar =
  | `rgb(${NumberWithVar}, ${NumberWithVar}, ${NumberWithVar})`
  | `rgb(${NumberWithVar} ${NumberWithVar} ${NumberWithVar})`;

/** https://www.w3.org/TR/css-color-4/#funcdef-rgba */
export type Rgba =
  | `rgb(${number}, ${number}, ${number}, ${Opacity})`
  | `rgb(${number} ${number} ${number} / ${Opacity})`;
/** https://www.w3.org/TR/css-color-4/#funcdef-rgba */
export type RgbaWithVar =
  | `rgb(${NumberWithVar}, ${NumberWithVar}, ${NumberWithVar}, ${OpacityWithVar})`
  | `rgb(${NumberWithVar} ${NumberWithVar} ${NumberWithVar} / ${OpacityWithVar})`;
