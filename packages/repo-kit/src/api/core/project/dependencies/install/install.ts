import type { ConfigModuleDependency } from '@toolbox-ts/configs/core';

import { DependencyError } from '../../../../Errors.js';
import { $pnpm } from '../../shell-exec.js';
import { fetchPeerDependencies } from '../fetch-peers/fetch-peers.js';
export interface InstallDependencyOptions {
  installPeerDependencies?: boolean;
  isDev?: boolean;
}
export interface InstallDependencyResult {
  packageName: string;
  peers?: string[];
}
export async function installDependencies(
  packages: [packageName: string, opts?: InstallDependencyOptions][]
): Promise<InstallDependencyResult[]> {
  const results: InstallDependencyResult[] = [];
  for (const [pkg, opts] of packages)
    results.push(await installDependency(pkg, opts));
  return results;
}
export async function installDependency(
  packageName: string,
  { isDev, installPeerDependencies } = {} as InstallDependencyOptions
): Promise<InstallDependencyResult> {
  const installCmd = `add${isDev ? ' -D' : ''}`;
  const result: InstallDependencyResult = { packageName };
  try {
    await $pnpm(installCmd + ` ${packageName}`);
    if (installPeerDependencies)
      result.peers = await installPeers(packageName, isDev);
    return result;
  } catch (error) {
    throw new DependencyError(
      `Failed to install ${packageName}: ${(error as Error).message}`
    );
  }
}
export async function installPeers(
  packageName: string,
  isDev = false
): Promise<string[]> {
  const peers = await fetchPeerDependencies(packageName);
  for (const peer of peers) {
    await installDependency(peer, { isDev });
  }
  return peers;
}

export const mapConfigModuleDeps = (
  deps:
    | ConfigModuleDependency[]
    | readonly ConfigModuleDependency[]
    | readonly string[]
    | string[],
  {
    installPeerDependencies: instP,
    isDev = true
  }: InstallDependencyOptions = {}
): [packageName: string, opts: InstallDependencyOptions][] =>
  deps.map((d) => [
    typeof d === 'string' ? d : d.packageName,
    { isDev, installPeerDependencies: instP }
  ]);
