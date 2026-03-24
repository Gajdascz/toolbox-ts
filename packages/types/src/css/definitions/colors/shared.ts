import type { WithVar } from '../shared.js';

/** https://www.w3.org/TR/css-color-4/#typedef-opacity-opacity-value */
export type Opacity = '0' | '1' | `.${number}` | `0.${number}`;
/** https://www.w3.org/TR/css-color-4/#typedef-opacity-opacity-value */
export type OpacityWithVar = WithVar<Opacity>;

/** https://www.w3.org/TR/css-color-4/#hex-notation */
export type Hex = `#${string}`;
/** https://www.w3.org/TR/css-color-4/#hex-notation */
export type HexWithVar = WithVar<Hex>;
