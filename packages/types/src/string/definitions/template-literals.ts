import type { CommaSeparator } from './general.js';

/**
 * A CSV (comma separated values) pair string that provides type safety for two values.
 *
 * @important Avoid using `string` as the generic type as that would allow any string value. Explicitly specify string literals via the generic TemplateValue parameter.
 *
 * @default A and B are `TemplateValue`
 *
 * @example
 * ```ts
 * let pair1: CsvPair = "1,2" // valid
 * let pair2: CsvPair<string> = "a,b" // valid
 * let pair3: CsvPair<boolean> = "true,false" // valid
 * let pair4: CsvPair<number> = "1,three" // Error: Type '"three"' is not assignable to type 'number'.
 * let pair5: CsvPair<'one'|'two'|number, 'three'|'four'|number> = "one,three"  // valid
 *```
 */
export type CsvPair<
  A extends TemplateValue = TemplateValue,
  B extends TemplateValue = A,
  C extends CommaSeparator = ','
> = SeparatedPair<A, B, C>;

/**
 * Prepends a prefix to a string type.
 *
 * @Template P - The prefix to prepend.
 * @Template S - The string to which the prefix will be added.
 */
export type Prefix<P extends string, S extends string> = `${P}${S}`;
/**
 * Generates a string by repeating a given character a specified number of times.
 *
 * @template C - The character to repeat.
 * @template N - The number of times to repeat the character.
 * @example
 * ```ts
 * type Repeated = Repeat<'a', 5> // 'aaaaa'
 * ```
 */
export type Repeat<
  C extends string,
  N extends number,
  Acc extends string = '',
  T extends unknown[] = []
> = T['length'] extends N ? Acc : Repeat<C, N, `${Acc}${C}`, [...T, unknown]>;

/**
 * Generates a string by joining an array of template literal values
 * with a specified separator.
 *
 * @template V - An array of template literal values to be joined.
 * @template Sep - The separator string to use between values. Default is ','.
 * @template Acc - An accumulator for building the resulting string. Default is ''.
 *
 * @example
 * ```ts
 * type Joined = SeparatedLiterals<['a', 'b', 'c'], '-'> // 'a-b-c'
 * type JoinedDefaultSep = SeparatedLiterals<['1', '2', '3']> // '1,2,3'
 * type JoinedSingle = SeparatedLiterals<['onlyOne']> // 'onlyOne'
 * type JoinedEmpty = SeparatedLiterals<[]> // ''
 * ```
 */
export type SeparatedLiterals<
  V extends TemplateValue[] = TemplateValue[],
  Sep extends string = ',',
  Acc extends string = ''
> =
  V extends [infer A, ...infer R] ?
    A extends TemplateValue ?
      `${Acc extends '' ? '' : `${Acc}${Sep}`}${A}` extends infer S ?
        R extends TemplateValue[] ?
          SeparatedLiterals<R, Sep, S & string>
        : never
      : never
    : Acc
  : Acc;

/**
 * A string pair separated by a specified separator.
 */
export type SeparatedPair<
  A extends TemplateValue,
  B extends TemplateValue,
  S extends string = ' '
> = `${A}${S}${B}`;

/**
 * Appends a suffix to a string type.
 *
 * @Template S - The string to which the suffix will be added.
 * @Template P - The suffix to append.
 */
export type Suffix<S extends string, P extends string> = `${S}${P}`;

/**
 * A type representing all possible primitive values that can be used
 * in template literal types.
 */
export type TemplateValue =
  | bigint
  | boolean
  | null
  | number
  | string
  | undefined;
/**
 * Wraps a string with specified left and right strings, with an optional
 * connector string in between.
 *
 * @example
 * ```ts
 * type Wrapped = Wrap<'(', ')', 'content'> // '(content)'
 * type WrappedWithConnector = Wrap<'<', '>', 'tag', 'div'> // '<div>tag</div>'
 * ```
 */
export type Wrap<
  L extends string,
  R extends string = L,
  C extends string = string
> = `${L}${C}${R}`;

/**
 * Wraps a string with HTML/XML-like tags.
 *
 * @example
 * ```ts
 * type Wrapped = WrapTag<'div', 'Content'> // '<div>Content</div>'
 * type WrappedWithAttributes = WrapTag<'a', 'Link', 'href="https://example.com"'> // '<a href="https://example.com">Link</a>'
 * ```
 */
export type WrapTag<
  Tag extends string,
  Content extends string = string,
  Attributes extends string = ''
> = `<${Tag}${Attributes extends '' ? '' : ` ${Attributes}`}>${Content}</${Tag}>`;
