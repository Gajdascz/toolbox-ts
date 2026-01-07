//#region> Match
/**
 * Begins with exactly and followed by a hyphen
 * https://drafts.csswg.org/selectors/#attribute-representation
 */
type MarchBeginsWithThenHyphen = '|=';
type Match =
  | MarchBeginsWithThenHyphen
  | MatchBeingsWith
  | MatchContains
  | MatchEndsWith
  | MatchExact
  | MatchOneOf;
/**
 * Begins with exactly
 * https://drafts.csswg.org/selectors/#attribute-substrings
 */
type MatchBeingsWith = '^=';
/**
 * Contains substr anywhere
 * https://drafts.csswg.org/selectors/#attribute-substrings
 */
type MatchContains = '*=';
/**
 * Ends with exactly
 * https://drafts.csswg.org/selectors/#attribute-substrings
 */
type MatchEndsWith = '$=';
/**
 * Exact
 * https://drafts.csswg.org/selectors/#attribute-representation
 */
type MatchExact = '=';
/**
 * Exactly one of in val (whitespace separated)
 * https://drafts.csswg.org/selectors/#attribute-representation
 */
type MatchOneOf = '~=';
//#endregion ==================================================================

/** https://drafts.csswg.org/selectors/#attribute-case */
type CaseSensitivity = 'i' | 's';

export type {
  CaseSensitivity,
  MarchBeginsWithThenHyphen,
  Match,
  MatchBeingsWith,
  MatchContains,
  MatchEndsWith,
  MatchExact,
  MatchOneOf
};
