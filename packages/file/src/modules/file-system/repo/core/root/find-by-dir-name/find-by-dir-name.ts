import { Find } from '../../../../find/index.js';
import { unwrap } from '../../../../../result.js';

/** Search for a parent (or child, if direction='down') directory matching the specified name starting from the given cwd. */
export const tryFindRootByDirName = async (
  dirName: string,
  cwd = process.cwd(),
  direction: 'down' | 'up' = 'up'
) =>
  direction === 'up'
    ? await Find.tryLastUp(dirName, { startDir: cwd })
    : await Find.tryFirstDown(dirName, { startDir: cwd });

export const tryFindRootByDirNameSync = (
  dirName: string,
  cwd = process.cwd(),
  direction: 'down' | 'up' = 'up'
) =>
  direction === 'up'
    ? Find.tryLastUpSync(dirName, { startDir: cwd })
    : Find.tryFirstDownSync(dirName, { startDir: cwd });

//#region> Unwrapped
/* c8 ignore start */
/** @see {@link tryFindRootByDirName} */
export const findRootByDirName = async (dirName: string, cwd?: string, direction?: 'down' | 'up') =>
  unwrap(await tryFindRootByDirName(dirName, cwd, direction));
/** @see {@link tryFindRootByDirNameSync} */
export const findRootByDirNameSync = (dirName: string, cwd?: string, direction?: 'down' | 'up') =>
  unwrap(tryFindRootByDirNameSync(dirName, cwd, direction));
/* c8 ignore stop */
//#endregion
