/** Specifies the case format of a string. */
export type CaseType = 'camel' | 'kebab' | 'pascal' | 'snake' | 'title';

//#region> KebabTo
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
export type KebabToSnake<S extends string> =
  S extends `${infer H}-${infer T}` ? `${H}_${KebabToSnake<T>}`
  : S extends `${infer H}` ? H
  : S;
/**
 * Converts a kebab-case string to Title Case.
 *
 * @template S - The kebab-case string to convert.
 */
export type KebabToTitle<S extends string> =
  S extends `${infer H}-${infer T}` ? `${Capitalize<H>} ${KebabToTitle<T>}`
  : S extends `${infer H}` ? Capitalize<H>
  : S;
//#endregion

//#region> CamelTo
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
 * Converts a camelCase string to PascalCase.
 *
 * @template S - The camelCase string to convert.
 */
export type CamelToPascal<S extends string> = Capitalize<S>;
/**
 * Converts a camelCase string to snake_case.
 *
 * @template S - The camelCase string to convert.
 */
export type CamelToSnake<S extends string> = KebabToSnake<CamelToKebab<S>>;
/**
 * Converts a camelCase string to Title Case.
 *
 * @template S - The camelCase string to convert.
 */
export type CamelToTitle<S extends string> = KebabToTitle<CamelToKebab<S>>;
//#endregion

//#region> PascalTo
/**
 * Converts a PascalCase string to camelCase.
 *
 * @template S - The PascalCase string to convert.
 */
export type PascalToCamel<S extends string> = Uncapitalize<S>;
/**
 * Converts a PascalCase string to kebab-case.
 *
 * @template S - The PascalCase string to convert.
 */
export type PascalToKebab<S extends string> = CamelToKebab<Uncapitalize<S>>;
/**
 * Converts a PascalCase string to snake_case.
 *
 * @template S - The PascalCase string to convert.
 */
export type PascalToSnake<S extends string> = KebabToSnake<PascalToKebab<S>>;
/**
 * Converts a PascalCase string to Title Case.
 *
 * @template S - The PascalCase string to convert.
 */
export type PascalToTitle<S extends string> = KebabToTitle<PascalToKebab<S>>;
//#endregion

//#region> SnakeTo
/**
 * Converts a snake_case string to camelCase.
 *
 * @template S - The snake_case string to convert.
 */
export type SnakeToCamel<S extends string> = KebabToCamel<SnakeToKebab<S>>;
/**
 * Converts a snake_case string to kebab-case.
 *
 * @template S - The snake_case string to convert.
 */
export type SnakeToKebab<S extends string> =
  S extends `${infer H}_${infer T}` ? `${H}-${SnakeToKebab<T>}`
  : S extends `${infer H}` ? H
  : S;
/**
 * Converts a snake_case string to PascalCase.
 *
 * @template S - The snake_case string to convert.
 */
export type SnakeToPascal<S extends string> = Capitalize<SnakeToCamel<S>>;
/**
 * Converts a snake_case string to Title Case.
 *
 * @template S - The snake_case string to convert.
 */
export type SnakeToTitle<S extends string> = KebabToTitle<SnakeToKebab<S>>;
//#endregion

//#region> TitleTo
/**
 * Converts a Title Case string to camelCase.
 *
 * @template S - The Title Case string to convert.
 */
export type TitleToCamel<S extends string> = KebabToCamel<TitleToKebab<S>>;
/**
 * Converts a Title Case string to kebab-case.
 *
 * @template S - The Title Case string to convert.
 */
export type TitleToKebab<S extends string> =
  S extends `${infer H} ${infer T}` ? `${Lowercase<H>}-${TitleToKebab<T>}`
  : S extends `${infer H}` ? Lowercase<H>
  : S;
/**
 * Converts a Title Case string to PascalCase.
 *
 * @template S - The Title Case string to convert.
 */
export type TitleToPascal<S extends string> = Capitalize<TitleToCamel<S>>;
/**
 * Converts a Title Case string to snake_case.
 *
 * @template S - The Title Case string to convert.
 */
export type TitleToSnake<S extends string> = KebabToSnake<TitleToKebab<S>>;
//#endregion

export interface CaseConversionMap<S extends string = string> {
  camel: {
    kebab: CamelToKebab<S>;
    pascal: CamelToPascal<S>;
    snake: CamelToSnake<S>;
    title: CamelToTitle<S>;
  };
  kebab: {
    camel: KebabToCamel<S>;
    pascal: KebabToPascal<S>;
    snake: KebabToSnake<S>;
    title: KebabToTitle<S>;
  };
  pascal: {
    camel: PascalToCamel<S>;
    kebab: PascalToKebab<S>;
    snake: PascalToSnake<S>;
    title: PascalToTitle<S>;
  };
  snake: {
    camel: SnakeToCamel<S>;
    kebab: SnakeToKebab<S>;
    pascal: SnakeToPascal<S>;
    title: SnakeToTitle<S>;
  };
  title: {
    camel: TitleToCamel<S>;
    kebab: TitleToKebab<S>;
    pascal: TitleToPascal<S>;
    snake: TitleToSnake<S>;
  };
}
