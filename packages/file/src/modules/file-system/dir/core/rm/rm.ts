import fs from 'node:fs';
import { tryCatch, tryCatchSync, unwrap } from '../../../../result.js';
import { DirectoryError } from '../error.js';

const RM_DIR_ERROR = `Failed to remove directory`;
/**
 * Removes the directory at the specified path. The directory must be empty for this operation to succeed.
 */
export const tryRm = async (dir: string) =>
  tryCatch(
    async () => {
      await fs.promises.rmdir(dir);
      return dir;
    },
    /* c8 ignore next */
    (e) => new DirectoryError(`${RM_DIR_ERROR}: ${dir}`, e)
  );

/** Synchronous version of {@link tryRm} */
export const tryRmSync = (dir: string) =>
  tryCatchSync(
    () => {
      fs.rmdirSync(dir);
      return dir;
    },
    /* c8 ignore next */
    (e) => new DirectoryError(`${RM_DIR_ERROR}: ${dir}`, e)
  );

// #region> Unwrapped
/* c8 ignore start */
/** @see {@link tryRm} */
export const rm = async (dir: string) => unwrap(await tryRm(dir));
/** @see {@link tryRmSync} */
export const rmSync = (dir: string) => unwrap(tryRmSync(dir));
/* c8 ignore stop */
// #endregion
