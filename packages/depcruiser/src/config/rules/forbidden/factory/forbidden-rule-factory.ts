import { Str } from '@toolbox-ts/utils';

import type { Rule } from '../types.js';

export interface Factory<N extends string> {
  defaults: Omit<Rule<N>, 'comment' | 'name'>;
  generate: (cfg?: Partial<RuleFactoryCfg<N>>) => Rule<N>;
  META: { comment: string; name: N };
}

export type RuleFactoryCfg<N extends string> = Omit<
  Partial<Rule<N>>,
  'comment' | 'name'
>;

export const create = <N extends string>(
  name: N,
  comment: string,
  {
    from: _from = {},
    severity: _severity = 'error',
    to: _to = {}
  }: RuleFactoryCfg<N> = {}
): Factory<N> => ({
  defaults: { from: _from, severity: _severity, to: _to },
  generate: ({
    from = {},
    severity = _severity,
    to = {}
  }: Partial<RuleFactoryCfg<N>> = {}): Rule<N> => {
    const fromPath = Str.cleanArr([_from.path, from.path]);
    const fromPathNot = Str.cleanArr([_from.pathNot, from.pathNot]);
    const toPath = Str.cleanArr([_to.path, to.path]);
    const toPathNot = Str.cleanArr([_to.pathNot, to.pathNot]);
    return {
      comment,
      from: {
        ..._from,
        ...from,
        ...(fromPath.length > 0 && { path: fromPath }),
        ...(fromPathNot.length > 0 && { pathNot: fromPathNot })
      },
      name,
      severity,
      to: {
        ..._to,
        ...to,
        ...(toPath.length > 0 && { path: toPath }),
        ...(toPathNot.length > 0 && { pathNot: toPathNot })
      }
    } as const;
  },
  META: { comment, name }
});
