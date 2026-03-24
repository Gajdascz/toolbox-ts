import { stringify } from 'comment-json';
import {
  tryPatchFile as tryPf,
  tryPatchFileSync as tryPfSync,
  type PatcherFn,
  type PatcherSyncFn
} from '../../../helpers/index.js';
import { unwrap } from '../../../result.js';
import type { PatchFileOptions, PatchFileSyncOptions } from '../types.js';
import { tryParseFile, tryParseFileSync } from '../parse/index.js';

/**
 * Reads and parses json-file data at filePath, executes the patcher function
 * on the existing data, writes the patcher result to the file.
 */
export function tryPatchFile<D>(
  filePath: string,
  patcher: PatcherFn<D>,
  { stringify: stringifyOpts, ...rest }: PatchFileOptions<D> = {}
) {
  return tryPf<D>(filePath, patcher, {
    fileType: 'json',
    reader: tryParseFile,
    stringify: (d) => stringify(d, stringifyOpts?.replacer, stringifyOpts?.space),
    ...rest
  });
}

/** Synchronous version of {@link tryPatchFile} */
export function tryPatchFileSync<D>(
  filePath: string,
  patcher: PatcherSyncFn<D>,
  { stringify: stringifyOpts, ...rest }: PatchFileSyncOptions<D> = {}
) {
  return tryPfSync<D>(filePath, patcher, {
    fileType: 'json',
    reader: tryParseFileSync,
    stringify: (d) => stringify(d, stringifyOpts?.replacer, stringifyOpts?.space),
    ...rest
  });
}

// #region> Unwrapped
/* c8 ignore start */
/** @see {@link tryPatchFile} */
export const patchFile = async <D>(
  filePath: string,
  patcher: PatcherFn<D>,
  opts?: PatchFileOptions<D>
) => unwrap(await tryPatchFile(filePath, patcher, opts));
/** @see {@link tryPatchFileSync} */
export const patchFileSync = <D>(
  filePath: string,
  patcher: PatcherSyncFn<D>,
  opts?: PatchFileOptions<D>
) => unwrap(tryPatchFileSync(filePath, patcher, opts));
/* c8 ignore stop */
//#endregion
