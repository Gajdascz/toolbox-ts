//#region> Basic
/** https://drafts.csswg.org/css-pseudo/#generated-content */
type After = '::after';
/** https://drafts.csswg.org/css-position-4/#backdrop */
type Backdrop = '::backdrop';
type Basic =
  | After
  | Backdrop
  | Before
  | Cue
  | FileSelectorButton
  | FirstLetter
  | FirstLine
  | Placeholder;
/** https://drafts.csswg.org/css-pseudo/#generated-content */
type Before = '::before';
/** https://w3c.github.io/webvtt/#the-cue-pseudo-element */
type Cue = '::cue';
/** https://drafts.csswg.org/css-pseudo/#file-selector-button-pseudo */
type FileSelectorButton = '::file-selector-button';
/** https://drafts.csswg.org/css-pseudo/#first-letter-pseudo */
type FirstLetter = '::first-letter';
/** https://drafts.csswg.org/css-pseudo/#first-line-pseudo */
type FirstLine = '::first-line';

/** https://drafts.csswg.org/css-pseudo/#placeholder-pseudo */
type Placeholder = '::placeholder';
//#endregion

//#region> Functional
/** https://w3c.github.io/webvtt/#the-cue-pseudo-element */
type CueFn = `::cue(${string})`;
type Functional = CueFn | Part | Slotted;
/** https://drafts.csswg.org/css-shadow-parts/#selectordef-part */
type Part = `::part(${string})`;

/** https://drafts.csswg.org/css-scoping/#selectordef-slotted */
type Slotted = `::slotted(${string})`;
//#endregion

type All = Basic | Functional;
export type {
  After,
  All,
  Backdrop,
  Basic,
  Before,
  Cue,
  FileSelectorButton,
  FirstLetter,
  FirstLine,
  Functional,
  Part,
  Placeholder,
  Slotted
};
