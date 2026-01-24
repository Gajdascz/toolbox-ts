import { Obj } from '@toolbox-ts/utils';
import { doTry, doTrySync, type ResolvedError } from '@toolbox-ts/utils/core';
import path from 'node:path';
/* c8 ignore start */
// Simply wraps the 'yaml' library and parser factories
import {
  type DocumentOptions,
  type ParseOptions,
  parse as parseYAML,
  type SchemaOptions,
  stringify,
  type ToJSOptions
} from 'yaml';

import {
  readFile,
  readFileSync,
  writeFile as wf,
  type WriteFileOptions as WFO,
  type WriteConflictStrategy
} from '../helpers/helpers.js';

//#region> Constants
export const FILE_EXTENSIONS = ['yml', 'yaml'] as const;
export const FILE_EXTENSIONS_SET = new Set<string>(FILE_EXTENSIONS);
//#endregion

//#region> Types
export type ParseYAMLFileArgs = [
  reviver?: ParseYAMLFileOptions | YAMLReviver,
  options?: ParseYAMLFileOptions
];
export type ParseYAMLFileOptions = DocumentOptions
  & ParseOptions
  & SchemaOptions
  & ToJSOptions;
export type YamlFileExt = (typeof FILE_EXTENSIONS)[number];
export type YAMLReviver = (key: unknown, value: unknown) => unknown;
export type YAMLScalar = boolean | null | number | string;
export type YAMLValue = { [key: string]: YAMLValue } | YAMLScalar | YAMLValue[];
//#endregion

const execParseYAML = <T>(
  content: string,
  reviverOrOptions?: ParseYAMLFileOptions | YAMLReviver,
  options?: ParseYAMLFileOptions
): T =>
  (typeof reviverOrOptions === 'function' ?
    parseYAML(content, reviverOrOptions, options)
  : parseYAML(content, reviverOrOptions)) as T;

const createParserFailError = (filePath: string, err: ResolvedError) =>
  new Error(`Failed to parse JSON file ${filePath}: ${err.message}`, {
    cause: err
  });

export const parseFile = async <T>(
  filePath: string,
  ...args: ParseYAMLFileArgs
) =>
  doTry(
    async () => execParseYAML<T>(await readFile(filePath), ...args),
    (err) => {
      throw createParserFailError(filePath, err);
    }
  );

export const parseFileSync = <T>(
  filePath: string,
  ...args: ParseYAMLFileArgs
) =>
  doTrySync(
    () => execParseYAML<T>(readFileSync(filePath), ...args),
    (err) => {
      throw createParserFailError(filePath, err);
    }
  );

export const isFile = (
  filename: string
): filename is `${string}.${YamlFileExt}` =>
  FILE_EXTENSIONS_SET.has(path.extname(filename).toLowerCase().slice(1));

export type WriteFileOptions<D> = (
  | { conflict: 'merge'; mergeOpts?: Obj.MergeOptions }
  | { conflict?: WriteConflictStrategy; mergeOpts?: never }
)
  & Omit<WFO<D>, 'conflict' | 'stringify'>;

export const writeFile = async <T>(
  filePath: string,
  data: T,
  { conflict, mergeOpts, ...rest }: WriteFileOptions<T> = {}
) =>
  wf<T>(filePath, data, {
    conflict:
      conflict === 'merge' ?
        async () => Obj.merge(await parseFile(filePath), data, mergeOpts)
      : conflict,
    stringify,
    ...rest
  });

export { default as lib } from 'yaml';
export { parse, stringify } from 'yaml';
/* c8 ignore end */
