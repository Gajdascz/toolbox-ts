import type {
  HasSeparator,
  IsCapitalized,
  IsNotCapitalized,
  IsNotLowercase,
  Separator
} from './general.js';

/** Specifies the case format of a string. */
export type CaseType = 'camel' | 'kebab' | 'pascal' | 'snake';

//#region> Conversion

//#region> KebabTo
/**
 * Converts a kebab-case string to camelCase.
 *
 * @template S - The kebab-case string to convert.
 * @returns The camelCase version of the input string.
 * @example
 * ```ts
 * type Camel = KebabToCamel<'hello-world'>; // "helloWorld"
 * ```
 */
export type KebabToCamel<S extends string> =
  S extends `${infer H}-${infer T}` ? `${H}${Capitalize<KebabToCamel<T>>}`
  : S extends `${infer H}` ? H
  : S;
/**
 * Converts a camelCase string to PascalCase.
 *
 * @template S - The camelCase string to convert.
 * @returns The PascalCase version of the input string.
 * @example
 * ```ts
 * type Pascal = KebabToPascal<'hello-world'>; // "HelloWorld"
 * ```
 */
export type KebabToPascal<S extends string> = Capitalize<KebabToCamel<S>>;
/**
 * Converts a kebab-case string to snake_case.
 *
 * @template S - The kebab-case string to convert.
 * @returns The snake_case version of the input string.
 * @example
 * ```ts
 * type Snake = KebabToSnake<'hello-world'>; // "hello_world"
 * ```
 */
export type KebabToSnake<S extends string> =
  S extends `${infer H}-${infer T}` ? `${H}_${KebabToSnake<T>}`
  : S extends `${infer H}` ? H
  : S;
//#region> ConversionMap
/**
 * Maps a kebab-case string to its equivalent camelCase, PascalCase, and snake_case representations.
 *
 * @template S - The kebab-case string to convert.
 */
export interface KebabToConversionMap<S extends string> {
  camel: KebabToCamel<S>;
  pascal: KebabToPascal<S>;
  snake: KebabToSnake<S>;
}
//#endregion

//#endregion

//#region> CamelTo
/**
 * Converts a camelCase string to kebab-case.
 *
 * @template S - The camelCase string to convert.
 * @returns The kebab-case version of the input string.
 * @example
 * ```ts
 * type Kebab = CamelToKebab<'helloWorld'>; // "hello-world"
 * ```
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
 * @returns The PascalCase version of the input string.
 * @example
 * ```ts
 * type Pascal = CamelToPascal<'helloWorld'>; // "HelloWorld"
 * ```
 */
export type CamelToPascal<S extends string> = Capitalize<S>;
/**
 * Converts a camelCase string to snake_case.
 *
 * @template S - The camelCase string to convert.
 * @returns The snake_case version of the input string.
 * @example
 * ```ts
 * type Snake = CamelToSnake<'helloWorld'>; // "hello_world"
 * ```
 */
export type CamelToSnake<S extends string> = KebabToSnake<CamelToKebab<S>>;

//#region> ConversionMap
/**
 * Maps a camelCase string to its equivalent kebab-case, PascalCase, and snake_case representations.
 */
export interface CamelToConversionMap<S extends string> {
  kebab: CamelToKebab<S>;
  pascal: CamelToPascal<S>;
  snake: CamelToSnake<S>;
}
//#endregion

//#endregion

//#region> PascalTo
/**
 * Converts a PascalCase string to camelCase.
 *
 * @template S - The PascalCase string to convert.
 * @returns The camelCase version of the input string.
 * @example
 * ```ts
 * type Camel = PascalToCamel<'HelloWorld'>; // "helloWorld"
 * ```
 */
export type PascalToCamel<S extends string> = Uncapitalize<S>;
/**
 * Converts a PascalCase string to kebab-case.
 *
 * @template S - The PascalCase string to convert.
 * @returns The kebab-case version of the input string.
 * @example
 * ```ts
 * type Kebab = PascalToKebab<'HelloWorld'>; // "hello-world"
 * ```
 */
export type PascalToKebab<S extends string> = CamelToKebab<Uncapitalize<S>>;
/**
 * Converts a PascalCase string to snake_case.
 *
 * @template S - The PascalCase string to convert.
 * @returns The snake_case version of the input string.
 * @example
 * ```ts
 * type Snake = PascalToSnake<'HelloWorld'>; // "hello_world"
 * ```
 */
export type PascalToSnake<S extends string> = KebabToSnake<PascalToKebab<S>>;

//#region> ConversionMap
/**
 * Maps a PascalCase string to its equivalent camelCase, kebab-case, and snake_case representations.
 */
export interface PascalToConversionMap<S extends string> {
  camel: PascalToCamel<S>;
  kebab: PascalToKebab<S>;
  snake: PascalToSnake<S>;
}
//#endregion

//#endregion

//#region> SnakeTo
/**
 * Converts a snake_case string to camelCase.
 *
 * @template S - The snake_case string to convert.
 * @returns The camelCase version of the input string.
 * @example
 * ```ts
 * type Camel = SnakeToCamel<'hello_world'>; // "helloWorld"
 * ```
 */
export type SnakeToCamel<S extends string> = KebabToCamel<SnakeToKebab<S>>;
/**
 * Converts a snake_case string to kebab-case.
 *
 * @template S - The snake_case string to convert.
 * @returns The kebab-case version of the input string.
 * @example
 * ```ts
 * type Kebab = SnakeToKebab<'hello_world'>; // "hello-world"
 * ```
 */
export type SnakeToKebab<S extends string> =
  S extends `${infer H}_${infer T}` ? `${H}-${SnakeToKebab<T>}`
  : S extends `${infer H}` ? H
  : S;
/**
 * Converts a snake_case string to PascalCase.
 *
 * @template S - The snake_case string to convert.
 * @returns The PascalCase version of the input string.
 * @example
 * ```ts
 * type Pascal = SnakeToPascal<'hello_world'>; // "HelloWorld"
 * ```
 */
export type SnakeToPascal<S extends string> = Capitalize<SnakeToCamel<S>>;

//#region> ConversionMap
/**
 * Maps a snake_case string to its equivalent camelCase, kebab-case, and PascalCase representations.
 */
export interface SnakeToConversionMap<S extends string> {
  camel: SnakeToCamel<S>;
  kebab: SnakeToKebab<S>;
  pascal: SnakeToPascal<S>;
}
//#endregion

//#endregion

/**
 * Maps a string in any case to its equivalent representations in camelCase, kebab-case, PascalCase, and snake_case.
 *
 * @template S - The string to convert.
 */
export interface CaseConversionMap<S extends string = string> {
  camel: CamelToConversionMap<S>;
  kebab: KebabToConversionMap<S>;
  pascal: PascalToConversionMap<S>;
  snake: SnakeToConversionMap<S>;
}

/**
 * Converts a string from one case to another.
 *
 * @template S - The string to convert.
 * @template From - The current case of the string.
 * @template To - The target case to convert the string to.
 * @returns The string converted to the target case.
 *
 * @example
 * ```ts
 * type SnakeToCamel = ConvertCase<'hello_world', 'snake', 'camel'>; // "helloWorld"
 * type KebabToPascal = ConvertCase<'hello-world', 'kebab', 'pascal'>; // "HelloWorld"
 * type PascalToSnake = ConvertCase<'HelloWorld', 'pascal', 'snake'>; // "hello_world"
 * ```
 */
export type ConvertCase<
  S extends string,
  From extends CaseType,
  To extends keyof CaseConversionMap<S>[From]
> = CaseConversionMap<S>[From][To];
//#endregion

//#region> Is Case
/**
 * Checks if a string is in camelCase.
 *
 * @template S - The string to check.
 * @returns The string if it is camelCase, otherwise `never`.
 *
 * @example
 * ```ts
 * type Type1 = IsCamelCase<'helloWorld'>; // "helloWorld"
 * type Type2 = IsCamelCase<'HelloWorld'>; // never
 * type Type3 = IsCamelCase<'hello_World'>; // never
 * ```
 */
export type IsCamelCase<S extends string = string> =
  HasSeparator<S> extends true ? never
  : IsCapitalized<S> extends true ? never
  : S;
/**
 * Checks if a string is in kebab-case.
 *
 * @template S - The string to check.
 * @returns The string if it is kebab-case, otherwise `never`.
 *
 * @example
 * ```ts
 * type Type1 = IsKebabCase<'hello-world'>; // "hello-world"
 * type Type2 = IsKebabCase<'hello_world'>; // never
 * type Type3 = IsKebabCase<'Hello-World'>; // never
 * ```
 */
export type IsKebabCase<S extends string = string> =
  HasSeparator<S, Exclude<Separator, '-'>> extends true ? never
  : IsNotLowercase<S> extends true ? never
  : S;

/**
 * Checks if a string is in PascalCase.
 *
 * @template S - The string to check.
 * @returns The string if it is PascalCase, otherwise `never`.
 *
 * @example
 * ```ts
 * type Type1 = IsPascalCase<'HelloWorld'>; // "HelloWorld"
 * type Type2 = IsPascalCase<'helloWorld'>; // never
 * type Type3 = IsPascalCase<'Hello_World'>; // never
 * ```
 */
export type IsPascalCase<S extends string> =
  HasSeparator<S> extends true ? never
  : IsNotCapitalized<S> extends true ? never
  : S;

/**
 * Checks if a string is in snake_case.
 *
 * @template S - The string to check.
 * @returns The string if it is snake_case, otherwise `never`.
 *
 * @example
 * ```ts
 * type Type1 = IsSnakeCase<'hello_world'>; // "hello_world"
 * type Type2 = IsSnakeCase<'helloWorld'>; // never
 * type Type3 = IsSnakeCase<'Hello_World'>; // never
 * ```
 */
export type IsSnakeCase<S extends string> =
  HasSeparator<S, Exclude<Separator, '_'>> extends true ? never
  : IsNotLowercase<S> extends true ? never
  : S;
//#endregion

export type CamelCase = `${Lowercase<string>}${string}`;
export type KebabCase = `${Lowercase<string>}-${Lowercase<string>}`;
export type PascalCase = `${Capitalize<string>}${string}`;
export type SnakeCase =
  | `${Lowercase<string>}_${Lowercase<string>}`
  | Lowercase<string>;
