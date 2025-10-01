//#region> Case Conversions
/**
 * Converts a camelCase string to kebab-case.
 *
 * @template S - The camelCase string to convert.
 */
export type CamelToKebab<S extends string> =
  S extends `${infer H}${infer T}` ?
    T extends Uncapitalize<T> ?
      `${Lowercase<H>}${CamelToKebab<T>}`
    : `${Lowercase<H>}-${CamelToKebab<T>}`
  : S;

/**
 * Converts a kebab-case string to camelCase.
 *
 * @template S - The kebab-case string to convert.
 */
export type KebabToCamel<S extends string> =
  S extends `${infer H}-${infer T}` ? `${H}${Capitalize<KebabToCamel<T>>}`
  : S extends `${infer H}` ? H
  : S;

/**
 * Converts a camelCase string to PascalCase.
 *
 * @template S - The camelCase string to convert.
 */
export type KebabToPascal<S extends string> = Capitalize<KebabToCamel<S>>;

/**
 * Converts a kebab-case string to Title Case.
 *
 * @template S - The kebab-case string to convert.
 */
export type KebabToTitle<S extends string> =
  S extends `${infer H}-${infer T}` ? `${Capitalize<H>} ${KebabToTitle<T>}`
  : S extends `${infer H}` ? Capitalize<H>
  : S;
/**
 * Converts a PascalCase string to kebab-case.
 *
 * @template S - The PascalCase string to convert.
 */
export type PascalToKebab<S extends string> = CamelToKebab<Uncapitalize<S>>;

/**
 * Converts a PascalCase string to Title Case.
 *
 * @template S - The PascalCase string to convert.
 */
export type PascalToTitle<S extends string> = KebabToTitle<PascalToKebab<S>>;

/**
 * Converts a Title Case string to kebab-case.
 *
 * @template S - The Title Case string to convert.
 */
export type TitleToKebab<S extends string> =
  S extends `${infer H} ${infer T}` ? `${Lowercase<H>}-${TitleToKebab<T>}`
  : S extends `${infer H}` ? Lowercase<H>
  : S;

//#endregion

/**
 * A CSV (comma separated values) string that provides type safety for
 * up to 5 values. Additional values beyond the fifth are allowed
 * but not type-checked.
 *
 * @important Avoid using `string` as the generic type as that would allow any string value. Explicitly specify string literals via the generic V parameter.
 *
 * @default V is `number`
 *
 * @example
 * ```ts
 * let csv1: Csv = "1,2,3,4,5" // valid
 * let csv2: Csv<string> = "a,b,c" // valid
 * let csv3: Csv<boolean> = "true,false,true" // valid
 * let csv4: Csv<number> = "1,2,three" // Error: Type '"three"' is not assignable to type 'number'.
 * let csv5: Csv = "1,2,3,4,5,6,7,8,9,10" // valid but only first 5 values are type-checked
 * let csv6: Csv<'one'|'two'|'three'|number> = "one,two,three,4"  // valid
 *```
 */
export type Csv<
  V extends bigint | boolean | null | number | string | undefined = number
> =
  | `${V},${V},${V},${V},${V}`
  | `${V},${V},${V},${V},${V}${'' | `,${string}`}`
  | `${V},${V},${V},${V}`
  | `${V},${V},${V}`
  | `${V},${V}`
  | `${V}`;

/**
 * Prepends a prefix to a string type.
 *
 * @param P - The prefix to prepend.
 * @param S - The string to which the prefix will be added.
 */
export type Prefix<P extends string, S extends string> = `${P}${S}`;

/**
 * Appends a suffix to a string type.
 *
 * @param S - The string to which the suffix will be added.
 * @param P - The suffix to append.
 */
export type Suffix<S extends string, P extends string> = `${S}${P}`;
