import fs from 'node:fs';
import path from 'node:path';

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
export const syncHasFiles = (p: string, files: string[]): boolean => {
  for (const file of files) if (!syncIsFile(`${p}/${file}`)) return false;
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
export const syncHasDirs = (p: string, dirs: string[]): boolean => {
  for (const dir of dirs) if (!syncIsDir(`${p}/${dir}`)) return false;
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
export const syncIsDir = (p: string): boolean => {
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
export const syncIsFile = (p: string): boolean => {
  try {
    const stat = fs.statSync(p);
    return stat.isFile();
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
export const initQueueLike = <T = string>(queue?: QueueLike<T> | T[]) =>
  Array.isArray(queue) || !queue ? arrayToQueueLike<T>(queue)
  : queue.clone ? queue.clone()
  : queue;
