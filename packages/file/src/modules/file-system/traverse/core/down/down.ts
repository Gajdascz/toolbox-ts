import fg from 'fast-glob';
import fs from 'node:fs';

import { toParent as _toParent, defaultResultHandler, normalizeStartEnd } from '../utils/index.js';
import { tryCatch, tryCatchSync, unwrap } from '../../../../result.js';
import { initQueueLike, type QueueLike } from '../../../../helpers/queuelike/index.js';
import type { OnDirAsync, OnDirSync, Opts } from '../types.js';
import { TraverseError } from '../error.js';

export interface DownOpts<R> extends Opts<R> {
  queue?: QueueLike;
}

const getSubDirOpts: fg.Options = {
  onlyDirectories: true,
  deep: 0,
  dot: true,
  unique: true,
  absolute: true,
  fs: fs,
  ignore: ['**/node_modules/**', '**/dist/**']
};

/**
 * Traverse traverseDown from a starting directory to an optional end directory, invoking a callback on each directory.
 * - The traversal stops if the callback returns `{ break: true }`.
 * - The callback can return a result that will be collected and returned as an array.
 *
 * @example
 * ```ts
 * // Example: Collect names of all directories traverseDown to a specific directory
 * const results = await traverseDown(
 *   async (dir) => ({ result: path.basename(dir) }),
 *   { startDir: '/a', endDir: '/a/b/c' }
 * );
 * console.log(results); // ['a', 'b']
 * ```
 */
export const tryDown = async <R>(
  onDir: OnDirAsync<R>,
  {
    queue,
    startDir = process.cwd(),
    endDir,
    resultHandler = defaultResultHandler
  }: DownOpts<R> = {}
) => {
  return tryCatch<R[], TraverseError>(
    async () => {
      const { start, end } = normalizeStartEnd('down', startDir, endDir);
      const detail: R[] = [];
      if (start === end) {
        const { result } = await onDir(start);
        if (result) resultHandler(result, detail, start);
        return detail;
      }
      const q = initQueueLike(queue);
      q.enqueue(start);
      while (q.length > 0) {
        const curr = q.dequeue();
        if (!curr || curr === end) break;
        const { break: shouldBreak, result } = await onDir(curr);
        if (result) resultHandler(result, detail, curr);
        if (shouldBreak) return detail;
        const subDirs = await fg('*', { ...getSubDirOpts, cwd: curr });
        q.enqueue(...subDirs);
      }
      return detail;
    },
    /* c8 ignore next */
    (caught) => new TraverseError({ direction: 'down', startDir, endDir }, caught)
  );
};

/** Synchronous version of {@link traverseDown} */
export const tryDownSync = <R>(
  onDir: OnDirSync<R>,
  {
    startDir = process.cwd(),
    endDir,
    resultHandler = defaultResultHandler,
    queue
  }: DownOpts<R> = {}
) => {
  return tryCatchSync<R[], TraverseError>(
    () => {
      const { end, start } = normalizeStartEnd('down', startDir, endDir);
      const detail: R[] = [];
      if (start === end) {
        const { result } = onDir(start);
        if (result) resultHandler(result, detail, start);
        return detail;
      }
      const q = initQueueLike(queue);
      q.enqueue(start);
      while (q.length > 0) {
        const curr = q.dequeue();
        if (!curr || curr === end) break;
        const { break: shouldBreak, result } = onDir(curr);
        if (result) resultHandler(result, detail, curr);
        if (shouldBreak) return detail;
        const subDirs = fg.sync('*', { ...getSubDirOpts, cwd: curr });
        q.enqueue(...subDirs);
      }
      return detail;
    },
    /* c8 ignore next */
    (caught) => new TraverseError({ direction: 'down', startDir, endDir }, caught)
  );
};

// #region> Unwrapped
/* c8 ignore start */
/** @see {@link tryDown} */
export const down = async <R>(onDir: OnDirAsync<R>, opts?: DownOpts<R>) =>
  unwrap(await tryDown(onDir, opts));
/** @see {@link tryDownSync} */
export const downSync = <R>(onDir: OnDirSync<R>, opts?: DownOpts<R>) =>
  unwrap(tryDownSync(onDir, opts));
/* c8 ignore stop */
//#endregion
