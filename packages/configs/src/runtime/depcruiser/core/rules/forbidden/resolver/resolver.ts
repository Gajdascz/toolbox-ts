import type { IForbiddenRuleType } from 'dependency-cruiser';
import { Obj } from '@toolbox-ts/utils';
import type { NativeForbiddenRulesConfig } from '../../../types/index.js';
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
) =>
  Obj.reduce(
    factories,
    (acc, value, key) => {
      const val = cfg[key];
      if (val === false) return acc;
      acc.push(value.generate(val === true ? {} : val));
      return acc;
    },
    [...extended]
  );
