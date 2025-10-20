import fg from 'fast-glob';
import fs from 'node:fs';
import path from 'node:path';

import { initQueueLike, type QueueLike } from '../helpers/index.js';
import {
  defaultResultHandler,
  normalizeStartEnd,
  toParent
} from './utils/index.js';

//#region> Types
export interface TraverseDownOpts<R> extends TraverseOpts<R> {
  queue?: QueueLike;
}

/**
 * Callback invoked for each directory during traversal.
 * - Can be asynchronous.
 * - Returning `{ break: true }` will stop the traversal.
 * - The `result` can be a single value or an array of values, which will be collected and returned.
 */
export type TraverseOnDirAsync<R> = (
  dir: string
) => Promise<TraverseOnDirResult<R>> | TraverseOnDirResult<R>;

/**
 * The result of the `onDir` callback.
 * - If `break` is `true`, the traversal will stop.
 * - The `result` can be a single value or an array of values, which will be collected and returned.
 */
export type TraverseOnDirResult<R> =
  | { break: true; result: R | R[] }
  | { break?: false | null | undefined; result?: R | R[] };

/**
 * Synchronous version of @see TraverseOnDirAsync.
 */
export type TraverseOnDirSync<R> = (dir: string) => TraverseOnDirResult<R>;
export interface TraverseOpts<R> {
  /**
   * An optional directory to stop at (exclusive).
   */
  endAtDir?: string;
  /**
   * A function to handle results as they are produced.
   * - Defaults to accumulating results in an array.
   * - If `result` is an array, it will be spread into the accumulator.
   * - If `result` is a single value, it will be pushed into the accumulator.
   * - This modifies the curr array in place.
   */
  resultHandler?: (res: R | R[], curr: R[], dir?: string) => void;

  /**
   * The directory to start traversing from (inclusive).
   *
   * @default process.cwd()
   */
  startDir?: string;
}
//#endregion

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
 * Traverse traverseUp to a parent directory.
 * - Returns `null` if the current directory is the same as or a parent of the end directory.
 *
 * @example
 * ```ts
 * console.log(traverseToParent('/a/b/c', '/a')); // '/a/b'
 * console.log(traverseToParent('/a/b/c', '/a/b')); // '/a/b'
 * console.log(traverseToParent('/a/b/c', '/a/b/c')); // null
 * console.log(traverseToParent('/a/b/c')); // '/a/b'
 * console.log(traverseToParent('/')); // null
 * ```
 */
export const traverseToParent = (dir: string, end?: null | string) => {
  const { start: curr, end: e } = normalizeStartEnd(
    dir,
    end ?? path.parse(dir).root
  );
  return toParent(curr, e);
};

/**
 * Traverse upward from a starting directory to an optional end directory, invoking a callback on each directory.
 * - The traversal stops if the callback returns `{ break: true }`.
 * - The callback can return a result that will be collected and returned as an array.
 *
 * @example
 * ```ts
 * // Example: Collect names of all directories traverseUp to the root
 * const results = await traverseUp(
 *   async (dir) => ({ result: path.basename(dir) }),
 *   { startDir: '/a/b/c', endAtDir: '/a' }
 * );
 * console.log(results); // ['c', 'b']
 * ```
 */
export const traverseUp = async <R>(
  onDir: TraverseOnDirAsync<R>,
  {
    startDir = process.cwd(),
    endAtDir = path.parse(startDir).root,
    resultHandler = defaultResultHandler
  }: TraverseOpts<R> = {}
) => {
  const { start, end } = normalizeStartEnd(startDir, endAtDir);

  const results: R[] = [];
  let curr: null | string = start;
  while (curr) {
    const { break: shouldBreak, result } = await onDir(curr);
    if (result) resultHandler(result, results, curr);
    if (shouldBreak) return results;
    curr = toParent(curr, end);
  }
  return results;
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
 *   { startDir: '/a', endAtDir: '/a/b/c' }
 * );
 * console.log(results); // ['a', 'b']
 * ```
 */
export async function traverseDown<R>(
  onDir: TraverseOnDirAsync<R>,
  {
    queue = undefined,
    startDir = process.cwd(),
    endAtDir,
    resultHandler = defaultResultHandler
  }: TraverseDownOpts<R> = {}
): Promise<R[]> {
  const results: R[] = [];
  const q = initQueueLike(queue);
  const { start, end } = normalizeStartEnd(startDir, endAtDir);
  if (start === end) {
    const { result } = await onDir(start);
    if (result) resultHandler(result, results, start);
    return results;
  }
  q.enqueue(start);
  while (q.length > 0) {
    const curr = q.dequeue();
    if (!curr || curr === end) break;
    const { break: shouldBreak, result } = await onDir(curr);
    if (result) resultHandler(result, results, curr);
    if (shouldBreak) return results;
    const subDirs = await fg('*', { ...getSubDirOpts, cwd: curr });
    q.enqueue(...subDirs);
  }
  return results;
}

/** Synchronous version of {@link traverseUp} */
export const syncTraverseUp = <R>(
  onDir: TraverseOnDirSync<R>,
  {
    startDir = process.cwd(),
    endAtDir = path.parse(startDir).root,
    resultHandler = defaultResultHandler
  }: TraverseOpts<R> = {}
) => {
  const results: R[] = [];
  const { start, end } = normalizeStartEnd(startDir, endAtDir);
  let curr: null | string = start;
  while (curr) {
    const { break: shouldBreak, result } = onDir(curr);
    if (result) resultHandler(result, results, curr);
    if (shouldBreak) return results;
    curr = toParent(curr, end);
  }
  return results;
};
/** Synchronous version of {@link traverseDown} */
export const syncTraverseDown = <R>(
  onDir: TraverseOnDirSync<R>,
  {
    startDir = process.cwd(),
    endAtDir,
    resultHandler = defaultResultHandler,
    queue = undefined
  }: TraverseDownOpts<R> = {}
) => {
  const results: R[] = [];
  const { start, end } = normalizeStartEnd(startDir, endAtDir);
  if (start === end) {
    const { result } = onDir(start);
    if (result) resultHandler(result, results, start);
    return results;
  }
  const q = initQueueLike(queue);
  q.enqueue(start);
  while (q.length > 0) {
    const curr = q.dequeue();
    if (!curr || curr === end) break;
    const { break: shouldBreak, result } = onDir(curr);
    if (result) resultHandler(result, results, curr);
    if (shouldBreak) return results;
    const subDirs = fg.sync('*', { ...getSubDirOpts, cwd: curr });
    q.enqueue(...subDirs);
  }
  return results;
};
