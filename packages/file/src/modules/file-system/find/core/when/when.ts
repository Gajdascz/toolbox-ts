import { Traverse } from '../../../traverse/index.js';
import { unwrap } from '../../../../result.js';
import { fgAllStep, sFgAllStep } from '../helpers/index.js';
import { resolveFirstResult, resolveResult, tryBaseWhen, tryBaseWhenSync } from './base/index.js';
import type { FindResult, WhenOpts } from '../types.js';

//#endregion
//#region>> first
const firstWhenArgs = [resolveFirstResult, 'first'] as const;
/**
 * Traverses directories until the first directory matching the finder returns a result.
 *
 * @template R - The type of the result returned by the finder function.
 *
 * @example
 * ```ts
 * /root
 * ├─ l1
 * │  ├─ file1.txt
 * │  └─ l2
 * │      ├─ file2.log
 * │      └─ l3
 * │          ├─ file3.txt
 * │          └─ l4
 * │              └─ file4.txt
 * const downResult = await firstWhen((dir) => dir.endsWith('l1') ? dir : undefined, { startDir: '/root', direction: 'down' }); // returns '/root/l1'
 *
 * const upResult = await firstWhen((dir) => dir.endsWith('.l3')), { startDir: '/root/l1/l2/l3/l4', direction: 'up' }); // returns '/root/l1/l2/l3'
 *
 * const resultWithEndDir = await firstWhen((dir) => dir.endsWith('l1') ? dir : undefined, { startDir: '/root/l1/l2/l3/l4', endDir: '/root/l1', direction: 'up' }); // returns null (because l1 is the endDir and is not included in the search)
 * ```
 */
export const tryFirstWhen = async <R = string>(
  find: (dir: string) => FindResult<R> | Promise<FindResult<R>>,
  opts?: Partial<WhenOpts>
) => await tryBaseWhen(find, ...firstWhenArgs, opts);

/** synchronous version of {@link tryFirstWhen} */
export const tryFirstWhenSync = <R = string>(
  find: (dir: string) => FindResult<R>,
  opts?: Partial<WhenOpts>
) => tryBaseWhenSync<R>(find, ...firstWhenArgs, opts);

//#endregion
//#region>> last
const lastWhenArgs = [resolveResult, 'last'] as const;
/**
 * Traverses directories and returns the last matching result.
 *
 * @template R - The type of the result returned by the finder function.
 *
 * @example
 *  /root
 * ├─ l1
 * │  ├─ file1.txt
 * │  └─ l2
 * │      ├─ file2.log
 * │      └─ l3
 * │          ├─ file3.txt
 * │          └─ l4
 * │              └─ file4.txt
 * ```ts
 * const resultUp = await lastWhen((dir) => dir.endsWith('l3')), { startDir: '/root/l1/l2/l3/l4', direction: 'up' }); // returns '/root/l1/l2/l3'
 *
 * const resultDown = await lastWhen((dir) => dir.endsWith('l4')), { startDir: '/root', direction: 'down' }); // returns '/root/l1/l2/l3/l4'
 *
 * const resultWithEndDir = await lastWhen((dir) => dir.endsWith('l3')), { startDir: '/root/l1/l2/l3/l4', endDir: '/root/l1', direction: 'up' }); // returns null (because l1 is the endDir and is not included in the search)
 * ```
 */
export const tryLastWhen = async <R = string>(
  find: (dir: string) => FindResult<R> | Promise<FindResult<R>>,
  opts?: Partial<WhenOpts>
) => await tryBaseWhen(find, ...lastWhenArgs, opts);

/** synchronous version of {@link tryLastWhen} */
export const tryLastWhenSync = (
  find: (dir: string) => false | null | string | string[] | undefined,
  opts?: Partial<WhenOpts>
) => tryBaseWhenSync(find, ...lastWhenArgs, opts);

//#endregion
//#region>> firstRead
/**
 * Like @see {@link tryFirstWhen} but reads the directory contents and passes them to the finder function.
 *
 * @example
 * ```ts
 * /root
 * ├─ l1
 * │  ├─ file1.txt
 * │  └─ l2
 * │      ├─ file2.log
 * │      └─ l3
 * │          ├─ file3.txt
 * │          └─ l4
 * │              └─ file4.txt
 *
 * const result = await whenRead((dir, content) => content.find(f => f === 'file2.log'), { startDir: '/root', direction: 'down' }); // returns 'file2.log'
 *
 * ```
 */
export const tryFirstWhenRead = async <R = string>(
  find: (dir: string, content: string[]) => FindResult<R> | Promise<FindResult>,
  opts?: Partial<WhenOpts>
) => tryFirstWhen(async (dir) => find(dir, await fgAllStep('*', dir, { absolute: false })), opts);

/** synchronous version of {@link tryFirstWhenRead} */
export const tryFirstWhenReadSync = (
  find: (dir: string, content: string[]) => FindResult,
  opts: Partial<WhenOpts> = {}
) => tryFirstWhenSync((dir) => find(dir, sFgAllStep('*', dir, { absolute: false })), opts);

//#endregion
//#region>> lastRead
/**
 * Like @see {@link tryLastWhen} but provides the directory contents to the finder callback.
 *
 * @example
 * ```ts
 * /root
 * ├─ l1
 * │  ├─ file1.txt
 * │  └─ l2
 * │      ├─ file2.log
 * │      └─ l3
 * │          ├─ file3.txt
 * │          └─ l4
 * │              └─ file4.txt
 *
 * const result = await lastWhenRead((dir, content) => content.find(f => f === 'file2.log'), { startDir: '/root', direction: 'down' }); // returns 'file2.log'
 *
 * ```
 */
export const tryLastWhenRead = async <R = string>(
  find: (dir: string, content: string[]) => FindResult<R> | Promise<FindResult>,
  opts?: Partial<WhenOpts>
) => tryLastWhen(async (dir) => find(dir, await fgAllStep('*', dir, { absolute: false })), opts);

/** synchronous version of {@link tryLastWhenRead} */
export const tryLastWhenReadSync = (
  find: (dir: string, content: string[]) => FindResult,
  opts?: Partial<WhenOpts>
) => tryLastWhenSync((dir) => find(dir, sFgAllStep('*', dir, { absolute: false })), opts);

//#endregion

//#region> Unwrapped
/* c8 ignore start */
const baseWhen = async <R = string>(
  find: (dir: string) => FindResult<R> | Promise<FindResult<R>>,
  resolver: (res: FindResult<R>) => Traverse.OnDirResult<R>,
  target: 'first' | 'last',
  opts?: Partial<WhenOpts & { target?: 'first' | 'last' }>
) => unwrap(await tryBaseWhen(find, resolver, target, opts));
const baseWhenSync = <R = string>(
  find: (dir: string) => FindResult<R>,
  resolver: (res: FindResult<R>) => Traverse.OnDirResult<R>,
  target: 'first' | 'last',
  opts?: Partial<WhenOpts>
) => unwrap(tryBaseWhenSync(find, resolver, target, opts));
/** @see {@link tryFirstWhen} */
export const firstWhen = async <R = string>(
  find: (dir: string) => FindResult<R> | Promise<FindResult<R>>,
  opts?: Partial<WhenOpts>
) => baseWhen(find, ...firstWhenArgs, opts);
/** @see {@link tryFirstWhenSync} */
export const firstWhenSync = <R = string>(
  find: (dir: string) => FindResult<R>,
  opts?: Partial<WhenOpts>
) => baseWhenSync<R>(find, ...firstWhenArgs, opts);
/** @see {@link tryLastWhen} */
export const lastWhen = async <R = string>(
  find: (dir: string) => FindResult<R> | Promise<FindResult<R>>,
  opts?: Partial<WhenOpts>
) => await baseWhen(find, ...lastWhenArgs, opts);
/** @see {@link tryLastWhenSync} */
export const lastWhenSync = (
  find: (dir: string) => false | null | string | string[] | undefined,
  opts?: Partial<WhenOpts>
) => baseWhenSync(find, ...lastWhenArgs, opts);
/** @see {@link tryFirstWhenRead} */
export const firstWhenRead = async <R = string>(
  find: (dir: string, content: string[]) => FindResult<R> | Promise<FindResult>,
  opts?: Partial<WhenOpts>
) => firstWhen(async (dir) => find(dir, await fgAllStep('*', dir, { absolute: false })), opts);
/** @see {@link tryFirstWhenReadSync} */
export const firstWhenReadSync = (
  find: (dir: string, content: string[]) => FindResult,
  opts?: Partial<WhenOpts>
) => firstWhenSync((dir) => find(dir, sFgAllStep('*', dir, { absolute: false })), opts);
/** @see {@link tryLastWhenRead} */
export const lastWhenRead = async <R = string>(
  find: (dir: string, content: string[]) => FindResult<R> | Promise<FindResult>,
  opts?: Partial<WhenOpts>
) => lastWhen(async (dir) => find(dir, await fgAllStep('*', dir, { absolute: false })), opts);
/** @see {@link tryLastWhenReadSync} */
export const lastWhenReadSync = (
  find: (dir: string, content: string[]) => FindResult,
  opts?: Partial<WhenOpts>
) => lastWhenSync((dir) => find(dir, sFgAllStep('*', dir, { absolute: false })), opts);
/* c8 ignore stop */
//#endregion
