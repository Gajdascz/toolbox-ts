export type * as Attribute from './attributes.js';
export type * as Pseudo from './pseudo/index.js';
export type * as Tags from './tags.js';

import type * as Pseudo from './pseudo/index.js';
import type * as Tags from './tags.js';

/** https://drafts.csswg.org/selectors/#child-combinators */
export type Child = '>';

/** https://drafts.csswg.org/selectors/#class-html */
export type Class = `.${string}`;

/** https://drafts.csswg.org/selectors/#combinators */
export type Combinator = Child | Descendant | NextSibling | SubsequentSibling;

/** https://drafts.csswg.org/selectors/#descendant-combinators */
export type Descendant = ' ';

export type General =
  | Class
  | ID
  | Pseudo.Classes.All
  | Pseudo.Elements.All
  | Tags.All
  | Universal;
/** https://drafts.csswg.org/selectors/#relational */
export type Has = `:has(${string})`;
/** https://drafts.csswg.org/selectors/#id-selectors */
export type ID = `#${string}`;
/** https://drafts.csswg.org/selectors/#matches */
export type Is = `:is(${string})`;
export type Logical = 'has' | 'is' | 'not' | 'where';

/** https://drafts.csswg.org/selectors/#adjacent-sibling-combinators */
export type NextSibling = '+';

/** https://drafts.csswg.org/selectors/#negation */
export type Not = `:not(${string})`;

/** https://drafts.csswg.org/selectors/#adjacent-sibling-combinators */
export type SubsequentSibling = '~';

/** https://drafts.csswg.org/selectors/#the-universal-selector */
export type Universal = '*';
/** https://drafts.csswg.org/selectors/#zero-matches */
export type Where = `:where(${string})`;
