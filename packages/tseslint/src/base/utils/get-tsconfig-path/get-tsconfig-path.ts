import { findConfigFile, sys } from 'typescript';

import type { TsconfigFilename, TsconfigFilePath } from '../../types.js';

export const getTsconfigPath = <N extends string>(
  name: TsconfigFilename<N>,
  start = process.cwd()
): TsconfigFilePath<N> => {
  // This is marked as an uncovered branch when run from root for an unknown reason
  /* c8 ignore start */
  const tsconfigFullPath = findConfigFile(
    start,
    sys.fileExists.bind(sys),
    name
  ) as TsconfigFilePath<N> | undefined;
  /* c8 ignore start */

  if (!tsconfigFullPath)
    throw new Error(`Could not find tsconfig file: ${name}`);
  return tsconfigFullPath;
};
