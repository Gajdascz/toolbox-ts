import fs from 'node:fs';
import { tryCatch, tryCatchSync, unwrap } from '../../../../result.js';
import { DirectoryError } from '../error.js';

export interface MkOptions extends fs.MakeDirectoryOptions {
  /**
   * Indicates whether parent folders should be created. If a folder was created, the path to the first created folder will be returned.
   *
   * @default true
   */
  recursive?: boolean;
  /**
   * A file mode. If a string is passed, it is parsed as an octal integer.
   * @default 0o777
   */
  mode?: number | string;
}

/**
 * Creates a directory at the specified path. If the directory already exists, no error is thrown.
 */
export const tryMk = async (dir: string, { recursive = true, mode }: MkOptions = {}) =>
  tryCatch(
    async () => {
      const res = await fs.promises.mkdir(dir, { recursive, mode });
      return res ?? dir;
    },
    /* c8 ignore next */
    (e) => new DirectoryError(`Failed to create directory: ${dir}`, e)
  );
/** Synchronous version of {@link tryMk} */
export const tryMkSync = (dir: string, { recursive = true, mode }: MkOptions = {}) =>
  tryCatchSync(
    () => {
      const res = fs.mkdirSync(dir, { recursive, mode });
      return res ?? dir;
    },
    /* c8 ignore next */
    (e) => new DirectoryError(`Failed to create directory: ${dir}`, e)
  );

// #region> Unwrapped
/* c8 ignore start */
/** @see {@link tryMk} */
export const mk = async (dir: string, opts?: MkOptions) => unwrap(await tryMk(dir, opts));
/** @see {@link tryMkSync} */
export const mkSync = (dir: string, opts?: MkOptions) => unwrap(tryMkSync(dir, opts));
/* c8 ignore stop */
// #endregion
