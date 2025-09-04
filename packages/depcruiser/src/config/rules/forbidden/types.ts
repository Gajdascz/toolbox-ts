import type {
  IForbiddenRuleType,
  IRegularForbiddenRuleType
} from 'dependency-cruiser';

export interface Factory<N extends string> {
  defaults: Omit<Rule<N>, 'comment' | 'name'>;
  generate: (cfg?: Partial<Rule<N>>) => Rule<N>;
  META: { comment: string; name: N };
}

export type Rule<N extends string> = {
  comment: string;
  from: IForbiddenRuleType['from'];
  name: N;
  severity: IForbiddenRuleType['severity'];
  to: IRegularForbiddenRuleType['to'];
} & IForbiddenRuleType;

export type RuleCfg<N extends string> = Omit<
  Partial<Rule<N>>,
  'comment' | 'name'
>;
