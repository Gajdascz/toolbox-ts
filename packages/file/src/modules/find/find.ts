import fg from 'fast-glob';
import fs from 'node:fs';
import path from 'node:path';

import { traverse } from '../traverse/index.js';

/**
 * The directory to terminate the search at (not included in the search).
 *
 * - direction 'up': defaults to the filesystem root `path.parse(process.cwd()).root`.
 * - direction 'down': defaults to `undefined` (searches until no more subdirectories are found).
 */
export type EndDir = string;
/**
 * The directory to start the search from (included in the search).
 *
 * @default process.cwd()
 */
export type StartDir = string;

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
export type FgInputOpts = Omit<FgOverrideOpts, 'deep' | 'unique'>;

/** Options for `fast-glob` search with directory overrides. */
export type FgOverrideOpts = { endDir?: EndDir; startDir?: StartDir } & Omit<
  fg.Options,
  'cwd'
>;

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
): traverse.OnDirResult<R> =>
  ({ break: !!result, ...resolveResult(result) }) as traverse.OnDirResult<R>;
const resolveResult = <R = string>(
  result: FindResult<R>
): traverse.OnDirResult<R> => ({
  result: result === false ? undefined : result
});
const nullIfUndefined = <T>(arr: T[], i = 0) => arr.at(i) ?? null;

export type FindResult<R = string> = false | R | R[] | undefined;

export interface WhenOpts {
  direction: 'down' | 'up';
  endDir?: EndDir;
  startDir?: StartDir;
}
//#region> Generic Find functions
const baseWhen = async <R = string>(
  find: (dir: string) => FindResult<R> | Promise<FindResult<R>>,
  resolver: (res: FindResult<R>) => traverse.OnDirResult<R>,
  finding: 'first' | 'last' = 'first',
  opts: Partial<WhenOpts> = {}
) => {
  const { direction, endDir: endAtDir, startDir } = resolveWhenOpts(opts);
  return nullIfUndefined(
    await traverse[direction](async (dir) => resolver(await find(dir)), {
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
 * const downResult = await firstWhen((dir) => dir.endsWith('l1') ? dir : undefined, { startDir: '/root', direction: 'down' }); // returns '/root/l1'
 *
 * const upResult = await firstWhen((dir) => dir.endsWith('.l3')), { startDir: '/root/l1/l2/l3/l4', direction: 'up' }); // returns '/root/l1/l2/l3'
 *
 * const resultWithEndDir = await firstWhen((dir) => dir.endsWith('l1') ? dir : undefined, { startDir: '/root/l1/l2/l3/l4', endDir: '/root/l1', direction: 'up' }); // returns null (because l1 is the endDir and is not included in the search)
 * ```
 */
export const firstWhen = async <R = string>(
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
 * const resultUp = await lastWhen((dir) => dir.endsWith('l3')), { startDir: '/root/l1/l2/l3/l4', direction: 'up' }); // returns '/root/l1/l2/l3'
 *
 * const resultDown = await lastWhen((dir) => dir.endsWith('l4')), { startDir: '/root', direction: 'down' }); // returns '/root/l1/l2/l3/l4'
 *
 * const resultWithEndDir = await lastWhen((dir) => dir.endsWith('l3')), { startDir: '/root/l1/l2/l3/l4', endDir: '/root/l1', direction: 'up' }); // returns null (because l1 is the endDir and is not included in the search)
 * ```
 */
export const lastWhen = async <R = string>(
  find: (dir: string) => FindResult<R> | Promise<FindResult<R>>,
  opts: Partial<WhenOpts> = {}
) => await baseWhen(find, resolveResult, 'last', opts);
/**
 * Like @see {@link firstWhen} but reads the directory contents and passes them to the finder function.
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
 * const result = await firstWhenRead((dir, content) => content.find(f => f === 'file2.log'), { startDir: '/root', direction: 'down' }); // returns 'file2.log'
 *
 * ```
 */
export const firstWhenRead = async <R = string>(
  find: (dir: string, content: string[]) => FindResult<R> | Promise<FindResult>,
  opts: Partial<WhenOpts> = {}
) => {
  const { direction, endDir, startDir } = resolveWhenOpts(opts);
  return await firstWhen(
    async (dir) => find(dir, await fgAllStep('*', dir, { absolute: false })),
    { startDir, endDir, direction }
  );
};
/**
 * Like @see {@link lastWhen} but provides the directory contents to the finder callback.
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
export const lastWhenRead = async <R = string>(
  find: (dir: string, content: string[]) => FindResult<R> | Promise<FindResult>,
  opts: Partial<WhenOpts> = {}
) => {
  const { direction, endDir, startDir } = resolveWhenOpts(opts);
  return await lastWhen(
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
 * const files = await allDown('*.ts', { startDir: '/project/src' });
 * ```
 */
export const allDown = async (
  pattern: fg.Pattern,
  { startDir: cwd = process.cwd(), endDir, ...rest }: FgOverrideOpts = {}
): Promise<string[]> =>
  endDir ?
    traverse.down(
      async (dir) => ({ result: await fgAllStep(pattern, dir, rest) }),
      { endAtDir: endDir, startDir: cwd }
    )
  : fg(pattern, { ...FG_DEFAULT_OPTS.all, ...rest, cwd });

/**
 * Traverse directories upwards collecting all matches for the pattern.
 *
 * @example
 * ```ts
 * const files = await allUp('*.ts', { startDir: '/project/src' });
 * ```
 */
export const allUp = async (
  pattern: fg.Pattern,
  {
    startDir = process.cwd(),
    endDir = path.parse(startDir).root,
    ...rest
  }: FgOverrideOpts = {}
): Promise<string[]> =>
  traverse.up(
    async (dir) => ({ result: await fgAllStep(pattern, dir, rest) }),
    { startDir, endAtDir: endDir }
  );
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
export const firstUp = async (
  pattern: fg.Pattern,
  {
    startDir = process.cwd(),
    endDir = path.parse(startDir).root,
    ...rest
  }: FgInputOpts = {}
): Promise<null | string> =>
  firstWhen(async (dir) => (await fgSingle(pattern, dir, rest)).at(0), {
    startDir,
    endDir,
    direction: 'up'
  });
/**
 * Find the last matching file upwards.
 *
 * @example
 * ```ts
 * const file = await lastUp('*.js', { startDir: '/project/src' });
 * ```
 */
export const lastUp = async (
  pattern: fg.Pattern,
  {
    startDir = process.cwd(),
    endDir = path.parse(startDir).root,
    ...rest
  }: FgInputOpts = {}
): Promise<null | string> =>
  lastWhen(async (dir) => (await fgSingle(pattern, dir, rest)).at(-1), {
    startDir,
    endDir,
    direction: 'up'
  });
/**
 * Find the first matching file downwards.
 *
 * @example
 * ```ts
 * const file = await firstDown('*.js', { startDir: '/project/src' });
 * ```
 */
export const firstDown = async (
  pattern: fg.Pattern,
  { startDir = process.cwd(), ...rest }: FgInputOpts = {}
) =>
  firstWhen(async (dir) => (await fgSingle(pattern, dir, rest)).at(0), {
    startDir,
    direction: 'down'
  });
/**
 * Find the last matching file downwards.
 *
 * @example
 * ```ts
 * const file = await lastDown('*.js', { startDir: '/project/src' });
 * ```
 */
export const lastDown = async (
  pattern: fg.Pattern,
  { startDir = process.cwd(), endDir, ...rest }: FgInputOpts = {}
) =>
  lastWhen(async (dir) => (await fgSingle(pattern, dir, rest)).at(-1), {
    startDir,
    endDir,
    direction: 'down'
  });
//#endregion

//#region> Sync
const baseWhenSync = <R = string>(
  find: (dir: string) => FindResult<R>,
  resolver: (res: FindResult<R>) => traverse.OnDirResult<R>,
  finding: 'first' | 'last' = 'first',
  opts: Partial<WhenOpts> = {}
) => {
  const { direction, endDir: endAtDir, startDir } = resolveWhenOpts(opts);
  return nullIfUndefined(
    traverse.sync[direction]((dir) => resolver(find(dir)), {
      startDir,
      endAtDir
    }),
    finding === 'first' ? 0 : -1
  );
};
/**
 * Synchronous equivalents for all find functions.
 *
 * @example
 * ```ts
 * const file = sync.firstUp('*.ts', { startDir: '/project/src' });
 * const allFiles = sync.allDown('*.ts', { startDir: '/project/src' });
 * ```
 */
export const sync = {
  /** synchronous version of {@link firstWhen} */
  firstWhen: <R = string>(
    find: (dir: string) => FindResult<R>,
    opts: Partial<WhenOpts> = {}
  ) => baseWhenSync<R>(find, resolveFirstResult, 'first', opts),
  /** synchronous version of {@link lastWhen} */
  lastWhen: (
    find: (dir: string) => false | null | string | string[] | undefined,
    opts: Partial<WhenOpts> = {}
  ) => baseWhenSync(find, resolveResult, 'last', opts),
  /** synchronous version of {@link firstWhenRead} */
  firstWhenRead: (
    find: (dir: string, content: string[]) => FindResult,
    opts: Partial<WhenOpts> = {}
  ) =>
    sync.firstWhen(
      (dir) => find(dir, sFgAllStep('*', dir, { absolute: false })),
      opts
    ),
  /** synchronous version of {@link lastWhenRead} */
  lastWhenRead: (
    find: (dir: string, content: string[]) => FindResult,
    opts: Partial<WhenOpts> = {}
  ) =>
    sync.lastWhen(
      (dir) => find(dir, sFgAllStep('*', dir, { absolute: false })),
      opts
    ),
  /** synchronous version of {@link allDown} */
  allDown: (
    pattern: fg.Pattern,
    { startDir: cwd = process.cwd(), endDir, ...rest }: FgOverrideOpts = {}
  ) =>
    endDir ?
      traverse.sync.down(
        (dir) => ({ break: false, result: sFgAllStep(pattern, dir, rest) }),
        { startDir: cwd, endAtDir: endDir }
      )
    : fg.sync(pattern, { ...FG_DEFAULT_OPTS.all, ...rest, cwd }),
  /** synchronous version of {@link allUp} */
  allUp: (
    pattern: fg.Pattern,
    {
      startDir = process.cwd(),
      endDir = path.parse(startDir).root,
      ...rest
    }: { endDir?: string } & FgOverrideOpts = {}
  ) =>
    traverse.sync.up(
      (dir) => ({ break: false, result: sFgAllStep(pattern, dir, rest) }),
      { startDir, endAtDir: endDir }
    ),
  /** synchronous version of {@link firstUp} */
  firstUp: (
    pattern: fg.Pattern,
    {
      startDir = process.cwd(),
      endDir = path.parse(startDir).root,
      ...rest
    }: FgInputOpts = {}
  ): null | string =>
    sync.firstWhen((dir) => sFgSingle(pattern, dir, rest).at(0), {
      startDir,
      endDir,
      direction: 'up'
    }),
  /** synchronous version of {@link lastUp} */
  lastUp: (
    pattern: fg.Pattern,
    {
      startDir = process.cwd(),
      endDir = path.parse(startDir).root,
      ...rest
    }: FgInputOpts = {}
  ) =>
    sync.lastWhen((dir) => sFgSingle(pattern, dir, rest).at(-1), {
      startDir,
      endDir,
      direction: 'up'
    }),
  /** synchronous version of {@link firstDown} */
  firstDown: (
    pattern: fg.Pattern,
    { startDir = process.cwd(), ...rest }: FgInputOpts = {}
  ): null | string =>
    sync.firstWhen((dir) => sFgSingle(pattern, dir, rest).at(0), {
      startDir,
      direction: 'down'
    }),
  /** synchronous version of {@link lastDown} */
  lastDown: (
    pattern: fg.Pattern,
    { startDir = process.cwd(), ...rest }: FgInputOpts = {}
  ) =>
    sync.lastWhen((dir) => sFgSingle(pattern, dir, rest).at(-1), {
      startDir,
      direction: 'down'
    })
} as const;
//#endregion
