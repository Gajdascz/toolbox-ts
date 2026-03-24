import { stringify } from 'yaml';
import {
  tryPatchFile as tryPf,
  tryPatchFileSync as tryPfSync,
  type PatcherFn,
  type PatcherSyncFn
} from '../../../helpers/index.js';
import type { PatchFileOptions } from '../types.js';
import { tryParseFile, tryParseFileSync } from '../parse/index.js';
import { unwrap } from '../../../result.js';

export function tryPatchFile<D>(
  filePath: string,
  patcher: PatcherFn<D>,
  { stringify: stringifyOpts, ...rest }: PatchFileOptions<D> = {}
) {
  return tryPf<D>(filePath, patcher, {
    fileType: 'yaml',
    reader: tryParseFile,
    stringify: (data) => stringify(data, stringifyOpts?.replacer, stringifyOpts),
    ...rest
  });
}

export function tryPatchFileSync<D>(
  filePath: string,
  patcher: PatcherSyncFn<D>,
  { stringify: stringifyOpts, ...rest }: PatchFileOptions<D> = {}
) {
  return tryPfSync<D>(filePath, patcher, {
    ...rest,
    fileType: 'yaml',
    reader: tryParseFileSync,
    stringify: (data) => stringify(data, stringifyOpts?.replacer, stringifyOpts)
  });
}

//#region> Unwrapped
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
