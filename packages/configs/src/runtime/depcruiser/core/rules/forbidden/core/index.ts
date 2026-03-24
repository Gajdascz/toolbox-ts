export * as definitions from './definitions/index.js';
export * from './factory/index.js';

import { Obj } from '@toolbox-ts/utils';
import {
  noCircular,
  noDeprecatedCore,
  noDuplicateDepTypes,
  noNonPackageJson,
  noOrphans,
  notToDeprecated,
  notToDevDep,
  notToSpec,
  notToUnresolvable,
  optionalDepsUsed,
  peerDepsUsed
} from './definitions/index.js';

export const factories = {
  noCircular,
  noOrphans,
  noDeprecatedCore,
  noNonPackageJson,
  noDuplicateDepTypes,
  notToDeprecated,
  notToDevDep,
  notToSpec,
  notToUnresolvable,
  optionalDepsUsed,
  peerDepsUsed
} as const;
export const defaults = Obj.map(factories, (factory) => factory.defaults);
