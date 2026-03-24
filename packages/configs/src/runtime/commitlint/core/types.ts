import type { UserConfig, RulesConfig } from '@commitlint/types';
import type { RequiredProps } from '@toolbox-ts/types/defs/object';

export interface InputConfig extends UserConfig {
  scopes?: string[];
  rules?: Partial<Omit<RulesConfig, 'scope-enum'>>;
  usingChangesets?: boolean;
}
export type Defaults = RequiredProps<InputConfig, 'extends' | 'rules' | 'defaultIgnores'> & {
  extends: string[];
};
export type ProcessedConfig = UserConfig & Defaults;
