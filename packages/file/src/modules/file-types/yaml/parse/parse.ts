import { parse as parseYAML } from 'yaml';
import { tryReadFile, tryReadFileSync } from '../../../helpers/index.js';
import { unwrap } from '../../../result.js';
import type {
  ParseYAMLFileOptions,
  YAMLReviver,
  ParseFileOptions,
  ParseFileSyncOptions
} from '../types.js';

export const parse = <T>(
  content: string,
  reviverOrOptions?: ParseYAMLFileOptions | YAMLReviver,
  options?: ParseYAMLFileOptions
): T =>
  (typeof reviverOrOptions === 'function'
    ? parseYAML(content, reviverOrOptions, options)
    : parseYAML(content, reviverOrOptions)) as T;

export const tryParseFile = async <T>(
  filePath: string,
  { parserArgs = [], ...readFileOpts }: ParseFileOptions = {}
) =>
  tryReadFile<T>(filePath, (content: string) => parse(content, ...parserArgs), {
    ...readFileOpts,
    fileType: 'yaml'
  });

export const tryParseFileSync = <T>(
  filePath: string,
  { parserArgs = [], ...readFileOpts }: ParseFileSyncOptions = {}
) =>
  tryReadFileSync<T>(filePath, (content: string) => parse(content, ...parserArgs), {
    ...readFileOpts,
    fileType: 'yaml'
  });

//#region> Unwrapped
/* c8 ignore start */
/** @see {@link tryParseFile} */
export const parseFile = async <T>(filePath: string, opts?: ParseFileOptions) =>
  unwrap(await tryParseFile<T>(filePath, opts));
/** @see {@link tryParseFileSync} */
export const parseFileSync = <T>(filePath: string, opts?: ParseFileSyncOptions) =>
  unwrap(tryParseFileSync<T>(filePath, opts));
/* c8 ignore stop */
//#endregion
