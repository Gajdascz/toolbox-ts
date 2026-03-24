import { tryCatch, tryCatchSync, unwrap } from '../../../../result.js';
import { DirectoryError } from '../error.js';
import { type MkOptions, mk, mkSync } from '../mk/index.js';

export interface ChOptions {
  mkdir?: boolean | MkOptions;
}
export interface ChdirResultDetail {
  fromDir: string;
  toDir: string;
  madeDir: boolean;
}
/* c8 ignore start */
const formatChDirError = (fromDir: string, toDir: string, opts: ChOptions) =>
  `Failed to move from ${fromDir} to ${toDir}.\n  mk is ${
    opts.mkdir === false
      ? 'disabled'
      : opts.mkdir === true
        ? 'enabled with defaults'
        : `enabled with settings: ${JSON.stringify(opts.mkdir, null, 2)}`
  }`;
/* c8 ignore stop */

export const tryCh = async (dir: string, opts: ChOptions = {}) => {
  const fromDir = process.cwd();
  return tryCatch<ChdirResultDetail, DirectoryError>(
    async () => {
      if (opts.mkdir !== false) await mk(dir, opts.mkdir === true ? undefined : opts.mkdir);
      process.chdir(dir);
      return { toDir: dir, fromDir, madeDir: opts.mkdir !== false };
    },
    /* c8 ignore next */
    (e) => new DirectoryError(formatChDirError(fromDir, dir, opts), e)
  );
};

export const tryChSync = (dir: string, opts: ChOptions = {}) => {
  const fromDir = process.cwd();
  return tryCatchSync<ChdirResultDetail, DirectoryError>(
    () => {
      if (opts.mkdir !== false) mkSync(dir, opts.mkdir === true ? undefined : opts.mkdir);
      process.chdir(dir);
      return { toDir: dir, fromDir, madeDir: opts.mkdir !== false };
    },
    /* c8 ignore next */
    (e) => new DirectoryError(formatChDirError(fromDir, dir, opts), e)
  );
};

// #region> Unwrapped
/* c8 ignore start */
/** @see {@link tryCh} */
export const ch = async (dir: string, opts?: ChOptions) => unwrap(await tryCh(dir, opts));
/** @see {@link tryChSync} */
export const chSync = (dir: string, opts?: ChOptions) => unwrap(tryChSync(dir, opts));
/* c8 ignore stop */
// #endregion
