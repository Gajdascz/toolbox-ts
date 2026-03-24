import fg from 'fast-glob';
import { tryCatch, tryCatchSync, unwrap } from '../../../../../result.js';
import { FindError } from '../../error.js';
import { fgAllStep, sFgAllStep, fgSingle, sFgSingle } from '../../helpers/helpers.js';

import type { FgOptions } from '../../types.js';
//#region> all
/**
 * Finds all matches for the pattern in the specified directory.
 *
 * @example

 * ```ts
 * /root
 * ├─ l1
 * │  ├─ file1.ts
 * │  ├─ file2.js
 * │  ├─ file3.ts
 * │  └─ l2
 * │      ├─ file2.log
 * │      └─ l3
 * 
 * const files = await allAt('*.ts', '/root/l1');
 * // files = ['/root/l1/file1.ts', '/root/l1/file3.ts']
 * ```
 */
export const tryAllAt = async (pattern: fg.Pattern, dir: string, opts: FgOptions = {}) =>
  tryCatch<string[], FindError>(
    () => fgAllStep(pattern, dir, opts),
    /* c8 ignore next */
    (caught) => new FindError({ startDir: dir, direction: 'at', target: 'all' }, caught)
  );
/** Synchronous version of {@link tryAllAt} */
export const tryAllAtSync = (pattern: fg.Pattern, dir: string, opts: FgOptions = {}) =>
  tryCatchSync<string[], FindError>(
    () => sFgAllStep(pattern, dir, opts),
    /* c8 ignore next */
    (caught) => new FindError({ startDir: dir, direction: 'at', target: 'all' }, caught)
  );

//#endregion

//#region> first
/**
 * Finds the first match for the pattern in the specified directory.
 *
 * @example
 * ```ts
 * /root
 * ├─ l1
 * │  ├─ file1.ts
 * │  ├─ file2.js
 * │  ├─ file3.ts
 * │  └─ l2
 * │      ├─ file2.log
 * │      └─ l3
 *
 * const file = await firstAt('*.ts', '/root/l1');
 * // file = '/root/l1/file1.ts'
 * ```
 */
export const tryFirstAt = async (pattern: fg.Pattern, dir: string, opts: FgOptions = {}) =>
  tryCatch<string | null, FindError>(
    async () => await fgSingle(pattern, dir, 0, opts),
    /* c8 ignore next */
    (caught) => new FindError({ startDir: dir, direction: 'at', target: 'first' }, caught)
  );

/** Synchronous version of {@link tryFirstAt} */
export const tryFirstAtSync = (pattern: fg.Pattern, dir: string, opts: FgOptions = {}) =>
  tryCatchSync<string | null, FindError>(
    () => sFgSingle(pattern, dir, 0, opts),
    /* c8 ignore next */
    (caught) => new FindError({ startDir: dir, direction: 'at', target: 'first' }, caught)
  );

//#endregion
//#region> last
/**
 * Finds the last match for the pattern in the specified directory.
 *
 * @example
 * ```ts
 * /root
 * ├─ l1
 * │  ├─ file1.ts
 * │  ├─ file2.js
 * │  ├─ file3.ts
 * │  └─ l2
 * │      ├─ file2.log
 * │      └─ l3
 *
 * const file = await lastAt('*.ts', '/root/l1');
 * // file = '/root/l1/file3.ts'
 * ```
 */
export const tryLastAt = async (pattern: fg.Pattern, dir: string, opts: FgOptions = {}) =>
  tryCatch<string | null, FindError>(
    async () => await fgSingle(pattern, dir, -1, opts),
    /* c8 ignore next */
    (caught) => new FindError({ startDir: dir, direction: 'at', target: 'last' }, caught)
  );

/** Synchronous version of {@link tryLastAt} */
export const tryLastAtSync = (pattern: fg.Pattern, dir: string, opts: FgOptions = {}) =>
  tryCatchSync<string | null, FindError>(
    () => sFgSingle(pattern, dir, -1, opts),
    /* c8 ignore next */
    (caught) => new FindError({ startDir: dir, direction: 'at', target: 'last' }, caught)
  );

//#endregion

// #region> Unwrapped
/* c8 ignore start */
/** @see {@link tryAllAt} */
export const allAt = async (pattern: fg.Pattern, dir: string, opts?: FgOptions) =>
  unwrap(await tryAllAt(pattern, dir, opts));
/** @see {@link tryAllAtSync} */
export const allAtSync = (pattern: fg.Pattern, dir: string, opts?: FgOptions) =>
  unwrap(tryAllAtSync(pattern, dir, opts));
/** @see {@link tryFirstAt} */
export const firstAt = async (pattern: fg.Pattern, dir: string, opts?: FgOptions) =>
  unwrap(await tryFirstAt(pattern, dir, opts));
/** @see {@link tryFirstAtSync} */
export const firstAtSync = (pattern: fg.Pattern, dir: string, opts?: FgOptions) =>
  unwrap(tryFirstAtSync(pattern, dir, opts));
/** @see {@link tryLastAt} */
export const lastAt = async (pattern: fg.Pattern, dir: string, opts?: FgOptions) =>
  unwrap(await tryLastAt(pattern, dir, opts));
/** @see {@link tryLastAtSync} */
export const lastAtSync = (pattern: fg.Pattern, dir: string, opts?: FgOptions) =>
  unwrap(tryLastAtSync(pattern, dir, opts));
/* c8 ignore stop */
// #endregion
