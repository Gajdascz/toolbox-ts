import { entry as baseEntry } from '../base/index.js';
import type { NpmPackageRegisterEntry } from './types.js';
import { NPM_PKG } from '../../../urls/definitions/index.js';

export const entry = <N extends string>({
  dev = true,
  ...rest
}: Parameters<typeof baseEntry<N>>[0] & { dev?: boolean }): NpmPackageRegisterEntry<N> => {
  const [name, entry] = baseEntry<N>({ ...rest });
  return [name, { ...entry, dev, npm: `${NPM_PKG}/${name}` }];
};

export const entries = <N extends string>(
  ...args: { name: N; description: string; repo: string; docs?: string; dev?: boolean }[]
): readonly NpmPackageRegisterEntry<N>[] => args.map(entry);
