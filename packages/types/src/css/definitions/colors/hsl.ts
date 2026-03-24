import type { Percent, PercentWithVar } from '../units.js';
import type { NumberWithVar } from '../shared.js';
import type { Opacity, OpacityWithVar } from './shared.js';

/** https://www.w3.org/TR/css-color-4/#funcdef-hsl */
export type Hsl = `hsl(${number}, ${Percent}, ${Percent})` | `hsl(${number} ${Percent} ${Percent})`;
/** https://www.w3.org/TR/css-color-4/#funcdef-hsl */
export type HslWithVar =
  | `hsl(${NumberWithVar}, ${PercentWithVar}, ${PercentWithVar})`
  | `hsl(${NumberWithVar} ${PercentWithVar} ${PercentWithVar})`;

/** https://www.w3.org/TR/css-color-4/#funcdef-hsla */
export type Hsla =
  | `hsl(${number}, ${Percent}, ${Percent}, ${Opacity})`
  | `hsl(${number} ${Percent} ${Percent} / ${Opacity})`;
/** https://www.w3.org/TR/css-color-4/#funcdef-hsla */
export type HslaWithVar =
  | `hsl(${NumberWithVar}, ${PercentWithVar}, ${PercentWithVar}, ${OpacityWithVar})`
  | `hsl(${NumberWithVar} ${PercentWithVar} ${PercentWithVar} / ${OpacityWithVar})`;
