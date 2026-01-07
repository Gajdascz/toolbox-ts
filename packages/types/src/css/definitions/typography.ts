import type { Accepts } from './shared.js';
import type { Length, Percent } from './units.js';

export type FontFamily = Accepts<string>;
export type FontSize = Accepts<Length | Percent>;
export type FontStyle = Accepts<'italic' | 'normal' | 'oblique'>;
export type FontVariant = Accepts<'normal' | 'small-caps'>;
export type FontWeight = Accepts<
  'bold' | 'bolder' | 'lighter' | 'normal' | `${number}` | number
>;

export type LetterSpacing = Accepts<Length>;
export type LineHeight = Accepts<`${number}` | Length | number | Percent>;
export type TextAlign = Accepts<
  'center' | 'end' | 'justify' | 'left' | 'match-parent' | 'right' | 'start'
>;
export type TextDecoration = Accepts<
  'line-through' | 'none' | 'overline' | 'underline' | string
>;
export type TextIndent = Accepts<Length | Percent>;
export type TextOverflow = Accepts<'clip' | 'ellipsis' | string>;
export type TextTransform = Accepts<
  | 'capitalize'
  | 'full-size-kana'
  | 'full-width'
  | 'lowercase'
  | 'none'
  | 'uppercase'
>;
export type WhiteSpace = Accepts<
  'break-spaces' | 'normal' | 'nowrap' | 'pre-line' | 'pre-wrap' | 'pre'
>;
export type WordSpacing = Accepts<Length>;
