import fg from 'fast-glob';
import { Traverse } from '../../../../traverse/index.js';
import { tryCatch, tryCatchSync, unwrap } from '../../../../../result.js';
import type { fgFindSingleInputOpts, FgOptionsWithStartEnd } from '../../types.js';
import { FindError } from '../../error.js';
import {
  fgAll,
  fgAllStep,
  fgSingle,
  handleTraversalResult,
  sFgAll,
  sFgAllStep,
  sFgSingle
} from '../../helpers/helpers.js';
import { tryFirstWhen, tryFirstWhenSync, tryLastWhen, tryLastWhenSync } from '../../when/when.js';

//#region>> all
/**
 * Traverse directories downwards collecting all matches for the pattern.
 *
 * @example
 * ```ts
 * const files = await allDown('*.ts', { startDir: '/project/src' });
 * ```
 */
export const tryAllDown = async (
  pattern: fg.Pattern,
  { startDir = process.cwd(), endDir, ...rest }: FgOptionsWithStartEnd = {}
) =>
  tryCatch<string[], FindError>(
    async () => {
      if (endDir)
        return handleTraversalResult(
          await Traverse.tryDown(async (dir) => ({ result: await fgAllStep(pattern, dir, rest) }), {
            startDir,
            endDir: endDir
          }),
          rest.sort
        );

      return fgAll(pattern, startDir, rest);
    },
    /* c8 ignore next */
    (caught) =>
      new FindError({ direction: 'down', startDir, endDir: endDir, target: 'all' }, caught)
  );

/** synchronous version of {@link allDown} */
export const tryAllDownSync = (
  pattern: fg.Pattern,
  { startDir = process.cwd(), endDir, ...rest }: FgOptionsWithStartEnd = {}
) =>
  tryCatchSync<string[], FindError>(
    () => {
      if (endDir)
        return handleTraversalResult(
          Traverse.tryDownSync((dir) => ({ result: sFgAllStep(pattern, dir, rest) }), {
            startDir,
            endDir: endDir
          }),
          rest.sort
        );
      return sFgAll(pattern, startDir, rest);
    },
    /* c8 ignore next */
    (e) => new FindError({ direction: 'down', startDir, target: 'all', endDir }, e)
  );

//#endregion
//#region>> first
/**
 * Find the first matching file downwards.
 *
 * @example
 * ```ts
 * const file = await tryFirstDown('*.js', { startDir: '/project/src' });
 * ```
 */
export const tryFirstDown = async (
  pattern: fg.Pattern,
  { startDir = process.cwd(), ...rest }: fgFindSingleInputOpts = {}
) =>
  tryFirstWhen(async (dir) => await fgSingle(pattern, dir, 0, rest), {
    startDir,
    direction: 'down'
  });

/** synchronous version of {@link firstDown} */
export const tryFirstDownSync = (
  pattern: fg.Pattern,
  { startDir = process.cwd(), ...rest }: fgFindSingleInputOpts = {}
) => tryFirstWhenSync((dir) => sFgSingle(pattern, dir, 0, rest), { startDir, direction: 'down' });

//#endregion
//#region>> last
/**
 * Find the last matching file downwards.
 *
 * @example
 * ```ts
 * const file = await tryLastDown('*.js', { startDir: '/project/src' });
 * ```
 */
export const tryLastDown = async (
  pattern: fg.Pattern,
  { startDir = process.cwd(), endDir, ...rest }: fgFindSingleInputOpts = {}
) =>
  tryLastWhen(async (dir) => await fgSingle(pattern, dir, -1, rest), {
    startDir,
    endDir,
    direction: 'down'
  });

/** synchronous version of {@link lastDown} */
export const tryLastDownSync = (
  pattern: fg.Pattern,
  { startDir = process.cwd(), ...rest }: fgFindSingleInputOpts = {}
) => tryLastWhenSync((dir) => sFgSingle(pattern, dir, -1, rest), { startDir, direction: 'down' });

//#endregion

//#region> Unwrapped
/* c8 ignore start */
/** @see {@link tryAllDown} */
export const allDown = async (pattern: fg.Pattern, opts?: FgOptionsWithStartEnd) =>
  unwrap(await tryAllDown(pattern, opts));
/** @see {@link tryAllDownSync} */
export const allDownSync = (pattern: fg.Pattern, opts?: FgOptionsWithStartEnd) =>
  unwrap(tryAllDownSync(pattern, opts));
/** @see {@link tryFirstDown} */
export const firstDown = async (pattern: fg.Pattern, opts?: fgFindSingleInputOpts) =>
  unwrap(await tryFirstDown(pattern, opts));
/** @see {@link tryFirstDownSync} */
export const firstDownSync = (pattern: fg.Pattern, opts?: fgFindSingleInputOpts) =>
  unwrap(tryFirstDownSync(pattern, opts));
/** @see {@link tryLastDown} */
export const lastDown = async (pattern: fg.Pattern, opts?: fgFindSingleInputOpts) =>
  unwrap(await tryLastDown(pattern, opts));
/** @see {@link tryLastDownSync} */
export const lastDownSync = (pattern: fg.Pattern, opts: fgFindSingleInputOpts) =>
  unwrap(tryLastDownSync(pattern, opts));
/* c8 ignore stop */
//#endregion
