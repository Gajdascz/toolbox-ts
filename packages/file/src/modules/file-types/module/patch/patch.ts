import { tryPatchFile as tryPf, type PatcherFn } from '../../../helpers/index.js';
import { unwrap } from '../../../result.js';
import type { PatchFileOptions } from '../types.js';
import { tryParseFile } from '../parse/index.js';

export function tryPatchFile<D>(
  filePath: string,
  patcher: PatcherFn<D>,
  { stringify, ...rest }: PatchFileOptions<D>
) {
  return tryPf<D>(filePath, patcher, {
    fileType: 'module',
    reader: tryParseFile,
    stringify,
    ...rest
  });
}

//#region> Unwrapped
/* c8 ignore start */
/** @see {@link tryPatchFile} */
export const patchFile = async <D>(
  filePath: string,
  patcher: PatcherFn<D>,
  opts: PatchFileOptions<D>
) => unwrap(await tryPatchFile(filePath, patcher, opts));
/* c8 ignore stop */
//#endregion
