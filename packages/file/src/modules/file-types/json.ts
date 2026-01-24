import { Obj } from '@toolbox-ts/utils';
import { doTry, doTrySync, type ResolvedError } from '@toolbox-ts/utils/core';
/* c8 ignore start */
// Simply wraps the 'comment-json' library and parser factories
import { parse, stringify } from 'comment-json';
import path from 'node:path';

import {
  readFile,
  readFileSync,
  writeFile as wf,
  type WriteFileOptions as WFO,
  type WriteConflictStrategy
} from '../helpers/helpers.js';
//#region> Constants
export const FILE_EXTENSIONS = ['json', 'json5', 'jsonc'] as const;
export const FILE_EXTENSIONS_SET = new Set<string>(FILE_EXTENSIONS);
//#endregion

//#region> Types
export type JsonFileExt = (typeof FILE_EXTENSIONS)[number];
export type ParseJSONFileArgs = [
  /**
   * A function that transforms the results. This function is called for each member of the object.
   */
  reviver?: Parameters<typeof parse>[1],
  /**
   * If true, the comments won't be maintained, which is often used when we want to get
   * a clean object. If a member contains nested objects, the nested objects are
   * transformed before the parent object is.
   *
   */
  removeComments?: Parameters<typeof parse>[2]
];

//#endregion
const createParserFailError = (filePath: string, err: ResolvedError) =>
  new Error(`Failed to parse JSON file ${filePath}: ${err.message}`, {
    cause: err
  });
/**
 * Converts a JavaScript Object Notation (JSON) string into an object.
 * @param json - A valid JSON string.
 * @param reviver - A function that transforms the results. This function is called for each member of the object.
 * @param removesComments - If true, the comments won't be maintained, which is often used when we want to get a clean object.
 * If a member contains nested objects, the nested objects are transformed before the parent object is.
 *
 * @see {@link parse}
 */
export const parseFile = async <T>(
  filePath: string,
  ...args: ParseJSONFileArgs
): Promise<T> =>
  doTry(
    async () => parse(await readFile(filePath), ...args) as T,
    (err) => {
      throw createParserFailError(filePath, err);
    }
  );

export const parseFileSync = <T>(
  filePath: string,
  ...args: ParseJSONFileArgs
): T =>
  doTrySync(
    () => parse(readFileSync(filePath), ...args) as T,
    (err) => {
      throw createParserFailError(filePath, err);
    }
  );

export const isFile = (
  filename: string
): filename is `${string}.${JsonFileExt}` =>
  FILE_EXTENSIONS_SET.has(path.extname(filename).toLowerCase().slice(1));

export type WriteFileOptions<D> = (
  | { conflict: 'merge'; mergeOpts?: Obj.MergeOptions }
  | { conflict?: WriteConflictStrategy; mergeOpts?: never }
)
  & Omit<WFO<D>, 'conflict' | 'stringify'>;
export const writeFile = <D extends object>(
  filePath: string,
  data: D,
  { conflict, mergeOpts, ...rest }: WriteFileOptions<D> = {}
) =>
  wf<D>(filePath, data, {
    conflict:
      conflict === 'merge' ?
        async () => Obj.merge(await parseFile(filePath), data, mergeOpts)
      : conflict,
    stringify,
    ...rest
  });

export { parse, stringify } from 'comment-json';
export { default as lib } from 'comment-json';
export type { CommentJSONValue } from 'comment-json';
/* c8 ignore end */
