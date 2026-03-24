import { hasFiles, hasFilesSync } from '../../../../queries/index.js';
import { Find } from '../../../../find/index.js';
import { unwrap } from '../../../../../result.js';

const defaultRootDirIdentifierFiles = ['.git', 'package.json'];

/**
 * Find the repo root by looking for files that typically indicate a repo root (like .git or package.json).
 * - You can customize the files to look for by providing an array of file names.
 * - Returns the first directory found that contains all specified files “so ensure the files you provide are all together exclusively in the root”
 * @example
 * ```ts
 * const root = await findRootByFiles(['.git', 'package.json']);
 * console.log(root); // e.g., '/path/to/repo'
 * ```
 */
export const tryFindRootByFileNames = async (
  identifierFiles = defaultRootDirIdentifierFiles,
  cwd = process.cwd()
) =>
  Find.tryFirstWhen(async (dir) => ((await hasFiles(dir, identifierFiles)) ? dir : null), {
    startDir: cwd
  });

export const tryFindRootByFileNamesSync = (
  identifierFiles = defaultRootDirIdentifierFiles,
  cwd = process.cwd()
) =>
  Find.tryFirstWhenSync((dir) => (hasFilesSync(dir, identifierFiles) ? dir : null), {
    startDir: cwd
  });

//#region> Unwrapped
/* c8 ignore start */
/** @see {@link tryFindRootByFileNames} */
export const findRootByFileNames = async (identifierFiles?: string[], cwd?: string) =>
  unwrap(await tryFindRootByFileNames(identifierFiles, cwd));
/** @see {@link tryFindRootByFileNamesSync} */
export const findRootByFileNamesSync = (identifierFiles?: string[], cwd?: string) =>
  unwrap(tryFindRootByFileNamesSync(identifierFiles, cwd));
/* c8 ignore stop */
//#endregion
