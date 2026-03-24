import type { Oxc } from '@toolbox-ts/types/defs/configs';

export type InputConfig = Partial<Omit<Oxc.Fmt.Config, '$schema'>>;
export type ProcessedConfig = Oxc.Fmt.Config;
