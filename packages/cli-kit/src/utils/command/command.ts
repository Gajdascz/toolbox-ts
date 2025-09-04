import {
  execa,
  ExecaError,
  execaSync,
  ExecaSyncError,
  type Options,
  type Result,
  type SyncOptions
} from 'execa';

import type { CommandInput, ExecaOptionsNoStdio } from '../../types.js';

import { normalize } from '../normalize/index.js';
export const resolveError = (error: unknown): InstanceType<typeof Error> => {
  if (error instanceof ExecaError || error instanceof ExecaSyncError)
    return new Error(
      `Command: ${error.command}\nExit code: ${error.exitCode}\nMessage: ${error.message}`
    );
  else if (error instanceof Error) return error;
  else return new Error(`Unknown Error: ${String(error)}`, { cause: error });
};

export const spawn = <O extends Options = Options>(
  cmd: CommandInput,
  execaOpts?: O
) => {
  const [executable, args] = normalize.commandInput(cmd);
  return execa<O>(executable, args, execaOpts);
};
export const spawnSync = <O extends SyncOptions = SyncOptions>(
  cmd: CommandInput,
  execaOpts?: O
) => {
  const [executable, args] = normalize.commandInput(cmd);
  return execaSync<O>(executable, args, execaOpts);
};
export const chain = async (
  [first, ...rest]: CommandInput[],
  opts?: ExecaOptionsNoStdio
): Promise<Result> => {
  const _opts: Options = { ...opts, stdio: 'pipe' };
  let proc = spawn(first, _opts);
  for (const cmd of rest) {
    const [executable, args] = normalize.commandInput(cmd);
    (proc as unknown) = await proc.pipe(executable, args, _opts);
  }
  return await proc;
};
