import type { IForbiddenRuleType } from 'dependency-cruiser';

import type {
  ForbiddenRule,
  NativeForbiddenRulesConfig
} from '../../../types/index.js';

import { factories } from '../core/index.js';

/**
 * Takes a partial forbidden rules configuration and returns an array of
 * fully fleshed out forbidden rules.
 *
 * - Rules explicitly set to `false` are omitted
 * - Rules not mentioned are included with their default configuration
 * - Rules mentioned with a configuration object are merged with the default
 */
export const resolve = (
  cfg: Partial<NativeForbiddenRulesConfig> = {},
  extended: IForbiddenRuleType[] = []
) => {
  const result: ForbiddenRule<string>[] = [];
  for (const key of Object.keys(factories) as (keyof typeof factories)[]) {
    const val = cfg[key];
    if (val === false) continue;
    result.push(factories[key].generate(val === true ? {} : val));
  }
  return [...result, ...extended];
};
