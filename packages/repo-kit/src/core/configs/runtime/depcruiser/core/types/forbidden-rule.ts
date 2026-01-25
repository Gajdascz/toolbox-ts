import type {
  IForbiddenRuleType,
  IRegularForbiddenRuleType
} from 'dependency-cruiser';

export type ForbiddenRule<N extends string> = {
  comment: string;
  from: IForbiddenRuleType['from'];
  name: N;
  severity: IForbiddenRuleType['severity'];
  to: IRegularForbiddenRuleType['to'];
} & IForbiddenRuleType;

export type ForbiddenRuleCfg<N extends string> = Omit<
  Partial<ForbiddenRule<N>>,
  'comment' | 'name'
>;

export interface ForbiddenRuleFactory<N extends string> {
  defaults: Omit<ForbiddenRule<N>, 'comment' | 'name'>;
  generate: (cfg?: Partial<RuleFactoryCfg<N>>) => ForbiddenRule<N>;
  META: { comment: string; name: N };
}

export type NativeForbiddenRuleName =
  | 'noCircular'
  | 'noDeprecatedCore'
  | 'noDuplicateDepTypes'
  | 'noNonPackageJson'
  | 'noOrphans'
  | 'notToDeprecated'
  | 'notToDevDep'
  | 'notToSpec'
  | 'notToUnresolvable'
  | 'optionalDepsUsed'
  | 'peerDepsUsed';

/**
 * Native Forbidden rules configuration
 *
 * - Rules explicitly set to `false` are omitted entirely
 * - Rules mentioned with a configuration object are merged with the default
 * - Rules explicitly set to `true` are included with their default configuration
 * - Rules not mentioned are included with their default configuration
 */
export type NativeForbiddenRulesConfig = {
  [K in NativeForbiddenRuleName]?:
    | boolean
    | Parameters<ForbiddenRuleFactory<K>['generate']>[0];
};
export type RuleFactoryCfg<N extends string> = Omit<
  Partial<ForbiddenRule<N>>,
  'comment' | 'name'
>;
