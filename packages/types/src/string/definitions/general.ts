//#region> base
/**
 * String representations of lowercase letters (a-z)
 */
export type AlphabetLowercase =
  | 'a'
  | 'b'
  | 'c'
  | 'd'
  | 'e'
  | 'f'
  | 'g'
  | 'h'
  | 'i'
  | 'j'
  | 'k'
  | 'l'
  | 'm'
  | 'n'
  | 'o'
  | 'p'
  | 'q'
  | 'r'
  | 's'
  | 't'
  | 'u'
  | 'v'
  | 'w'
  | 'x'
  | 'y'
  | 'z';
/**
 * Specifies the type of lettering used in a string.
 * - alphabetic - letters only
 * - alphanumeric - letters and numbers
 */
export type LetteringType = 'alphabetic' | 'alphanumeric';

/**
 * String representations of negative digits (-0 to -9)
 */
export type NegativeDigit =
  | '-0'
  | '-1'
  | '-2'
  | '-3'
  | '-4'
  | '-5'
  | '-6'
  | '-7'
  | '-8'
  | '-9';

/**
 * String representations of positive digits (0 to 9)
 */
export type PositiveDigit =
  | '0'
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9';

export type Separator =
  | '_'
  | '-'
  | ','
  | ';'
  | ':'
  | '.'
  | ' '
  | '/'
  | '\\'
  | '|';
//#endregion

//#region> Unions
/**
 * String representations of the English alphabet (a-z, A-Z)
 */
export type Alphabet = AlphabetLowercase | AlphabetUppercase;

/**
 * String representations of uppercase letters (A-Z)
 */
export type AlphabetUppercase = Uppercase<AlphabetLowercase>;
/**
 * String representations of all digits (-9 to 9)
 */
export type Digit = NegativeDigit | PositiveDigit;
//#endregion

//#region> Conditionals
/**
 * Checks if a string contains a separator.
 * @template S - The string to check.
 * @template T - The separator to check for (default is any Separator).
 * @returns `true` if the string contains the separator, otherwise `false`.
 *
 * @tip Use {@link Separator} for the T template parameter to specify which separator to check for.
 *
 * @example
 * ```ts
 * type AnySeparator = HasSeparator<'hello-world'>; // true
 * type NoUnderscore = HasSeparator<'hello-world',Exclude<Separator, '_'>>; // false
 * ```
 */
export type HasSeparator<S extends string, T extends Separator = Separator> =
  S extends `${string}${T}${string}` ? true : false;
/**
 * Checks if a string is capitalized.
 * @template S - The string to check.
 * @returns `true` if the string is capitalized, otherwise `false`.
 *
 * @example
 * ```ts
 * type Capitalized = IsCapitalized<'Hello'>; // true
 * type NotCapitalized = IsCapitalized<'hello'>; // false
 * ```
 */
export type IsCapitalized<S extends string> =
  S extends Capitalize<S> ? true : false;
/**
 * Checks if a string is lowercase.
 *
 * @template S - The string to check.
 * @returns `true` if the string is lowercase, otherwise `false`.
 *
 * @example
 * ```ts
 * type Lowercase = IsLowercase<'hello'>; // true
 * type NotLowercase = IsLowercase<'Hello'>; // false
 * ```
 */
export type IsLowercase<S extends string> =
  S extends Lowercase<S> ? true : false;
/**
 * Checks if a string is not capitalized.
 *
 * @template S - The string to check.
 * @returns `true` if the string is not capitalized, otherwise `false`.
 *
 * @example
 * ```ts
 * type NotCapitalized = IsNotCapitalized<'hello'>; // true
 * type Capitalized = IsNotCapitalized<'Hello'>; // false
 * ```
 */
export type IsNotCapitalized<S extends string> =
  IsCapitalized<S> extends true ? false : true;
/**
 * Checks if a string is not lowercase.
 *
 * @template S - The string to check.
 * @returns `true` if the string is not lowercase, otherwise `false`.
 *
 * @example
 * ```ts
 * type NotLowercase = IsNotLowercase<'Hello'>; // true
 * type Lowercase = IsNotLowercase<'hello'>; // false
 * ```
 */
export type IsNotLowercase<S extends string> =
  S extends Lowercase<S> ? false : true;
/**
 * Checks if a type is not a string.
 *
 * @template S - The type to check.
 *
 * @example
 * ```ts
 * type A = IsNotString<'hello'>; // false
 * type B = IsNotString<123>; // true
 * ```
 */
export type IsNotString<S> = S extends string ? false : true;

/**
 * Checks if a type is a string.
 *
 * @template S - The type to check.
 *
 * @example
 * ```ts
 * type A = IsString<'hello'>; // true
 * type B = IsString<123>; // false
 * ```
 */
export type IsString<S> = S extends string ? true : false;
//#endregion
