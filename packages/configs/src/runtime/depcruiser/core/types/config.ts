import type {
  DependencyType,
  IConfiguration,
  ICruiseOptions,
  IForbiddenRuleType
} from 'dependency-cruiser';
import type { IFormatOptions } from 'watskeburt';

import type { TsConfigs } from '../../../../core/index.js';
import type { NativeForbiddenRulesConfig } from './forbidden-rule.js';

export type AffectedOption =
  | Partial<
      { extensions: string | string[]; oldRevision?: string | true } & Omit<
        IFormatOptions,
        'extensions' | 'oldRevision'
      >
    >
  | string
  | true
  | undefined;
export interface InputCruiseOptions extends Omit<
  ICruiseOptions,
  'affected' | 'doNotFollow' | 'exclude'
> {
  affected?: AffectedOption;
  doNotFollow?: {
    dependencyTypes?: DependencyType[];
    path?: string | string[];
  };
  exclude?: string | string[];
}
export interface InputDepCruiserConfig extends Omit<
  IConfiguration,
  'forbidden' | 'options'
> {
  forbidden?: {
    cfg?: Partial<NativeForbiddenRulesConfig>;
    extended?: IForbiddenRuleType[];
  };
  options?: Omit<InputCruiseOptions, keyof StaticCruiseOptions>;
}
export interface StaticCruiseOptions {
  tsConfig: { fileName: typeof TsConfigs.FILENAMES.build };
  tsPreCompilationDeps: true;
}
