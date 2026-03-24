import type { Markdownlint } from '@toolbox-ts/types/defs/configs';
import type { RequiredProps } from '@toolbox-ts/types/defs/object';

export type InputConfig = Omit<Markdownlint.Cli2.Config, '$schema'>;
export type Defaults = RequiredProps<
  Markdownlint.Cli2.Config,
  'ignores' | 'globs' | 'config' | '$schema'
>;

export type ProcessedConfig = Markdownlint.Cli2.Config & Defaults;
