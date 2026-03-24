import { DIRS, FILES } from '@toolbox-ts/constants/fs';
import { Arr } from '@toolbox-ts/utils';

export const DEFAULTS = [
  DIRS.OUT,
  DIRS.NODE_MODULES,
  DIRS.ARTIFACTS,
  FILES.STEMS.RUNTIME.ENV,
  FILES.PNPM.STORE,
  'DS_Store'
] as const;

export type InputConfig = string[];
export type ProcessedConfig = string;
export const define = (inp: string[] = []) => Arr.mergeUnique(DEFAULTS, inp).sort().join('\n');
export const toFileEntry = (config?: InputConfig) => ({ [FILES.GITIGNORE]: define(config) });
