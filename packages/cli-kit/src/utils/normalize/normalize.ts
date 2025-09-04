import { Obj, type StrKey, type StrRecord } from '@toolbox-ts/utils';
import { parseCommandString } from 'execa';

import type { CommandInput, CommandTuple } from '../../types.js';

import { toFlag } from '../flags/index.js';

/** Normalizes various command input formats into a consistent tuple format. */
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
 */
export const strOrNum = (input?: number | string) => {
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
export type FlagSpecToObjArgMap<T> = Partial<Record<StrKey<T>, ObjToFlagSpec>>;
export type InferObjToFlagArg<T> = {
  [K in StrKey<T>]?: NonNullable<
    FlagSpecToObjArgMap<T>[K]
  >['arrayFormat'] extends string ?
    string[]
  : T[K];
};

export interface ObjToFlagSpec {
  arrayFormat?: 'comma' | 'json' | 'repeat';
  sep?: 'equals' | 'space';
}
export const flagArgs = <T>(
  flags: T,
  specs: FlagSpecToObjArgMap<T>
): InferObjToFlagArg<T> =>
  Obj.keys(flags).reduce<InferObjToFlagArg<T>>((acc, key) => {
    const value = flags[key];
    const spec = specs[key];
    if (!spec) {
      (acc as StrRecord)[key] = value;
      return acc;
    }
    if (spec.arrayFormat) {
      if (Array.isArray(value)) acc[key] = value;
      else if (typeof value === 'string')
        (acc as StrRecord)[key] = value.split(',');
      else if (value === undefined || value === null)
        (acc as StrRecord)[key] = [];
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
