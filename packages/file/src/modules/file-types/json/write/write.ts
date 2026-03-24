import { stringify } from 'comment-json';
import { tryWriteFile as tryWf, tryWriteFileSync as tryWfSync } from '../../../helpers/index.js';
import { unwrap } from '../../../result.js';
import type { WriteFileOptions, WriteFileSyncOptions } from '../types.js';

/**
 * Writes a JavaScript object to a JSON file.
 *
 * @param filePath - The path to the JSON file.
 * @param data - The data to write to the file.
 * @param options - Options for writing the file, including conflict resolution and merge options.
 */
export const tryWriteFile = <D = unknown>(
  filePath: string,
  data: D,
  opts: WriteFileOptions<D> = {}
) =>
  tryWf(filePath, data, {
    ...opts,
    fileType: 'json',
    stringify: (d) => stringify(d, opts.stringify?.replacer, opts.stringify?.space)
  });

/** Synchronous version of {@link tryWriteFile} */
export const tryWriteFileSync = <D = unknown>(
  filePath: string,
  data: D,
  { stringify: stringifyOpts, ...rest }: WriteFileSyncOptions<D> = {}
) =>
  tryWfSync(filePath, data, {
    fileType: 'json',
    stringify: (d) => stringify(d, stringifyOpts?.replacer, stringifyOpts?.space),
    ...rest
  });

//#region> Unwrapped
/* c8 ignore start */
/** @see {@link tryWriteFile} */
export const writeFile = async <D = unknown>(
  filePath: string,
  data: D,
  opts?: WriteFileOptions<D>
) => unwrap(await tryWriteFile(filePath, data, opts));
/** @see {@link tryWriteFileSync} */
export const writeFileSync = <D = unknown>(
  filePath: string,
  data: D,
  opts?: WriteFileSyncOptions<D>
) => unwrap(tryWriteFileSync(filePath, data, opts));
/* c8 ignore stop */
