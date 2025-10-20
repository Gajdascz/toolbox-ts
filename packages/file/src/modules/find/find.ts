import fg from 'fast-glob';
import fs from 'node:fs';
import path from 'node:path';

import {
  syncTraverseDown,
  syncTraverseUp,
  traverseDown,
  type TraverseOnDirResult,
  traverseUp
} from '../traverse/index.js';

/**
 * The directory to terminate the search at (not included in the search).
 *
 * - direction 'up': defaults to the filesystem root `path.parse(process.cwd()).root`.
 * - direction 'down': defaults to `undefined` (searches until no more subdirectories are found).
 */
export type FindEndDir = string;
/**
 * The directory to start the search from (included in the search).
 *
 * @default process.cwd()
 */
export type FindStartDir = string;

//#region> FG Helpers
const FG_DEFAULT_OPTS: { all: fg.Options; single: fg.Options } = {
  all: {
    absolute: true,
    onlyFiles: true,
    dot: true,
    unique: true,
    fs: fs,
    ignore: ['**/node_modules/**', '**/dist/**']
  },
  single: {
    absolute: true,
    onlyFiles: true,
    deep: 0,
    dot: true,
    unique: true,
    fs: fs,
    ignore: ['**/node_modules/**', '**/dist/**']
  }
} as const;

const fgAllStep = (
  pattern: fg.Pattern,
  cwd: string,
  options: fg.Options = {}
) => fg(pattern, { ...FG_DEFAULT_OPTS.all, ...options, cwd, deep: 0 });
const fgSingle = (pattern: fg.Pattern, cwd: string, options: fg.Options = {}) =>
  fg(pattern, { ...FG_DEFAULT_OPTS.single, ...options, cwd });
const sFgAllStep = (
  pattern: fg.Pattern,
  cwd: string,
  options: fg.Options = {}
) => fg.sync(pattern, { ...FG_DEFAULT_OPTS.all, ...options, cwd, deep: 0 });
const sFgSingle = (
  pattern: fg.Pattern,
  cwd: string,
  options: fg.Options = {}
) => fg.sync(pattern, { ...FG_DEFAULT_OPTS.single, ...options, cwd });

/** Options for `fast-glob` patterns passed to search functions. */
export type FindFgInputOpts = Omit<FindFgOverrideOpts, 'deep' | 'unique'>;

/** Options for `fast-glob` search with directory overrides. */
export type FindFgOverrideOpts = {
  endDir?: FindEndDir;
  startDir?: FindStartDir;
} & Omit<fg.Options, 'cwd'>;

//#endregion

const resolveWhenOpts = (opts: Partial<WhenOpts> = {}): WhenOpts => {
  const startDir = opts.startDir ?? process.cwd();
  const direction = opts.direction ?? 'up';
  const endDir =
    opts.endDir ?? (direction === 'up' ? path.parse(startDir).root : undefined);
  return { startDir, endDir, direction };
};

const resolveFirstResult = <R = string>(
  result: FindResult<R>
): TraverseOnDirResult<R> =>
  ({ break: !!result, ...resolveResult(result) }) as TraverseOnDirResult<R>;
const resolveResult = <R = string>(
  result: FindResult<R>
): TraverseOnDirResult<R> => ({
  result: result === false ? undefined : result
});
const nullIfUndefined = <T>(arr: T[], i = 0) => arr.at(i) ?? null;

export type FindResult<R = string> = false | R | R[] | undefined;

export interface WhenOpts {
  direction: 'down' | 'up';
  endDir?: FindEndDir;
  startDir?: FindStartDir;
}
//#region> Generic Find functions
const baseWhen = async <R = string>(
  find: (dir: string) => FindResult<R> | Promise<FindResult<R>>,
  resolver: (res: FindResult<R>) => TraverseOnDirResult<R>,
  finding: 'first' | 'last' = 'first',
  opts: Partial<WhenOpts> = {}
) => {
  const { direction, endDir: endAtDir, startDir } = resolveWhenOpts(opts);
  const traverse = direction === 'up' ? traverseUp : traverseDown;
  return nullIfUndefined(
    await traverse(async (dir) => resolver(await find(dir)), {
      startDir,
      endAtDir
    }),
    finding === 'first' ? 0 : -1
  );
};
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
 * const downResult = await findFirstWhen((dir) => dir.endsWith('l1') ? dir : undefined, { startDir: '/root', direction: 'down' }); // returns '/root/l1'
 *
 * const upResult = await findFirstWhen((dir) => dir.endsWith('.l3')), { startDir: '/root/l1/l2/l3/l4', direction: 'up' }); // returns '/root/l1/l2/l3'
 *
 * const resultWithEndDir = await findFirstWhen((dir) => dir.endsWith('l1') ? dir : undefined, { startDir: '/root/l1/l2/l3/l4', endDir: '/root/l1', direction: 'up' }); // returns null (because l1 is the endDir and is not included in the search)
 * ```
 */
export const findFirstWhen = async <R = string>(
  find: (dir: string) => FindResult<R> | Promise<FindResult<R>>,
  opts: Partial<WhenOpts> = {}
) => await baseWhen(find, resolveFirstResult, 'first', opts);
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
 * const resultUp = await findLastWhen((dir) => dir.endsWith('l3')), { startDir: '/root/l1/l2/l3/l4', direction: 'up' }); // returns '/root/l1/l2/l3'
 *
 * const resultDown = await findLastWhen((dir) => dir.endsWith('l4')), { startDir: '/root', direction: 'down' }); // returns '/root/l1/l2/l3/l4'
 *
 * const resultWithEndDir = await findLastWhen((dir) => dir.endsWith('l3')), { startDir: '/root/l1/l2/l3/l4', endDir: '/root/l1', direction: 'up' }); // returns null (because l1 is the endDir and is not included in the search)
 * ```
 */
export const findLastWhen = async <R = string>(
  find: (dir: string) => FindResult<R> | Promise<FindResult<R>>,
  opts: Partial<WhenOpts> = {}
) => await baseWhen(find, resolveResult, 'last', opts);
/**
 * Like @see {@link findFirstWhen} but reads the directory contents and passes them to the finder function.
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
 * const result = await findFirstWhenRead((dir, content) => content.find(f => f === 'file2.log'), { startDir: '/root', direction: 'down' }); // returns 'file2.log'
 *
 * ```
 */
export const findFirstWhenRead = async <R = string>(
  find: (dir: string, content: string[]) => FindResult<R> | Promise<FindResult>,
  opts: Partial<WhenOpts> = {}
) => {
  const { direction, endDir, startDir } = resolveWhenOpts(opts);
  return await findFirstWhen(
    async (dir) => find(dir, await fgAllStep('*', dir, { absolute: false })),
    { startDir, endDir, direction }
  );
};
/**
 * Like @see {@link findLastWhen} but provides the directory contents to the finder callback.
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
 * const result = await findLastWhenRead((dir, content) => content.find(f => f === 'file2.log'), { startDir: '/root', direction: 'down' }); // returns 'file2.log'
 *
 * ```
 */
export const findLastWhenRead = async <R = string>(
  find: (dir: string, content: string[]) => FindResult<R> | Promise<FindResult>,
  opts: Partial<WhenOpts> = {}
) => {
  const { direction, endDir, startDir } = resolveWhenOpts(opts);
  return await findLastWhen(
    async (dir) => find(dir, await fgAllStep('*', dir, { absolute: false })),
    { startDir, endDir, direction }
  );
};
//#endregion

//#region> Traverse with fast-glob
/**
 * Traverse directories downwards collecting all matches for the pattern.
 *
 * @example
 * ```ts
 * const files = await findAllDown('*.ts', { startDir: '/project/src' });
 * ```
 */
export const findAllDown = async (
  pattern: fg.Pattern,
  { startDir: cwd = process.cwd(), endDir, ...rest }: FindFgOverrideOpts = {}
): Promise<string[]> =>
  endDir ?
    traverseDown(
      async (dir) => ({ result: await fgAllStep(pattern, dir, rest) }),
      { endAtDir: endDir, startDir: cwd }
    )
  : fg(pattern, { ...FG_DEFAULT_OPTS.all, ...rest, cwd });

/**
 * Traverse directories upwards collecting all matches for the pattern.
 *
 * @example
 * ```ts
 * const files = await findAllUp('*.ts', { startDir: '/project/src' });
 * ```
 */
export const findAllUp = async (
  pattern: fg.Pattern,
  {
    startDir = process.cwd(),
    endDir = path.parse(startDir).root,
    ...rest
  }: FindFgOverrideOpts = {}
): Promise<string[]> =>
  traverseUp(async (dir) => ({ result: await fgAllStep(pattern, dir, rest) }), {
    startDir,
    endAtDir: endDir
  });
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
 * const result1 = await findFirstUp('*.txt', { startDir: '/root/l1/l2/l3/l4', endDir: '/root' }); // returns '/root/l1/l2/l3/l4/file4.txt'
 *
 * // Example 2: Find the first .log file starting from /root/l1/l2/l3/l4 up to /root/l1
 * const result2 = await findFirstUp('*.log', { startDir: '/root/l1/l2/l3/l4', endDir: '/root/l1' }); // returns '/root/l1/l2/file2.log'
 *
 * ```
 */
export const findFirstUp = async (
  pattern: fg.Pattern,
  {
    startDir = process.cwd(),
    endDir = path.parse(startDir).root,
    ...rest
  }: FindFgInputOpts = {}
): Promise<null | string> =>
  findFirstWhen(async (dir) => (await fgSingle(pattern, dir, rest)).at(0), {
    startDir,
    endDir,
    direction: 'up'
  });
/**
 * Find the last matching file upwards.
 *
 * @example
 * ```ts
 * const file = await findLastUp('*.js', { startDir: '/project/src' });
 * ```
 */
export const findLastUp = async (
  pattern: fg.Pattern,
  {
    startDir = process.cwd(),
    endDir = path.parse(startDir).root,
    ...rest
  }: FindFgInputOpts = {}
): Promise<null | string> =>
  findLastWhen(async (dir) => (await fgSingle(pattern, dir, rest)).at(-1), {
    startDir,
    endDir,
    direction: 'up'
  });
/**
 * Find the first matching file downwards.
 *
 * @example
 * ```ts
 * const file = await findFirstDown('*.js', { startDir: '/project/src' });
 * ```
 */
export const findFirstDown = async (
  pattern: fg.Pattern,
  { startDir = process.cwd(), ...rest }: FindFgInputOpts = {}
) =>
  findFirstWhen(async (dir) => (await fgSingle(pattern, dir, rest)).at(0), {
    startDir,
    direction: 'down'
  });
/**
 * Find the last matching file downwards.
 *
 * @example
 * ```ts
 * const file = await findLastDown('*.js', { startDir: '/project/src' });
 * ```
 */
export const findLastDown = async (
  pattern: fg.Pattern,
  { startDir = process.cwd(), endDir, ...rest }: FindFgInputOpts = {}
) =>
  findLastWhen(async (dir) => (await fgSingle(pattern, dir, rest)).at(-1), {
    startDir,
    endDir,
    direction: 'down'
  });
//#endregion

//#region> Sync
const baseWhenSync = <R = string>(
  find: (dir: string) => FindResult<R>,
  resolver: (res: FindResult<R>) => TraverseOnDirResult<R>,
  finding: 'first' | 'last' = 'first',
  opts: Partial<WhenOpts> = {}
) => {
  const { direction, endDir: endAtDir, startDir } = resolveWhenOpts(opts);
  const traverse = direction === 'up' ? syncTraverseUp : syncTraverseDown;
  return nullIfUndefined(
    traverse((dir) => resolver(find(dir)), { startDir, endAtDir }),
    finding === 'first' ? 0 : -1
  );
};

/** synchronous version of {@link findFirstWhen} */
export const syncFindFirstWhen = <R = string>(
  find: (dir: string) => FindResult<R>,
  opts: Partial<WhenOpts> = {}
) => baseWhenSync<R>(find, resolveFirstResult, 'first', opts);
/** synchronous version of {@link findLastWhen} */
export const syncFindLastWhen = (
  find: (dir: string) => false | null | string | string[] | undefined,
  opts: Partial<WhenOpts> = {}
) => baseWhenSync(find, resolveResult, 'last', opts);
/** synchronous version of {@link findFirstWhenRead} */
export const syncFindFirstWhenRead = (
  find: (dir: string, content: string[]) => FindResult,
  opts: Partial<WhenOpts> = {}
) =>
  syncFindFirstWhen(
    (dir) => find(dir, sFgAllStep('*', dir, { absolute: false })),
    opts
  );
/** synchronous version of {@link findLastWhenRead} */
export const syncFindLastWhenRead = (
  find: (dir: string, content: string[]) => FindResult,
  opts: Partial<WhenOpts> = {}
) =>
  syncFindLastWhen(
    (dir) => find(dir, sFgAllStep('*', dir, { absolute: false })),
    opts
  );
/** synchronous version of {@link findAllDown} */
export const syncFindAllDown = (
  pattern: fg.Pattern,
  { startDir: cwd = process.cwd(), endDir, ...rest }: FindFgOverrideOpts = {}
) =>
  endDir ?
    syncTraverseDown(
      (dir) => ({ break: false, result: sFgAllStep(pattern, dir, rest) }),
      { startDir: cwd, endAtDir: endDir }
    )
  : fg.sync(pattern, { ...FG_DEFAULT_OPTS.all, ...rest, cwd });
/** synchronous version of {@link findAllUp} */
export const syncFindAllUp = (
  pattern: fg.Pattern,
  {
    startDir = process.cwd(),
    endDir = path.parse(startDir).root,
    ...rest
  }: { endDir?: string } & FindFgOverrideOpts = {}
) =>
  syncTraverseUp(
    (dir) => ({ break: false, result: sFgAllStep(pattern, dir, rest) }),
    { startDir, endAtDir: endDir }
  );
/** synchronous version of {@link findFirstUp} */
export const syncFindFirstUp = (
  pattern: fg.Pattern,
  {
    startDir = process.cwd(),
    endDir = path.parse(startDir).root,
    ...rest
  }: FindFgInputOpts = {}
): null | string =>
  syncFindFirstWhen((dir) => sFgSingle(pattern, dir, rest).at(0), {
    startDir,
    endDir,
    direction: 'up'
  });
/** synchronous version of {@link findLastUp} */
export const syncFindLastUp = (
  pattern: fg.Pattern,
  {
    startDir = process.cwd(),
    endDir = path.parse(startDir).root,
    ...rest
  }: FindFgInputOpts = {}
) =>
  syncFindLastWhen((dir) => sFgSingle(pattern, dir, rest).at(-1), {
    startDir,
    endDir,
    direction: 'up'
  });
/** synchronous version of {@link findFirstDown} */
export const syncFindFirstDown = (
  pattern: fg.Pattern,
  { startDir = process.cwd(), ...rest }: FindFgInputOpts = {}
): null | string =>
  syncFindFirstWhen((dir) => sFgSingle(pattern, dir, rest).at(0), {
    startDir,
    direction: 'down'
  });
/** synchronous version of {@link findLastDown} */
export const syncFindLastDown = (
  pattern: fg.Pattern,
  { startDir = process.cwd(), ...rest }: FindFgInputOpts = {}
) =>
  syncFindLastWhen((dir) => sFgSingle(pattern, dir, rest).at(-1), {
    startDir,
    direction: 'down'
  });
//#endregion
