export * from './apache-2_0.js';
export * from './cddl-1_0.js';
export * from './gpl-3_0-only.js';
export * from './mit.js';
export * from './mpl-2_0.js';
export * from './bsd-3-clause.js';
export type * from './types.js';

import type * as Apache2_0 from './apache-2_0.js';
import type * as CDDL_1_0 from './cddl-1_0.js';
import type * as GPL_3_0_ONLY from './gpl-3_0-only.js';
import type * as MIT from './mit.js';
import type * as MPL_2_0 from './mpl-2_0.js';
import type * as BSD_3_CLAUSE from './bsd-3-clause.js';

export type Type =
  | typeof Apache2_0
  | typeof CDDL_1_0
  | typeof GPL_3_0_ONLY
  | typeof MIT
  | typeof MPL_2_0
  | typeof BSD_3_CLAUSE;
