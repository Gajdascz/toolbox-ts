export * from './gradients.js';
export * from './hsl.js';
export * from './hwb.js';
export * from './keywords.js';
export * from './ok.js';
export * from './other.js';
export * from './rgb.js';
export * from './shared.js';

import type { Gradient } from './gradients.js';
import type { Hsl, Hsla, HslWithVar, HslaWithVar } from './hsl.js';
import type { Hwb, HwbWithVar } from './hwb.js';
import type { KeyWord, Named } from './keywords.js';
import type { Oklab, OklabWithVar, Oklch, OklchWithVar } from './ok.js';
import type { ColorFn, Lab, LabWithVar, Lch, LchWithVar } from './other.js';
import type { Rgb, RgbWithVar, Rgba, RgbaWithVar } from './rgb.js';
import type { Hex, HexWithVar } from './shared.js';

export type Type =
  | ColorFn
  | Gradient
  | Hex
  | Hsl
  | Hsla
  | Hwb
  | KeyWord
  | Lab
  | Lch
  | Named
  | Oklab
  | Oklch
  | Rgb
  | Rgba;

export type TypeWithVar =
  | ColorFn
  | Gradient
  | HexWithVar
  | HslWithVar
  | HslaWithVar
  | HwbWithVar
  | LabWithVar
  | LchWithVar
  | OklabWithVar
  | OklchWithVar
  | RgbWithVar
  | RgbaWithVar;
