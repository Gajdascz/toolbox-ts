//#region> Functional
/** https://drafts.csswg.org/selectors/#the-dir-pseudo */
type Dir = `:dir(${DirDirectionality})`;
type DirDirectionality = 'ltr' | 'rtl';
/** https://drafts.csswg.org/selectors/#the-lang-pseudo */
type Lang = `:lang(${string})`;
//#region> Nth
/** https://drafts.csswg.org/selectors/#nth-child-pseudo */
type NthChild = `:nth-child(${string})`;
/** https://drafts.csswg.org/selectors/#nth-child-pseudo */
type NthLastChild = `:nth-last-child(${string})`;
/** https://drafts.csswg.org/selectors/#nth-of-type-pseudo */
type NthLastOfType = `:nth-last-of-type(${string})`;
/** https://drafts.csswg.org/selectors/#nth-of-type-pseudo */
type NthOfType = `:nth-of-type(${string})`;
//#endregion
type Functional =
  | Dir
  | Lang
  | NthChild
  | NthLastChild
  | NthLastOfType
  | NthOfType;
//#endregion

//#region> Basic
//#region> User
type User = UserInvalid | UserValid;
/** https://drafts.csswg.org/selectors/#user-pseudos */
type UserInvalid = ':user-invalid';
/** https://drafts.csswg.org/selectors/#user-pseudos */
type UserValid = ':user-valid';
//#endregion
//#region> Link
/**
 * Targets unvisited hyperlinks
 * https://drafts.csswg.org/selectors/#link
 */
type Link = ':link';
type LinkAll =
  | Link
  | LinkAny
  | LinkLocal
  | LinkTarget
  | LinkTargetWithin
  | LinkVisited;
/**
 * Targets all hyperlinks
 * https://drafts.csswg.org/selectors/#the-any-link-pseudo
 */
type LinkAny = ':any-link';
/**
 * Targets local hyperlinks
 * https://drafts.csswg.org/selectors/#the-local-link-pseudo
 */
type LinkLocal = ':local-link';
/**
 * Targets hyperlink in current URL
 * https://drafts.csswg.org/selectors/#the-target-pseudo
 */
type LinkTarget = ':target';
/**
 * Targets hyperlinks in current URL or any of its descendants
 * https://drafts.csswg.org/selectors/#the-target-within-pseudo
 */
type LinkTargetWithin = ':target-within';
/**
 * Targets visited hyperlinks
 * https://drafts.csswg.org/selectors/#link
 */
type LinkVisited = ':visited';
//#endregion
/** https://drafts.csswg.org/selectors/#the-activation-pseudo */
type Active = `:active`;
/** https://drafts.csswg.org/selectors/#the-checked-pseudo */
type Checked = ':checked';
/** https://drafts.csswg.org/selectors/#default */
type Default = `:default`;
/** https://drafts.csswg.org/selectors/#the-defined-pseudo */
type Defined = ':defined';
/** https://drafts.csswg.org/selectors/#enableddisabled */
type Disabled = `:disabled`;
/** https://drafts.csswg.org/selectors/#empty-pseudo */
type Empty = ':empty';
/** https://drafts.csswg.org/selectors/#enableddisabled */
type Enabled = `:enabled`;
/** https://drafts.csswg.org/selectors/#the-focus-pseudo */
type Focus = `:focus`;
/** https://drafts.csswg.org/selectors/#the-focus-visible-pseudo */
type FocusVisible = `:focus-visible`;
/** https://drafts.csswg.org/selectors/#the-focus-within-pseudo */
type FocusWithin = `:focus-within`;
/** https://drafts.csswg.org/selectors/#the-hover-pseudo */
type Hover = `:hover`;
/** https://drafts.csswg.org/selectors/#the-indeterminate-pseudo */
type Indeterminate = ':indeterminate';
/** https://drafts.csswg.org/selectors/#range-pseudos */
type InRange = ':in-range';
/** https://drafts.csswg.org/selectors/#validity-pseudos */
type Invalid = ':invalid';
type Opt = Optional | Required;
/** https://drafts.csswg.org/selectors/#opt-pseudos */
type Optional = ':optional';
/** https://drafts.csswg.org/selectors/#range-pseudos */
type OutOfRange = ':out-of-range';
/** https://drafts.csswg.org/selectors/#placeholder-shown */
type PlaceholderShown = `:placeholder-shown`;
type Range = InRange | OutOfRange;
/** https://drafts.csswg.org/selectors/#rw-pseudos */
type ReadOnly = `:read-only`;
/** https://drafts.csswg.org/selectors/#rw-pseudos */
type ReadWrite = `:read-write`;
/** https://drafts.csswg.org/selectors/#opt-pseudos */
type Required = ':required';
/** https://drafts.csswg.org/selectors/#the-root-pseudo */
type Root = ':root';
type RW = ReadOnly | ReadWrite;
/** drafts.csswg.org/selectors/#the-scope-pseudo */
type Scope = ':scope';
type Toggle = Disabled | Enabled;
/** https://drafts.csswg.org/selectors/#validity-pseudos */
type Valid = ':valid';
type Validity = Invalid | Valid;

//#region> Child
type Child = FirstChild | LastChild | NthChild | NthLastChild | OnlyChild;
/** https://drafts.csswg.org/selectors/#first-child-pseudo */
type FirstChild = ':first-child';
/** https://drafts.csswg.org/selectors/#last-child-pseudo */
type LastChild = ':last-child';
/** https://drafts.csswg.org/selectors/#only-child-pseudo */
type OnlyChild = ':only-child';
//#endregion

//#region> OfType
/** https://drafts.csswg.org/selectors/#first-of-type-pseudo */
type FirstOfType = ':first-of-type';
/** https://drafts.csswg.org/selectors/#last-of-type-pseudo */
type LastOfType = ':last-of-type';
/** https://drafts.csswg.org/selectors/#only-of-type-pseudo */
type OnlyOfType = ':only-of-type';
//#endregion

/** https://drafts.csswg.org/selectors/#autofill */
type AutoFill = ':autofill';
type Basic =
  | Active
  | AutoFill
  | Checked
  | Default
  | Defined
  | Empty
  | FirstChild
  | FirstOfType
  | Focus
  | FocusVisible
  | FocusWithin
  | Hover
  | Indeterminate
  | LastChild
  | LastOfType
  | LinkAll
  | OnlyChild
  | OnlyOfType
  | Opt
  | PlaceholderShown
  | PopoverOpen
  | Range
  | Root
  | RW
  | Scope
  | Toggle
  | User
  | Validity;
/** https://drafts.csswg.org/selectors/#selectordef-modal */
type Modal = ':modal';
/** https://drafts.csswg.org/selectors/#selectordef-popover-open */
type PopoverOpen = ':popover-open';

/** https://developer.mozilla.org/en-US/docs/Web/CSS/:state */
type State = ':state';
//#endregion

type All = Basic | Functional;

export type {
  Active,
  All,
  AutoFill,
  Basic,
  Checked,
  Child,
  Default,
  Defined,
  Dir,
  DirDirectionality,
  Disabled,
  Empty,
  Enabled,
  FirstChild,
  FirstOfType,
  Focus,
  FocusVisible,
  FocusWithin,
  Functional,
  Hover,
  Indeterminate,
  InRange,
  Invalid,
  Lang,
  LastChild,
  LastOfType,
  Link,
  LinkAll,
  LinkAny,
  LinkLocal,
  LinkTarget,
  LinkTargetWithin,
  LinkVisited,
  Modal,
  NthChild,
  NthLastChild,
  NthLastOfType,
  NthOfType,
  OnlyChild,
  OnlyOfType,
  Opt,
  Optional,
  OutOfRange,
  PlaceholderShown,
  PopoverOpen,
  Range,
  ReadOnly,
  ReadWrite,
  Required,
  Root,
  RW,
  Scope,
  State,
  Toggle,
  User,
  UserInvalid,
  UserValid,
  Valid,
  Validity
};
