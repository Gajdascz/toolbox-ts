import type { NumberWithVar } from '../shared.js';
import type { AngleWithVar, Angle, Percent, PercentWithVar } from '../units.js';
import type { Opacity, OpacityWithVar } from './shared.js';

/** https://www.w3.org/TR/css-color-4/#funcdef-hwb */
export type Hwb =
  | `hwb(${Angle}, ${Percent}, ${Percent}, ${Opacity})`
  | `hwb(${Angle}, ${Percent}, ${Percent})`
  | `hwb(${Angle} ${Percent} ${Percent})`
  | `hwb(${Angle} ${Percent} ${Percent} / ${Opacity})`
  | `hwb(${number}, ${Percent}, ${Percent}, ${Opacity})`
  | `hwb(${number}, ${Percent}, ${Percent})`
  | `hwb(${number} ${Percent} ${Percent})`
  | `hwb(${number} ${Percent} ${Percent} / ${Opacity})`;
/** https://www.w3.org/TR/css-color-4/#funcdef-hwb */
export type HwbWithVar =
  | `hwb(${AngleWithVar}, ${PercentWithVar}, ${PercentWithVar}, ${OpacityWithVar})`
  | `hwb(${AngleWithVar}, ${PercentWithVar}, ${PercentWithVar})`
  | `hwb(${AngleWithVar} ${PercentWithVar} ${PercentWithVar})`
  | `hwb(${AngleWithVar} ${PercentWithVar} ${PercentWithVar} / ${OpacityWithVar})`
  | `hwb(${NumberWithVar}, ${PercentWithVar}, ${PercentWithVar}, ${OpacityWithVar})`
  | `hwb(${NumberWithVar}, ${PercentWithVar}, ${PercentWithVar})`
  | `hwb(${NumberWithVar} ${PercentWithVar} ${PercentWithVar})`
  | `hwb(${NumberWithVar} ${PercentWithVar} ${PercentWithVar} / ${OpacityWithVar})`;
