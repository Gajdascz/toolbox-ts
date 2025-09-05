import { Obj, Str, type StrKey, type StrRecord } from '@toolbox-ts/utils';
import { parseCommandString } from 'execa';

import type { CommandInput, CommandTuple } from '../../types.js';

import { toFlag } from '../flags/index.js';

/**
 * Parses and normalizes various command input formats into a consistent tuple.
 *
 * Supports:
 * - String: 'executable arg1 arg2'
 * - Tuple: [executable, [arg1, arg2]]
 * - Array: ['executable', 'arg1', 'arg2']
 *
 * @example
 * ```ts
 * commandInput('ls -la') // ['ls', ['-la']]
 * commandInput(['git', 'commit', '-m', 'message']) // ['git', ['commit', '-m', 'message']]
 * commandInput(['npm', ['install', 'package']]) // ['npm', ['install', 'package']]
 * ```
 */
export const commandInput = (cmd: CommandInput): CommandTuple => {
  if (typeof cmd === 'string') {
    const [executable, ...args] = parseCommandString(cmd);
    return [executable, args];
  }
  if (Array.isArray(cmd)) {
    if (typeof cmd[0] === 'string' && Array.isArray(cmd[1]))
      return [cmd[0], cmd[1]];
    return [cmd[0], cmd.slice(1) as string[]];
  }
  throw new TypeError(
    `Expected input to be a in the format:
    - string: 'executable stringArg1? stringArg2?'
    - tuple: [executable, [stringArg1, stringArg2]?]
    - array: ['executable', 'stringArg1'?, 'stringArg2'?]
  Received: ${JSON.stringify(cmd)}`
  );
};
/**
 * Wraps a command string, allowing additional commands to be prepended.
 *
 * - useful for wrapping executables with tools like 'npx' or 'git'
 *
 * @example
 * ```ts
 * const wrapWithNpx = getCommandInputWrapper('npx');
 * const cmd = wrapWithNpx(['eslint', ['--fix', 'src/']]);
 * // results in: ['npx', ['eslint', '--fix', 'src/']]
 *
 * const wrapWithGit = getCommandInputWrapper('git');
 * const cmd2 = wrapWithGit('commit -m "Initial commit"');
 * // results in: ['git', ['commit', '-m', 'Initial commit']]
 * ```
 */
export const getCommandInputWrapper = (cmd: string) => {
  const [wrappedExecutable, ...wrappedArgs] = parseCommandString(cmd);
  if (!wrappedExecutable)
    throw new TypeError(`Invalid command string: "${cmd}"`);
  return (input: CommandInput): CommandTuple => {
    const [executable, args] = commandInput(input);
    return [wrappedExecutable, [...wrappedArgs, executable, ...args]];
  };
};

/**
 * Checks if the input is a number or a numeric string
 * and returns it as a number; otherwise, returns the original input.
 *
 * If the input is an empty string, it returns the empty string.
 *
 * @example
 * ```ts
 * strOrNum('42') // 42 (number)
 * strOrNum(3.14) // 3.14 (number)
 * strOrNum('not-a-number') // 'not-a-number' (string)
 * strOrNum(undefined) // undefined
 * strOrNum('') // '' (empty string)
 * ```
 */
export const strOrNum = (input?: number | string) => {
  if (input === '') return input;
  const asNum = Number(input);
  return Number.isNaN(asNum) ? input : asNum;
};
/**
 * Conditionally returns a value based on the provided condition.
 *
 * @example
 * ```ts
 * const flags = {
 *   verbose: when(isVerbose, true),
 *   timeout: when(timeoutValue, (v) => strOrNum(v))
 * };
 * ```
 */
export const when = <T, C = unknown>(
  condition: C,
  value: ((v: NonNullable<C>) => T) | T
): T | undefined => {
  if (!condition) return undefined;
  if (typeof value === 'function')
    return (value as (v: NonNullable<C>) => T)(condition);
  return value;
};
/**
 * Conditionally nests a value under a specified key in an object.
 * - Useful for conditionally adding properties to objects and omitting
 *   undefined values (spreading in objects).
 *
 * @example
 * ```ts
 * const config = {
 *   host: 'localhost',
 *   ...nestWhen('port', portValue, (v) => strOrNum(v)),
 *   ...nestWhen('useSSL', isSecure, true)
 * };
 * ```
 */
export const nestWhen = <T, C = unknown>(
  key: string,
  condition: C,
  value: ((v: NonNullable<C>) => T) | T
): { [k: string]: T } | undefined => {
  const v = when(condition, value);
  if (v === undefined) return undefined;
  return { [key]: v };
};

/**
 * Maps object keys to @see {@link ObjToFlagSpec} options for use with `objToFlags`.
 */
export type FlagSpecToObjArgMap<T> = Partial<Record<StrKey<T>, ObjToFlagSpec>>;

/**
 * Infers the argument type for `objToFlags` based on the provided flag specifications.
 * - Converts array types to string arrays if `arrayFormat` is specified in the spec.
 */
export type InferObjToFlagArg<T> = {
  [K in StrKey<T>]?: NonNullable<
    FlagSpecToObjArgMap<T>[K]
  >['arrayFormat'] extends string ?
    string[]
  : T[K];
};
/**
 * Type definition to define how to handle specific object keys when converting
 * to command-line flags using @see {@link objToFlags}.
 */
export interface ObjToFlagSpec {
  arrayFormat?: 'comma' | 'json' | 'repeat';
  sep?: 'equals' | 'space';
}

/**
 * Converts an object from flag input and normalizes the values to be accepted in @see {@link objToFlags}.
 *
 * @example
 * ```ts
 * const spec = {
 *    verbose: { arrayFormat: undefined, sep: 'space' },
 *    dryRun: { arrayFormat: undefined, sep: 'space' },
 *    date: { arrayFormat: undefined, sep: 'equals' },
 *    short: { arrayFormat: undefined, sep: 'equals' },
 *    exclude: { arrayFormat: 'repeat', sep: 'space' },
 *    glob: { arrayFormat: 'repeat', sep: 'equals' },
 *    filter: { arrayFormat: 'repeat', sep: 'space' },
 *    grep: { arrayFormat: 'repeat', sep: 'space' },
 *    other: { arrayFormat: 'json', sep: 'equals' },
 *    random: { arrayFormat: 'comma', sep: 'equals' }
 * };
 * const res = flagArgs({
 *    verbose: true,
 *    dryRun: false,
 *    date: 'now',
 *    short: 5,
 *    exclude: 'a,b',
 *    glob: null,
 *    filter: {},
 *    unknown: 'x',
 *    grep: ['t'],
 *    other: undefined,
 *    random: ''},
 *    spec
 * );
 *
 * // results in: {
 * //   verbose: true,
 * //   dryRun: false,
 * //   date: 'now',
 * //   short: 5,
 * //   glob: null,
 * //   filter: ['[object Object]'],
 * //   exclude: ['a', 'b'],
 * //   unknown: 'x',
 * //   grep: ['t'],
 * //   other: undefined,
 * //   random: []
 *   }
 *```
 */
export const flagArgs = <T>(
  flags: T,
  specs: FlagSpecToObjArgMap<T>
): InferObjToFlagArg<T> =>
  Obj.keys(flags).reduce<InferObjToFlagArg<T>>((acc, key) => {
    const value = flags[key];
    const spec = specs[key];
    if (
      !spec
      || value === undefined
      || value === null
      || typeof value === 'boolean'
    ) {
      (acc as StrRecord)[key] = value;
      return acc;
    }
    if (spec.arrayFormat) {
      if (Array.isArray(value)) acc[key] = value;
      else if (typeof value === 'string')
        (acc as StrRecord)[key] = Str.cleanArr(value.split(','), false);
      else (acc as StrRecord)[key] = [String(value)];
    } else (acc as StrRecord)[key] = value;
    return acc;
  }, {});

const pushWithSep = (
  v: unknown,
  sep: 'equals' | 'space',
  flag: string,
  acc: string[]
) => {
  if (sep === 'equals') acc.push(`${flag}=${String(v)}`);
  else acc.push(flag, String(v));
  return acc;
};

/**
 * Converts an object to an array of command-line flags based on the provided specifications.
 *
 * - Boolean true values are added as standalone flags (e.g., `--verbose`).
 * - Boolean false, undefined, and null values are omitted.
 * - String and number values are added with their corresponding flags (e.g., `--timeout 30`).
 * - Array values can be formatted in different ways based on the `arrayFormat` option:
 *   - 'comma': Joins array elements with commas (e.g., `--tags tag1,tag2`).
 *   - 'json': Serializes the array as a JSON string (e.g., `--tags ["tag1","tag2"]`).
 *   - 'repeat': Repeats the flag for each element in the array (e.g., `--tag tag1 --tag tag2`).
 * - The `sep` option determines how values are separated from their flags:
 *   - 'space': Uses a space to separate the flag and its value (e.g., `--timeout 30`).
 *   - 'equals': Uses an equals sign to separate the flag and its value (e.g., `--timeout=30`).
 * - Default behavior can be overridden globally or per key using the `opts` and `localSpec` parameters.
 *
 * @example
 * ```ts
 * const spec = {
 *    verbose: { sep: 'space' },
 *    timeout: { sep: 'equals' },
 *    tags: { arrayFormat: 'repeat', sep: 'space' },
 * }
 *
 * const flags = {
 *   verbose: true,
 *   timeout: '30',
 *   tags: ['tag1', 'tag2'],
 *   debug: false,
 *   output: undefined
 * };
 *
 * const args = objToFlags(flags, { arrayFormat: 'comma', sep: 'space' }, spec);
 * // results in:
 * // [
 * //   '--verbose',
 * //   '--timeout=30',
 * //   '--tags', 'tag1',
 * //   '--tags', 'tag2'
 * // ]
 *```
 */
export const objToFlags = <T>(
  obj: T,
  opts: ObjToFlagSpec = {},
  localSpec: Partial<Record<keyof T, ObjToFlagSpec>> = {}
): string[] => {
  const defaults: Required<ObjToFlagSpec> = {
    arrayFormat: opts.arrayFormat ?? 'comma',
    sep: opts.sep ?? 'space'
  };
  return Obj.keys(obj).reduce<string[]>((acc, key) => {
    const value = obj[key];
    if (value !== undefined && value !== null && value !== false) {
      const { arrayFormat, sep } = { ...defaults, ...localSpec[key] };
      const flag = toFlag(key);
      if (value === true) acc.push(flag);
      else if (Array.isArray(value)) {
        if (arrayFormat === 'repeat') {
          for (const item of value) acc = pushWithSep(item, sep, flag, acc);
        } else {
          const joined =
            arrayFormat === 'json' ? JSON.stringify(value) : value.join(',');
          acc = pushWithSep(joined, sep, flag, acc);
        }
      } else acc = pushWithSep(value, sep, flag, acc);
    }
    return acc;
  }, []);
};
