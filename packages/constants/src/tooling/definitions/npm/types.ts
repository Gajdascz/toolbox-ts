import type { ToolingMeta, ToolingRegisterEntry, ToolingRegistry } from '../base/index.js';

export interface NpmPackageMeta extends ToolingMeta {
  name: string;
  description: string;
  docs: string;
  repo: string;
  npm: string;
  dev: boolean;
}
export type NpmPackageRegistry<N extends string> = ToolingRegistry<N, NpmPackageMeta>;

export type NpmPackageRegisterEntry<N extends string> = ToolingRegisterEntry<N, NpmPackageMeta>;
