import fs from 'node:fs';
import path from 'node:path';

//#region> isDir
/**
 * Check if a path is a directory.
 *
 * @example
 * ```ts
 * console.log(await isDir('/path/to/dir')); // true or false
 * ```
 */
export const isDir = async (p: string): Promise<boolean> => {
  try {
    return (await fs.promises.stat(p)).isDirectory();
  } catch {
    return false;
  }
};
/**
 * Synchronous version of {@link isDir}
 */
export const isDirSync = (p: string): boolean => {
  try {
    const stat = fs.statSync(p);
    return stat.isDirectory();
  } catch {
    return false;
  }
};
//#endregion

//#region> isFile
/**
 * Check if a path is a file.
 *
 * @example
 * ```ts
 * console.log(await isFile('/path/to/file.txt')); // true or false
 * ```
 */
export const isFile = async (p: string): Promise<boolean> => {
  try {
    return (await fs.promises.stat(p)).isFile();
  } catch {
    return false;
  }
};
/**
 * Synchronous version of {@link isFile}
 */
export const isFileSync = (p: string): boolean => {
  try {
    return fs.statSync(p).isFile();
  } catch {
    return false;
  }
};
//#endregion

//#region> hasFiles
/**
 * Check if a path exists.
 *
 * @example
 * ```ts
 * console.log(await exists('/path/to/something')); // true or false
 * ```
 */
export const hasFiles = async (p: string, files: string[]): Promise<boolean> => {
  for (const file of files) if (!(await isFile(path.join(p, file)))) return false;
  return true;
};
/**
 * Check if a list of directories exist within a given path.
 *
 * @example
 * ```ts
 * console.log(await hasDirs('/path/to/dir', ['subdir1', 'subdir2'])); // true or false
 * ```
 */
export const hasFilesSync = (p: string, files: string[]): boolean => {
  for (const file of files) if (!isFileSync(`${p}/${file}`)) return false;
  return true;
};
//#endregion

//#region> hasDirs
/**
 * Check if a list of directories exist within a given path.
 *
 * @example
 * ```ts
 * console.log(await hasDirs('/path/to/dir', ['subdir1', 'subdir2'])); // true or false
 * ```
 */
export const hasDirs = async (p: string, dirs: string[]): Promise<boolean> => {
  for (const dir of dirs) if (!(await isDir(`${p}/${dir}`))) return false;
  return true;
};
/**
 * Check if a list of directories exist within a given path.
 *
 * @example
 * ```ts
 * console.log(hasDirsSync('/path/to/dir', ['subdir1', 'subdir2'])); // true or false
 * ```
 */
export const hasDirsSync = (p: string, dirs: string[]): boolean => {
  for (const dir of dirs) if (!isDirSync(`${p}/${dir}`)) return false;
  return true;
};
//#endregion

//#region> size
/**
 * Get the size of a file in bytes.
 *
 * @example
 * ```ts
 * console.log(await size('/path/to/file.txt')); // size in bytes or null if file does not exist
 * ```
 */
export const size = async (p: string): Promise<null | number> => {
  try {
    return (await fs.promises.stat(p)).size;
  } catch {
    return null;
  }
};
/**
 * Synchronous version of {@link size}
 */
export const sizeSync = (p: string): number | null => {
  try {
    return fs.statSync(p).size;
  } catch {
    return null;
  }
};
//#endregion
