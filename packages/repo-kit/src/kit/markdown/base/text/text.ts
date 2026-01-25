import type { StrWrap, StrWrapTag } from '@toolbox-ts/types';
const wrapTag = <T extends string = string, Tag extends string = string>(
  text: T,
  tag: Tag
): StrWrapTag<Tag, T> => `<${tag}>${text}</${tag}>`;
const wrapMD = <T extends string = string, S extends string = string>(
  text: T,
  style: S
): StrWrap<S, S, T> => `${style}${text}${style}`;
//#region> Underline
export type Underline<T extends string = string> = StrWrapTag<UnderlineTag, T>;
export type UnderlineTag = 'ins' | 'u';
export type UnderlineVariant = 'md' | UnderlineTag;
export function underline<T extends string = string>(
  text: T,
  type?: 'md' | false
): StrWrapTag<'ins', T>;
export function underline<T extends string = string>(
  text: T,
  type: 'u'
): StrWrapTag<'u', T>;
export function underline<T extends string = string>(
  text: T,
  type?: false | UnderlineVariant
): Underline<T>;
export function underline<T extends string = string>(
  text: T,
  type: false | UnderlineVariant = false
): Underline<T> {
  return !type || type === 'md' ? wrapTag(text, 'ins') : wrapTag(text, type);
}
//#endregion

//#region> Super & Sub Script
export const superScript = <T extends string = string>(text: T) =>
  wrapTag(text, 'sup');
export const subScript = <T extends string = string>(text: T) =>
  wrapTag(text, 'sub');
//#endregion

//#region> Bold
export type Bold<T extends string = string> =
  | StrWrap<'**', '**', T>
  | StrWrapTag<BoldTag, T>;
export type BoldTag = 'b' | 'strong';
export type BoldVariant = 'md' | BoldTag;
export function bold<T extends string = string>(
  text: T,
  type?: 'md' | false
): StrWrap<'**', '**', T>;
export function bold<T extends string = string>(
  text: T,
  type: 'b'
): StrWrapTag<'b', T>;
export function bold<T extends string = string>(
  text: T,
  type: 'strong'
): StrWrapTag<'strong', T>;
export function bold<T extends string = string>(
  text: T,
  type?: BoldVariant | false
): Bold<T>;
export function bold<T extends string = string>(
  text: T,
  type: BoldVariant | false = false
): Bold<T> {
  return !type || type === 'md' ? wrapMD(text, '**') : wrapTag(text, type);
}
//#endregion

//#region> Italic
export type Italic<T extends string = string> =
  | StrWrap<'*', '*', T>
  | StrWrapTag<ItalicTag, T>;
export type ItalicTag = 'em' | 'i';
export type ItalicVariant = 'md' | ItalicTag;
export function italic<T extends string = string>(
  text: T,
  type?: 'md' | false
): StrWrap<'*', '*', T>;
export function italic<T extends string = string>(
  text: T,
  type: 'i'
): StrWrapTag<'i', T>;
export function italic<T extends string = string>(
  text: T,
  type: 'em'
): StrWrapTag<'em', T>;
export function italic<T extends string = string>(
  text: T,
  type?: false | ItalicVariant
): Italic<T>;
export function italic<T extends string = string>(
  text: T,
  type: false | ItalicVariant = false
): Italic<T> {
  return !type || type === 'md' ? wrapMD(text, '*') : wrapTag(text, type);
}
//#endregion

//#region> Strikethrough
export type Strikethrough<T extends string = string> =
  | StrWrap<'~~', '~~', T>
  | StrWrapTag<StrikethroughTag, T>;
export type StrikethroughTag = 'del' | 'strike';
export type StrikeThroughVariant = 'md' | StrikethroughTag;
export function strikethrough<T extends string = string>(
  text: T,
  type?: 'md' | false
): StrWrap<'~~', '~~', T>;
export function strikethrough<T extends string = string>(
  text: T,
  type: 'del'
): StrWrapTag<'del', T>;
export function strikethrough<T extends string = string>(
  text: T,
  type: 'strike'
): StrWrapTag<'strike', T>;
export function strikethrough<T extends string = string>(
  text: T,
  type?: false | StrikeThroughVariant
): Strikethrough<T>;
export function strikethrough<T extends string = string>(
  text: T,
  type: false | StrikeThroughVariant = false
): Strikethrough<T> {
  return !type || type === 'md' ? wrapMD(text, '~~') : wrapTag(text, type);
}
//#endregion

//#region> Inline Code
export type InlineCodeTag = 'code' | 'kbd' | 'pre' | 'samp' | 'var';
export type InlineCodeVariant = 'md' | InlineCodeTag;
export function inlineCode<T extends string = string>(
  text: T,
  type?: 'md' | false
): StrWrap<'`', '`', T>;
export function inlineCode<T extends string = string>(
  text: T,
  type: 'code'
): StrWrapTag<'code', T>;
export function inlineCode<T extends string = string>(
  text: T,
  type: 'kbd'
): StrWrapTag<'kbd', T>;
export function inlineCode<T extends string = string>(
  text: T,
  type: 'pre'
): StrWrapTag<'pre', T>;
export function inlineCode<T extends string = string>(
  text: T,
  type: 'samp'
): StrWrapTag<'samp', T>;
export function inlineCode<T extends string = string>(
  text: T,
  type: 'var'
): StrWrapTag<'var', T>;
export function inlineCode<T extends string = string>(
  text: T,
  type?: false | InlineCodeVariant
): StrWrap<'`', '`', T> | StrWrapTag<InlineCodeTag, T>;
export function inlineCode<T extends string = string>(
  text: T,
  type: false | InlineCodeVariant = false
): StrWrap<'`', '`', T> | StrWrapTag<InlineCodeTag, T> {
  return !type || type === 'md' ? wrapMD(text, '`') : wrapTag(text, type);
}
//#endregion

const STYLE_TEXT = {
  bold,
  italic,
  strikethrough,
  underline,
  inlineCode,
  superScript,
  subScript
} as const;
export type Text = string | TextWithStyle;
export type TextStyle = keyof typeof STYLE_TEXT;
export interface TextWithStyle {
  styles?: { [S in TextStyle]?: Parameters<(typeof STYLE_TEXT)[S]>[1] };
  text: string;
}
export const isText = (t: unknown): t is Text =>
  typeof t === 'string' ? true : (
    typeof t === 'object' && t !== null && 'text' in t
  );
export const text = (t?: Text): string =>
  t === undefined ? ''
  : typeof t === 'string' ? t
  : t.styles === undefined ? t.text
  : (
      Object.entries(t.styles) as [
        TextStyle,
        Parameters<(typeof STYLE_TEXT)[TextStyle]>[1]
      ][]
    ).reduce(
      (styledText, [key, type]) =>
        (STYLE_TEXT[key] as (txt: string, t: typeof type) => string)(
          styledText,
          type
        ),
      t.text
    );
//#endregion
