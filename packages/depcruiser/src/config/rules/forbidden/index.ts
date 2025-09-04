export * as definitions from './definitions/index.js';
export * from './factory/index.js';
export type * from './types.js';
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

/**
 * Native Forbidden rules configuration
 *
 * - Rules explicitly set to `false` are omitted entirely
 * - Rules mentioned with a configuration object are merged with the default
 * - Rules explicitly set to `true` are included with their default configuration
 * - Rules not mentioned are included with their default configuration
 */
export type Config = {
  [K in RuleName]?: boolean | Parameters<(typeof factories)[K]['generate']>[0];
};

type RuleName = { [K in keyof typeof factories]: K }[keyof typeof factories];
