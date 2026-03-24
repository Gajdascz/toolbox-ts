/* c8 ignore start */
import { parse as _parse } from 'comment-json';

import { tryReadFile as tryRf, tryReadFileSync as tryRfSync } from '../../../helpers/index.js';
import { unwrap } from '../../../result.js';
import type { ParseFileOptions, ParseFileSyncOptions, ParseFn } from '../types.js';

export const parse = _parse as ParseFn;

/**
 * Reads a JSON file and parses its contents into a JavaScript object.
 *
 * @param json - A valid JSON string.
 * @param reviver - A function that transforms the results. This function is called for each member of the object.
 * @param removesComments - If true, the comments won't be maintained, which is often used when we want to get a clean object.
 * If a member contains nested objects, the nested objects are transformed before the parent object is.
 *
 */
export const tryParseFile = async <T>(
  filePath: string,
  { parserArgs = [], ...readFileArgs }: ParseFileOptions = {}
) =>
  tryRf<T>(filePath, (content: string) => parse(content, ...parserArgs), {
    ...readFileArgs,
    fileType: 'json'
  });

/** Synchronously version of @see {@link tryParseFile} */
export const tryParseFileSync = <T>(
  filePath: string,
  { parserArgs = [], ...readFileArgs }: ParseFileSyncOptions = {}
) =>
  tryRfSync<T>(filePath, (content: string) => parse(content, ...parserArgs), {
    ...readFileArgs,
    fileType: 'json'
  });

// #region> Unwrapped
/* c8 ignore start */
/** @see {@link tryParseFile} */
export const parseFile = async <T>(filePath: string, opts?: ParseFileOptions) =>
  unwrap(await tryParseFile<T>(filePath, opts));
/** @see {@link tryParseFileSync} */
export const parseFileSync = <T>(filePath: string, opts?: ParseFileSyncOptions) =>
  unwrap(tryParseFileSync<T>(filePath, opts));
/* c8 ignore stop */
//#endregion
