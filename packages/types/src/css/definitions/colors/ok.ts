import type { NumberWithVar } from '../shared.js';
import type { Percent, PercentWithVar } from '../units.js';

/** https://www.w3.org/TR/css-color-4/#funcdef-oklab */
export type Oklab = `oklab(${Percent} ${number} ${string})`;
/** https://www.w3.org/TR/css-color-4/#funcdef-oklab */
export type OklabWithVar = `oklab(${PercentWithVar} ${NumberWithVar} ${string})`;

/** https://www.w3.org/TR/css-color-4/#funcdef-oklch */
export type Oklch = `oklch(${Percent} ${number} ${string})`;
/** https://www.w3.org/TR/css-color-4/#funcdef-oklch */
export type OklchWithVar = `oklch(${PercentWithVar} ${NumberWithVar} ${string})`;
