import { stringify } from 'yaml';
import { tryWriteFile as tryWf, tryWriteFileSync as tryWfSync } from '../../../helpers/index.js';
import { unwrap } from '../../../result.js';
import type { WriteFileOptions, WriteFileSyncOptions } from '../types.js';

export const tryWriteFile = <D = unknown>(
  filePath: string,
  data: D,
  { stringify: stringifyOpts, ...rest }: WriteFileOptions<D> = {}
) =>
  tryWf(filePath, data, {
    ...rest,
    fileType: 'yaml',
    stringify: (d) => stringify(d, stringifyOpts?.replacer, stringifyOpts)
  });

/** Synchronous version of {@link tryWriteFile} */
export const tryWriteFileSync = <D = unknown>(
  filePath: string,
  data: D,
  { stringify: stringifyOpts, ...rest }: WriteFileSyncOptions<D> = {}
) =>
  tryWfSync(filePath, data, {
    ...rest,
    fileType: 'yaml',
    stringify: (d) => stringify(d, stringifyOpts?.replacer, stringifyOpts)
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
//#endregion
