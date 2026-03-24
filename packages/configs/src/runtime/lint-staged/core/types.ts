import type { FunctionTask } from 'lint-staged';

export type InputConfig = Record<string, FunctionTask | string | (FunctionTask | string)[]> & {
  /**
   * Commands to run on source files (e.g. .ts, .tsx, .js, .jsx)
   */
  srcFilesCmds?: string[];
  /**
   * Commands to run on data files (e.g. .json, .yaml, .md)
   */
  dataFilesCmds?: string[];
};
export type ProcessedConfig = InputConfig;
