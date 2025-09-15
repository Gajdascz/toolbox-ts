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
 * Converts a PascalCase string to kebab-case.
 *
 * @template S - The PascalCase string to convert.
 */
export type PascalToKebab<S extends string> = CamelToKebab<Uncapitalize<S>>;

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
