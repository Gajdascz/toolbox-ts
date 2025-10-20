import type { IForbiddenRuleType } from 'dependency-cruiser';

import { obj } from '@toolbox-ts/utils';

import { rules } from '../../../../definitions/index.js';

/**
 * Takes a partial forbidden rules configuration and returns an array of
 * fully fleshed out forbidden rules.
 *
 * - Rules explicitly set to `false` are omitted
 * - Rules not mentioned are included with their default configuration
 * - Rules mentioned with a configuration object are merged with the default
 */
export const resolveForbiddenRules = (
  cfg: Partial<rules.forbidden.Config> = {},
  extended: IForbiddenRuleType[] = []
) => {
  const result: rules.forbidden.Rule<string>[] = [];
  const keys = obj.keys(rules.forbidden.factories);
  for (const key of keys) {
    const val = cfg[key];
    if (val === false) continue;
    result.push(
      rules.forbidden.factories[key].generate(val === true ? {} : val)
    );
  }
  return [...result, ...extended];
};
export type ResolveForbiddenRulesArgs = Parameters<
  typeof resolveForbiddenRules
>;
