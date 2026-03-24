import fg from 'fast-glob';
import path from 'node:path';
import { Traverse } from '../../../../traverse/index.js';
import { tryCatch, tryCatchSync, unwrap } from '../../../../../result.js';
import { FindError } from '../../error.js';
import type { fgFindSingleInputOpts, FgOptionsWithStartEnd } from '../../types.js';
import {
  fgAllStep,
  fgSingle,
  handleTraversalResult,
  sFgAllStep,
  sFgSingle
} from '../../helpers/helpers.js';
import { tryLastWhen, tryFirstWhen, tryLastWhenSync, tryFirstWhenSync } from '../../when/when.js';
const resolveUpOpts = ({
  startDir = process.cwd(),
  endDir = path.parse(startDir).root,
  ...rest
}: FgOptionsWithStartEnd): FgOptionsWithStartEnd & { startDir: string; endDir: string } => ({
  startDir,
  endDir,
  ...rest
});
//#region>> all
/**
 * Traverse directories upwards collecting all matches for the pattern.
 *
 * @example
 * ```ts
 * const files = await allUp('*.ts', { startDir: '/project/src' });
 * ```
 */
export const tryAllUp = async (pattern: fg.Pattern, opts: FgOptionsWithStartEnd = {}) => {
  const { startDir, endDir, sort, ...rest } = resolveUpOpts(opts);
  return tryCatch<string[], FindError>(
    async () =>
      handleTraversalResult(
        await Traverse.tryUp(async (dir) => ({ result: await fgAllStep(pattern, dir, rest) }), {
          startDir,
          endDir: endDir
        }),
        sort
      ),
    /* c8 ignore next */
    (caught) => new FindError({ startDir, direction: 'up', endDir: endDir, target: 'all' }, caught)
  );
};

/** synchronous version of {@link tryAllUp} */
export const tryAllUpSync = (pattern: fg.Pattern, opts: FgOptionsWithStartEnd = {}) => {
  const { startDir, endDir, sort, ...rest } = resolveUpOpts(opts);
  return tryCatchSync<string[], FindError>(
    () =>
      handleTraversalResult(
        Traverse.tryUpSync((dir) => ({ result: sFgAllStep(pattern, dir, rest) }), {
          startDir,
          endDir: endDir
        }),
        sort
      ),
    /* c8 ignore next */
    (e) => new FindError({ direction: 'up', target: 'all', startDir, endDir }, e)
  );
};

//#endregion
//#region>> first
/**
 * Find the first file matching a pattern starting from a directory and traversing up
 * to an end directory.
 * - Search begins in `startDir` and continues up the directory tree until `endDir` is reached. `endDir` is not included in the search.
 * - If `endDir` is not provided, the search continues up to the filesystem root.
 * - The search is performed in each directory level, looking for files that match the provided glob `pattern`.
 * - Returns `null` if no file is found or the absolute path if found.
 *
 * @throws if `startDir` does not exist or is not a directory.
 *
 * @example
 * ```ts
 * // Given the following directory structure:
 * // /root
 * // ├── l1
 * // │   ├── file1.txt
 * // │   └── l2
 * // │       ├── file2.log
 * // │       └── l3
 * // │           ├── file3.txt
 * // │           └── l4
 * // │               └── file4.txt
 * //
 * // Example 1: Find the first .txt file starting from /root/l1/l2/l3/l4 up to /root
 * const result1 = await firstUp('*.txt', { startDir: '/root/l1/l2/l3/l4', endDir: '/root' }); // returns '/root/l1/l2/l3/l4/file4.txt'
 *
 * // Example 2: Find the first .log file starting from /root/l1/l2/l3/l4 up to /root/l1
 * const result2 = await firstUp('*.log', { startDir: '/root/l1/l2/l3/l4', endDir: '/root/l1' }); // returns '/root/l1/l2/file2.log'
 *
 * ```
 */
export const tryFirstUp = async (pattern: fg.Pattern, opts: fgFindSingleInputOpts = {}) => {
  const { endDir, startDir, ...rest } = resolveUpOpts(opts);
  return tryFirstWhen(async (dir) => await fgSingle(pattern, dir, 0, rest), {
    startDir,
    endDir,
    direction: 'up'
  });
};

/** synchronous version of {@link tryFirstUp} */
export const tryFirstUpSync = (pattern: fg.Pattern, opts: fgFindSingleInputOpts = {}) => {
  const { endDir, startDir, ...rest } = resolveUpOpts(opts);
  return tryFirstWhenSync((dir) => sFgSingle(pattern, dir, 0, rest), {
    startDir,
    endDir,
    direction: 'up'
  });
};

//#endregion
//#region>> last
/**
 * Find the last matching file upwards.
 *
 * @example
 * ```ts
 * const file = await lastUp('*.js', { startDir: '/project/src' });
 * ```
 */
export const tryLastUp = async (pattern: fg.Pattern, opts: fgFindSingleInputOpts = {}) => {
  const { endDir, startDir, ...rest } = resolveUpOpts(opts);
  return tryLastWhen(async (dir) => await fgSingle(pattern, dir, -1, rest), {
    startDir,
    endDir,
    direction: 'up'
  });
};

/** synchronous version of {@link tryLastUp} */
export const tryLastUpSync = (pattern: fg.Pattern, opts: fgFindSingleInputOpts = {}) => {
  const { endDir, startDir, ...rest } = resolveUpOpts(opts);
  return tryLastWhenSync((dir) => sFgSingle(pattern, dir, -1, rest), {
    startDir,
    endDir,
    direction: 'up'
  });
};
//#endregion

//#region> Unwrapped
/* c8 ignore start */
/** @see tryAllUp */
export const allUp = async (pattern: fg.Pattern, opts: FgOptionsWithStartEnd = {}) =>
  unwrap(await tryAllUp(pattern, opts));
/** @see tryAllUpSync */
export const allUpSync = (pattern: fg.Pattern, opts: FgOptionsWithStartEnd = {}) =>
  unwrap(tryAllUpSync(pattern, opts));
/** @see tryFirstUp */
export const firstUp = async (pattern: fg.Pattern, opts: fgFindSingleInputOpts = {}) =>
  unwrap(await tryFirstUp(pattern, opts));
/** @see tryFirstUpSync */
export const firstUpSync = (pattern: fg.Pattern, opts: fgFindSingleInputOpts = {}) =>
  unwrap(tryFirstUpSync(pattern, opts));
/** @see tryLastUp */
export const lastUp = async (pattern: fg.Pattern, opts: fgFindSingleInputOpts = {}) =>
  unwrap(await tryLastUp(pattern, opts));
/** @see tryLastUpSync */
export const lastUpSync = (pattern: fg.Pattern, opts: fgFindSingleInputOpts = {}) =>
  unwrap(tryLastUpSync(pattern, opts));
/* c8 ignore stop */
//#endregion
