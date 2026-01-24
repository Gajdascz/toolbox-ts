import type { Nullish } from '@toolbox-ts/types';

import { doTry, isObject, type ResolvedError } from '@toolbox-ts/utils/core';
import fs from 'node:fs';
import path from 'node:path';

//#region> FS Checks
/**
 * Check if a path is a directory.
 *
 * @example
 * ```ts
 * console.log(await isDir('/path/to/dir')); // true or false
 * ```
 */
export const isDir = async (p: string): Promise<boolean> => {
  try {
    return (await fs.promises.stat(p)).isDirectory();
  } catch {
    return false;
  }
};

/**
 * Check if a path is a file.
 *
 * @example
 * ```ts
 * console.log(await isFile('/path/to/file.txt')); // true or false
 * ```
 */
export const isFile = async (p: string): Promise<boolean> => {
  try {
    return (await fs.promises.stat(p)).isFile();
  } catch {
    return false;
  }
};

/**
 * Check if a path exists.
 *
 * @example
 * ```ts
 * console.log(await exists('/path/to/something')); // true or false
 * ```
 */
export const hasFiles = async (
  p: string,
  files: string[]
): Promise<boolean> => {
  for (const file of files)
    if (!(await isFile(path.join(p, file)))) return false;
  return true;
};
/**
 * Check if a list of directories exist within a given path.
 *
 * @example
 * ```ts
 * console.log(await hasDirs('/path/to/dir', ['subdir1', 'subdir2'])); // true or false
 * ```
 */
export const hasFilesSync = (p: string, files: string[]): boolean => {
  for (const file of files) if (!isFileSync(`${p}/${file}`)) return false;
  return true;
};
/**
 * Check if a list of directories exist within a given path.
 *
 * @example
 * ```ts
 * console.log(await hasDirs('/path/to/dir', ['subdir1', 'subdir2'])); // true or false
 * ```
 */
export const hasDirs = async (p: string, dirs: string[]): Promise<boolean> => {
  for (const dir of dirs) if (!(await isDir(`${p}/${dir}`))) return false;
  return true;
};
/**
 * Check if a list of directories exist within a given path.
 *
 * @example
 * ```ts
 * console.log(hasDirsSync('/path/to/dir', ['subdir1', 'subdir2'])); // true or false
 * ```
 */
export const hasDirsSync = (p: string, dirs: string[]): boolean => {
  for (const dir of dirs) if (!isDirSync(`${p}/${dir}`)) return false;
  return true;
};
/**
 * Get the size of a file in bytes.
 *
 * @example
 * ```ts
 * console.log(await size('/path/to/file.txt')); // size in bytes or null if file does not exist
 * ```
 */
export const size = async (p: string): Promise<null | number> => {
  try {
    return (await fs.promises.stat(p)).size;
  } catch {
    return null;
  }
};

/**
 * Synchronous version of {@link isDir}
 */
export const isDirSync = (p: string): boolean => {
  try {
    const stat = fs.statSync(p);
    return stat.isDirectory();
  } catch {
    return false;
  }
};
/**
 * Synchronous version of {@link isFile}
 */
export const isFileSync = (p: string): boolean => {
  try {
    return fs.statSync(p).isFile();
  } catch {
    return false;
  }
};
/**
 * Synchronous version of {@link size}
 */
export const sizeSync = (p: string): number => {
  try {
    return fs.statSync(p).size;
  } catch {
    return -1;
  }
};
//#endregion

//#region> QueueLike
/**
 * A simple queue-like structure for managing a list of items with enqueue and dequeue operations.
 */
export interface QueueLike<T = string> {
  clone?: () => QueueLike<T>;
  dequeue: () => T | undefined;
  enqueue: (...dirs: T[]) => void;
  length: number;
}
/**
 * Convert an array to a QueueLike structure.
 *
 * @example
 * ```ts
 * const q = arrayToQueueLike(['a', 'b', 'c']);
 * console.log(q.length); // 3
 * console.log(q.dequeue()); // 'a'
 * q.enqueue('d');
 * console.log(q.length); // 3
 * ```
 */
export const arrayToQueueLike = <T = string>(arr: T[] = []): QueueLike<T> => {
  const q = [...arr];
  return {
    clone: () => arrayToQueueLike(q),
    dequeue: () => q.shift(),
    enqueue: (...dirs: T[]) => q.push(...dirs),
    get length() {
      return q.length;
    }
  };
};
/**
 * Initialize a QueueLike structure from either an existing QueueLike or an array.
 * - If an array is provided, it converts it to a QueueLike using {@link arrayToQueueLike}.
 * - If a QueueLike is provided, it clones it if a `clone` method is available; otherwise, it returns the original QueueLike.
 *
 * @example
 * ```ts
 * const q1 = initQueueLike(['a', 'b', 'c']);
 * console.log(q1.length); // 3
 * console.log(q1.dequeue()); // 'a'
 *
 * const originalQueue: QueueLike = {
 *   length: 2,
 *   dequeue() { return 'x'; },
 *   enqueue(...dirs: string[]) { this.length += dirs.length; }
 * };
 * const q2 = initQueueLike(originalQueue);
 * console.log(q2.length); // 2
 * console.log(q2.dequeue()); // 'x'
 * ```
 */
export const initQueueLike = <T = string>(
  queue?: QueueLike<T> | T[]
): QueueLike<T> =>
  Array.isArray(queue) || !queue ? arrayToQueueLike(queue)
  : queue.clone ? queue.clone()
  : queue;
//#endregion

//#region> Normalize
export interface NormalizeFileData {
  bufferEncoding?: Parameters<InstanceType<typeof Buffer>['toString']>[0];
  dateHandler?: {
    [K in keyof Date]: Date[K] extends () => string ? K : never;
  }[keyof Date];
  jsonHandler?: (data: object) => string;
  nullishHandler?: (data: Nullish) => string;
  stringHandler?: (data: string) => string;
  unknownHandler?: (data: unknown) => string;
}
/**
 * Normalize various data types to a string.
 * - `null` or `undefined` become an empty string.
 * - `string` is returned as-is.
 * - `Buffer` and `Uint8Array` are converted to strings using the specified encoding (default is 'utf8').
 * - `Date` is converted to an ISO string.
 * - `object` is serialized to a JSON string with 2-space indentation.
 * - Other types are converted to strings using their `toString` method.
 *
 * @example
 * ```ts
 * normalizeFileData(null); // ''
 * normalizeFileData(undefined); // ''
 * normalizeFileData('Hello, World!'); // 'Hello, World!'
 * normalizeFileData(Buffer.from('Hello, Buffer!')); // 'Hello, Buffer!'
 * normalizeFileData(new Uint8Array([72, 101, 108, 108, 111])); // 'Hello'
 * normalizeFileData(new Date('2023-10-01T12:00:00Z')); // '
 * 2023-10-01T12:00:00.000Z'
 * normalizeFileData({ key: 'value' }); // '{\n  "key": "value"\n}'
 * normalizeFileData(123); // '123'
 * ```
 */
export const normalizeFileData = (
  data: unknown,
  {
    bufferEncoding = 'utf8',
    dateHandler = 'toISOString',
    jsonHandler = (d) => JSON.stringify(data, null, 2),
    stringHandler = (d) => d,
    unknownHandler = String,
    nullishHandler = () => ''
  }: NormalizeFileData = {}
): string => {
  if (data === null || data === undefined) return nullishHandler(data);
  if (typeof data === 'string') return stringHandler(data);
  if (data instanceof Buffer) return data.toString(bufferEncoding);
  if (data instanceof Uint8Array)
    return Buffer.from(data).toString(bufferEncoding);
  if (data instanceof Date) return data[dateHandler]();
  if (typeof data === 'object') return jsonHandler(data);
  return unknownHandler(data);
};
//#endregion

//#region> Read
export interface ReadOptions {
  encoding?: BufferEncoding;
  flag?: fs.OpenMode;
  signal?: AbortSignal;
}
/**
 * Read the contents of a file as a string.
 *
 * @example
 * ```ts
 * const content = await read('path/to/file.txt');
 * console.log(content); // 'Hello, World!'
 * ```
 */
export const readFile = async (
  filePath: string,
  { encoding = 'utf8', ...rest }: ReadOptions = {}
): Promise<string> => fs.promises.readFile(filePath, { encoding, ...rest });
export interface ReadFileSyncTextOptions {
  encoding?: BufferEncoding;
  flag?: string;
}
/**
 * Read the contents of a file as a string.
 *
 * @example
 * ```ts
 * const content = await read('path/to/file.txt');
 * console.log(content); // 'Hello, World!'
 * ```
 */
export const readFileSync = (
  filePath: string,
  { encoding = 'utf8', ...rest }: ReadFileSyncTextOptions = {}
): string => fs.readFileSync(filePath, { encoding, ...rest });
//#endregion

//#region> Write
//#region>> Types
export type WriteAction =
  | 'aborted'
  | 'created'
  | 'error'
  | 'overwritten'
  | 'skipped';

export type WriteConflictHandler<D = unknown> = (
  filePath: string,
  inputData: D
) =>
  | { newData: D }
  | Nullish
  | Promise<{ newData: D } | Nullish | WriteConflictStrategy>
  | WriteConflictStrategy;

export type WriteConflictResult = false | WriteConflictStrategy;
export type WriteConflictStrategy = 'abort' | 'overwrite' | 'skip';
export interface WriteFileOptions<D = unknown> {
  conflict?: WriteConflictHandler<D> | WriteConflictStrategy;
  encoding?: BufferEncoding;
  flag?: fs.OpenMode;
  flush?: boolean;
  mkDir?: fs.MakeDirectoryOptions;
  mode?: fs.Mode;
  signal?: AbortSignal;
  stringify?: (data: unknown) => string;
}

/**
 * The result of a write operation.
 *
 * @important
 * `ok: true` does not mean the file was written. It indicates that the operation executed and conflicts were handled according to the specified strategy without errors.
 *
 * @example
 * ```ts
 * write('path/to/file.txt', 'Hello, World!');
 * // { action: 'created', conflict: false, data: 'Hello, World!', filePath: 'path/to/file.txt', ok: true }
 *
 * write('path/to/conflict.txt', 'data', { conflict: 'abort' });
 * // { action: 'aborted', conflict: { prompted: false, strategy: 'abort' }, data: 'data', filePath: 'path/to/conflict.txt', ok: true }
 * ```
 */
export type WriteFileResult<D = unknown> = {
  action: WriteAction;
  conflict?: never | WriteConflictResult;
  data: D;
  filePath: string;
  ok: boolean;
} & (
  | { conflict: WriteConflictResult; ok: true }
  | { conflict?: never; error: ResolvedError; ok: false }
);
//#endregion

const STRAT_TO_ACTION = {
  overwrite: 'overwritten',
  skip: 'skipped',
  abort: 'aborted'
} as const;
const CONFLICT_DEFAULT = 'overwrite';
/**
 * Write data to a file with conflict handling.
 * - Data is normalized to a string using {@link normalizeFileData}.
 * - Parent directories are created automatically.
 * - Returns the action taken: 'created', 'overwritten', 'skipped', or 'aborted'.
 *
 * @example
 * ```ts
 * // Create or overwrite
 * await write('path/to/file.txt', 'Hello, World!');
 *
 * // Skip if exists
 * await write('path/to/file.txt', 'data', { conflict: 'skip' });
 *
 * // Abort if exists
 * await write('path/to/file.txt', 'data', { conflict: 'abort' });
 *
 * // Custom confirmation
 * await write('path/to/file.txt', 'data', {
 *   conflict: async (filePath, data) =>
 *      (await promptUser(`Overwrite ${filePath}?`) ?? 'abort')
 * });
 * ```
 */
const resolveConflict = async <D = unknown>(
  filePath: string,
  data: D,
  conflict: Exclude<WriteConflictHandler<D>, false> | WriteConflictStrategy
): Promise<{
  action: WriteAction;
  conflict: Exclude<WriteConflictResult, false>;
  writeData: D;
}> => {
  const result: {
    action: WriteAction;
    conflict: Exclude<WriteConflictResult, false>;
    writeData: D;
  } = { action: 'overwritten', conflict: 'overwrite', writeData: data };
  if (typeof conflict === 'function') {
    const fromFn = (await conflict(filePath, data)) ?? CONFLICT_DEFAULT;
    if (isObject(fromFn)) {
      result.conflict = 'overwrite';
      result.writeData = fromFn.newData;
    } else result.conflict = fromFn;
  } else result.conflict = conflict;
  result.action = STRAT_TO_ACTION[result.conflict];
  return result;
};
export async function writeFile<D = unknown>(
  filePath: string,
  data: D,
  {
    mkDir,
    encoding = 'utf8',
    conflict = CONFLICT_DEFAULT,
    stringify = normalizeFileData,

    ...rest
  }: WriteFileOptions<D> = {}
): Promise<WriteFileResult<D>> {
  const result: WriteFileResult<D> = {
    filePath,
    data,
    conflict: false,
    ok: true,
    action: 'created'
  };
  let writeData = data;
  return doTry<WriteFileResult<D>>(
    async () => {
      if (await isFile(filePath)) {
        const {
          action,
          conflict: conflictResult,
          writeData: resolvedData
        } = await resolveConflict<D>(
          filePath,
          data,
          conflict as WriteConflictStrategy
        );
        result.conflict = conflictResult;
        writeData = resolvedData;
        result.action = action;
        if (result.conflict !== 'overwrite') return result;
      }
      await fs.promises.mkdir(path.dirname(filePath), {
        recursive: true,
        ...mkDir
      });
      await fs.promises.writeFile(filePath, stringify(writeData), {
        encoding,
        ...rest
      });
      return result;
    },
    (err): { action: 'error'; ok: false } & WriteFileResult<D> => ({
      ok: false,
      action: 'error',
      error: err,
      filePath,
      data
    })
  );
}

//#endregion
