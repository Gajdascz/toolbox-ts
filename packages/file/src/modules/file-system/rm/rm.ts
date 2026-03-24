import fs from 'node:fs';
import { OperationError, tryCatch, tryCatchSync, unwrap } from '../../result.js';

/* c8 ignore start */
const formatError = (path: string, options: fs.RmOptions) =>
  `Failed to remove content at path: ${path}\n   with options: ${JSON.stringify(options, null, 2)}`;
/* c8 ignore stop */

export const tryRm = async (
  path: string,
  { force = false, recursive = true, ...rest }: fs.RmOptions = {}
) =>
  tryCatch(
    async () => {
      await fs.promises.rm(path, { force, recursive, ...rest });
      return path;
    },
    /* c8 ignore next */
    (e) => new OperationError(formatError(path, { force, recursive, ...rest }), e)
  );

export const tryRmSync = (
  path: string,
  { force = false, recursive = true, ...rest }: fs.RmOptions = {}
) =>
  tryCatchSync(
    () => {
      fs.rmSync(path, { force, recursive, ...rest });
      return path;
    },
    /* c8 ignore next */
    (e) => new OperationError(formatError(path, { force, recursive, ...rest }), e)
  );
// #region> Unwrapped
/* c8 ignore start */
/** @see {@link tryRm} */
export const rm = async (path: string, opts?: fs.RmOptions) => unwrap(await tryRm(path, opts));
/** @see {@link tryRmSync} */
export const rmSync = (path: string, opts?: fs.RmOptions) => unwrap(tryRmSync(path, opts));
/* c8 ignore stop */
// #endregion
