import path from 'node:path';
import { toParent as _toParent, defaultResultHandler, normalizeStartEnd } from '../utils/index.js';
import { tryCatch, tryCatchSync, unwrap } from '../../../../result.js';
import { TraverseError } from '../error.js';
import type { Opts, OnDirAsync, OnDirSync } from '../types.js';

/**
 * Traverse up to a parent directory.
 * - Returns `null` if the current directory is the same as or a parent of the end directory.
 *
 * @example
 * ```ts
 * console.log(toParent('/a/b/c', '/a')); // '/a/b'
 * console.log(toParent('/a/b/c', '/a/b')); // '/a/b'
 * console.log(toParent('/a/b/c', '/a/b/c')); // null
 * console.log(toParent('/a/b/c')); // '/a/b'
 * console.log(toParent('/')); // null
 * ```
 */
export const tryToParent = (dir: string) => {
  const parent = path.parse(dir).root;
  return tryCatchSync<string | null, TraverseError>(
    () => _toParent(dir, parent),
    /* c8 ignore next */
    (caught) => new TraverseError({ direction: 'up', startDir: dir, endDir: parent }, caught)
  );
};

/**
 * Traverse upward from a starting directory to an optional end directory, invoking a callback on each directory.
 * - The traversal stops if the callback returns `{ break: true }`.
 * - The callback can return a result that will be collected and returned as an array.
 *
 * @example
 * ```ts
 * // Example: Collect names of all directories up to the root
 * const results = await up(
 *   async (dir) => ({ result: path.basename(dir) }),
 *   { startDir: '/a/b/c', endDir: '/a' }
 * );
 * console.log(results); // ['c', 'b']
 * ```
 */
export const tryUp = async <R>(
  onDir: OnDirAsync<R>,
  {
    startDir = process.cwd(),
    endDir = path.parse(startDir).root,
    resultHandler = defaultResultHandler
  }: Opts<R> = {}
) => {
  return tryCatch<R[], TraverseError>(
    async () => {
      const { start, end } = normalizeStartEnd('up', startDir, endDir);
      const detail: R[] = [];
      let curr: null | string = start;
      while (curr) {
        const { break: shouldBreak, result } = await onDir(curr);
        if (result) resultHandler(result, detail, curr);
        if (shouldBreak) return detail;
        curr = _toParent(curr, end);
      }
      return detail;
    },
    /* c8 ignore next */
    (caught) => new TraverseError({ direction: 'up', startDir, endDir }, caught)
  );
};

/** Synchronous version of {@link up} */
export const tryUpSync = <R>(
  onDir: OnDirSync<R>,
  {
    startDir = process.cwd(),
    endDir = path.parse(startDir).root,
    resultHandler = defaultResultHandler
  }: Opts<R> = {}
) => {
  return tryCatchSync<R[], TraverseError>(
    () => {
      const { start, end } = normalizeStartEnd('up', startDir, endDir);
      const detail: R[] = [];
      let curr: null | string = start;
      while (curr) {
        const { break: shouldBreak, result } = onDir(curr);
        if (result) resultHandler(result, detail, curr);
        if (shouldBreak) return detail;
        curr = _toParent(curr, end);
      }
      return detail;
    },
    /* c8 ignore next */
    (caught) => new TraverseError({ direction: 'up', startDir, endDir }, caught)
  );
};
//#region> Unwrapped
/* c8 ignore start */
/** @see {@link tryToParent} */
export const toParent = (dir: string) => unwrap(tryToParent(dir));
/** @see {@link tryUp} */
export const up = async <R>(onDir: OnDirAsync<R>, opts?: Opts<R>) =>
  unwrap(await tryUp(onDir, opts));
/** @see {@link tryUpSync} */
export const upSync = <R>(onDir: OnDirSync<R>, opts?: Opts<R>) => unwrap(tryUpSync(onDir, opts));
/* c8 ignore stop */
//#endregion
