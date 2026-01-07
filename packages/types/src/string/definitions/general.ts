/**
 * String representations of the English alphabet (a-z, A-Z)
 */
export type Alphabet = AlphabetLowercase | AlphabetUppercase;
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
 * String representations of uppercase letters (A-Z)
 */
export type AlphabetUppercase = Uppercase<AlphabetLowercase>;

export type CommaSeparator = ', ' | ',';
/**
 * String representations of all digits (-9 to 9)
 */
export type Digit = NegDigit | PosDigit;

/**
 * Specifies the type of lettering used in a string.
 * - alphabetic - letters only
 * - alphanumeric - letters and numbers
 */
export type LetteringType = 'alphabetic' | 'alphanumeric';

/**
 * String representations of negative digits (-0 to -9)
 */
export type NegDigit =
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
export type PosDigit =
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
