import { Obj } from '@toolbox-ts/utils';
import { doTry } from '@toolbox-ts/utils/core';
import { createJiti } from 'jiti';
import path from 'node:path';

import {
  writeFile as wf,
  type WriteFileOptions as WFO,
  type WriteConflictStrategy
} from '../helpers/helpers.js';

/* c8 ignore start */
//#region> Constants
const jiti = createJiti(process.cwd());
export const FILE_EXTENSIONS = [
  'js',
  'cjs',
  'mjs',
  'ts',
  'cts',
  'mts',
  'jsx',
  'tsx'
] as const;
export const FILE_EXTENSIONS_SET = new Set<string>(FILE_EXTENSIONS);
//#endregion
//#region> Types

export type ModuleFileExt = (typeof FILE_EXTENSIONS)[number];

export type ParseModuleArgs = [opts?: ParseModuleOptions];
export interface ParseModuleOptions {
  execute?: boolean;
  exportKey?: string;
}
//#endregion

const isValidObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const selectExport = (module: unknown, exportKey: string) => {
  if (isValidObject(module) && exportKey in module) return module[exportKey];
  throw new Error(`Export key "${exportKey}" not found in module`);
};

export const parse = async <T = unknown>(
  mod: unknown,
  ...[{ execute = true, exportKey } = {}]: ParseModuleArgs
): Promise<T> => {
  const value = exportKey ? selectExport(mod, exportKey) : mod;
  return execute && typeof value === 'function' ?
      await (value as () => T)()
    : (value as T);
};
/**
 * Loads a module from a given path and returns its exports.
 */
export const load = <T = unknown>(p: string): Promise<unknown> =>
  jiti.import<T>(p);

/**
 * Loads a module file and parses its exports.
 */
export const parseFile = <T>(
  filePath: string,
  ...args: ParseModuleArgs
): Promise<T> =>
  doTry(
    async () => parse(await load(filePath), ...args),
    (err) => {
      throw new Error(
        `Failed to parse module file ${filePath}: ${err.message}`,
        { cause: err }
      );
    }
  );

export type WriteFileOptions<D> = (
  | { conflict: 'merge'; mergeOpts?: Obj.MergeOptions }
  | { conflict?: WriteConflictStrategy; mergeOpts?: never }
)
  & Omit<WFO<D>, 'conflict'>;
export const writeFile = async <T>(
  filePath: string,
  data: T,
  { conflict, stringify, ...rest }: WriteFileOptions<T> = {}
) =>
  wf<T>(filePath, data, {
    conflict:
      conflict === 'merge' ?
        async () => Obj.merge(await parseFile(filePath), data)
      : conflict,
    stringify,
    ...rest
  });
export const isFile = (
  filename: string
): filename is `${string}.${ModuleFileExt}` =>
  FILE_EXTENSIONS_SET.has(path.extname(filename).toLowerCase().slice(1));
export {
  readFile as readFileText,
  readFileSync as readFileTextSync
} from '../helpers/index.js';
/* c8 ignore end */
