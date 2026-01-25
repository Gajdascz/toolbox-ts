import type { Dependency } from '../../architecture/index.js';

import { DependencyError } from '../../base/Errors.ts';
import { $pnpm } from '../../base/shell-exec.ts';
export async function installDependencies(
  dep: Dependency | Dependency[]
): Promise<void> {
  const deps = Array.isArray(dep) ? dep : [dep];
  for (const { packageName, isDev = false } of deps) {
    try {
      const installCmd = `add${isDev ? ' -D' : ''}`;
      await $pnpm(installCmd + ` ${packageName}`);
    } catch (error) {
      throw new DependencyError(
        `Failed to install ${packageName}: ${(error as Error).message}`
      );
    }
  }
}
