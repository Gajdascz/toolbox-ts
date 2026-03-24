import type { JitiResolveOptions } from 'jiti';
import type { WriteFileOptions as WFO, PatchFileOptions as PFO } from '../../helpers/index.js';

export type LoadOptions = JitiResolveOptions & { default?: true };

export type ParseArgs = [opts?: ParseOptions];
export interface ParseOptions {
  execute?: boolean;
  exportKey?: string;
}
export type WriteFileOptions<D = unknown> = Omit<WFO<D>, 'stringify' | 'fileType'> & {
  stringify: (data: D) => string;
};
export type PatchFileOptions<D> = Omit<PFO<D>, 'stringify' | 'parser' | 'reader' | 'fileType'> & {
  stringify: (data: D) => string;
};
