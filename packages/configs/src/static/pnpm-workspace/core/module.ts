import { DIRS, FILES } from '@toolbox-ts/constants/fs';
import type { Pnpm } from '@toolbox-ts/types/defs/configs';
import { Arr } from '@toolbox-ts/utils';
import { stringify } from 'yaml';
export type Config = Pnpm.WorkspaceYAML;
export type InputConfig = Partial<Pnpm.WorkspaceYAML>;
export type ProcessedConfig = Config;

/**
 * Produces a pnpm-workspace.yaml object.
 * - `packages`: Merged unique with default package glob, sorted alphabetically.
 */
export const define = ({ packages = [], ...rest }: InputConfig = {}): ProcessedConfig => ({
  packages: Arr.mergeUnique([`${DIRS.PACKAGES}/*`], packages).sort(),
  ...rest
});

export const toFileEntry = (config?: InputConfig) => ({
  [FILES.PNPM.WS_YAML]: stringify(define(config))
});
