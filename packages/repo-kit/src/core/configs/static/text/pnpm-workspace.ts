import type { RequiredProps, PnpmWorkspaceYaml } from '@toolbox-ts/types';
import { dedupeArrays } from '../../../../../core/index.js';

export const DEFAULTS: RequiredProps<PnpmWorkspaceYaml, 'packages'> = {
  packages: ['packages/*']
} as const;

export const define = ({
  packages = [],
  ...rest
}: Partial<PnpmWorkspaceYaml> = {}): PnpmWorkspaceYaml => ({
  packages: dedupeArrays(DEFAULTS.packages, packages),
  ...rest
});
