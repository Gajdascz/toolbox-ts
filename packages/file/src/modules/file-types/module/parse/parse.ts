/* c8 ignore start */
import { parse as _parse } from 'comment-json';

import { ReadFileError } from '../../../helpers/index.js';
import { Obj } from '@toolbox-ts/utils';
import type { ParseArgs } from '../types.js';
import { load } from '../jiti.js';
import { tryCatch, unwrap } from '../../../result.js';
const selectExport = (module: unknown, exportKey: string) => {
  if (Obj.is.plain(module) && exportKey in module) return module[exportKey];
  throw new Error(`Export key "${exportKey}" not found in module`);
};

export const parse = async <T = unknown>(
  mod: unknown,
  ...[{ execute = true, exportKey } = {}]: ParseArgs
): Promise<T> => {
  const value = exportKey ? selectExport(mod, exportKey) : mod;
  return execute && typeof value === 'function' ? await (value as () => T)() : (value as T);
};
/**
 * Loads a module file and parses its exports.
 */
export const tryParseFile = <T>(filePath: string, ...args: ParseArgs) =>
  tryCatch<T, ReadFileError>(
    async () => parse<T>(await load(filePath), ...args),
    (e) => new ReadFileError(filePath, 'module', e)
  );

//#region> Unwrapped
/* c8 ignore start */
/** @see {@link tryParseFile} */
export const parseFile = async <T>(filePath: string, ...args: ParseArgs) =>
  unwrap(await tryParseFile<T>(filePath, ...args));
/* c8 ignore stop */
//#endregion
