import type {
  AlphabetLowercase,
  AlphabetUppercase
} from '@oclif/core/interfaces';

import { Obj, Str, type StrRecord } from '@toolbox-ts/utils';
import {
  execa,
  ExecaError,
  execaSync,
  ExecaSyncError,
  type Options,
  parseCommandString,
  type Result,
  type SyncOptions
} from 'execa';

import type {
  CommandInput,
  CommandTuple,
  ExecaOptionsNoStdio,
  Flag
} from '../types.js';

export const resolveError = (error: unknown): InstanceType<typeof Error> => {
  if (error instanceof ExecaError || error instanceof ExecaSyncError)
    return new Error(
      `Command: ${error.command}\nExit code: ${error.exitCode}\nMessage: ${error.message}`
    );
  else if (error instanceof Error) return error;
  else return new Error(`Unknown Error: ${String(error)}`, { cause: error });
};

export const normalizeInput = (cmd: CommandInput): CommandTuple => {
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
export const getNormalizeInputWrapper = (cmd: string) => {
  const [wrappedExecutable, ...wrappedArgs] = parseCommandString(cmd);
  if (!wrappedExecutable)
    throw new TypeError(`Invalid command string: "${cmd}"`);
  return (input: CommandInput): CommandTuple => {
    const [executable, args] = normalizeInput(input);
    return [wrappedExecutable, [...wrappedArgs, executable, ...args]];
  };
};

export const spawn = <O extends Options = Options>(
  cmd: CommandInput,
  execaOpts?: O
) => {
  const [executable, args] = normalizeInput(cmd);
  return execa<O>(executable, args, execaOpts);
};
export const spawnSync = <O extends SyncOptions = SyncOptions>(
  cmd: CommandInput,
  execaOpts?: O
) => {
  const [executable, args] = normalizeInput(cmd);
  return execaSync<O>(executable, args, execaOpts);
};
export const chain = async (
  [first, ...rest]: CommandInput[],
  opts?: ExecaOptionsNoStdio
): Promise<Result> => {
  const _opts: Options = { ...opts, stdio: 'pipe' };
  let proc = spawn(first, _opts);
  for (const cmd of rest) {
    const [executable, args] = normalizeInput(cmd);
    (proc as unknown) = await proc.pipe(executable, args, _opts);
  }
  return await proc;
};

export const kebabToFlagEntry = <T extends string>(
  key: T
): Readonly<[Str.KebabToCamel<T>, Flag<T>]> =>
  [Str.kebabToCamel(key), Str.prefix('--', key)] as const;

export const toFlag = <T extends string>(key: T): Flag<Str.CamelToKebab<T>> =>
  Str.prefix('--', Str.camelToKebab(key));

export interface FlagMetaOpts {
  acceptsCommaSeparated?: boolean;
  char?: AlphabetLowercase | AlphabetUppercase;
  helpGroup?: string;
  otherAliases?: string[];
}
export const flagMeta = (
  name: string,
  description: string,
  {
    acceptsCommaSeparated = false,
    otherAliases = [],
    char,
    helpGroup
  }: FlagMetaOpts = {}
) => {
  const toKebab = Str.camelToKebab(name);
  const aliases = [...otherAliases];
  if (toKebab !== name) aliases.push(toKebab);
  let desc = Str.capitalize(description.trim());
  const lastChar = desc.slice(-1);
  if (!/[.!?]/.test(lastChar)) desc += '.';
  return {
    name,
    description: `${desc}${acceptsCommaSeparated ? ` Provide a comma-separated list for multiple values` : ''}`,
    aliases,
    char,
    helpLabel: `--${toKebab}`,
    helpGroup
  };
};
export const strOrNum = (input?: number | string) => {
  const asNum = Number(input);
  return Number.isNaN(asNum) ? input : asNum;
};
export const when = <T, C = unknown>(
  condition: C,
  value: ((v: NonNullable<C>) => T) | T
): T | undefined => {
  if (!condition) return undefined;
  if (typeof value === 'function')
    return (value as (v: NonNullable<C>) => T)(condition);
  return value;
};
export const nestWhen = <T, C = unknown>(
  key: string,
  condition: C,
  value: ((v: NonNullable<C>) => T) | T
): { [k: string]: T } | undefined => {
  const v = when(condition, value);
  if (v === undefined) return undefined;
  return { [key]: v };
};
