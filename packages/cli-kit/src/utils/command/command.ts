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

/**
 * Resolves various error types into a standard Error instance.
 *
 * Specifically handles ExecaError and ExecaSyncError to provide
 * more context about command execution failures.
 *
 * Removes the need for type assertions/validation when handling errors.
 *
 * @example
 * ```ts
 * try {
 *   await spawn('some-bad-command');
 * } catch (error: unknown) {
 *   const err = resolveError(error);
 *   console.error(err.message);
 * }
 * ```
 */
export const resolveError = (error: unknown): InstanceType<typeof Error> => {
  if (error instanceof ExecaError || error instanceof ExecaSyncError)
    return new Error(
      `Command: ${error.command}\nExit code: ${error.exitCode}\nMessage: ${error.message}`
    );
  else if (error instanceof Error) return error;
  else return new Error(`Unknown Error: ${String(error)}`, { cause: error });
};

/**
 * Spawns a command using execa with normalized input.
 *
 * @example
 * ```ts
 * const result = await spawn('ls -la', { cwd: '/some/path' });
 * console.log(result.stdout) // lists files in /some/path in console
 * ```
 */
export const spawn = <O extends Options = Options>(
  cmd: CommandInput,
  execaOpts?: O
) => {
  const [executable, args] = normalize.commandInput(cmd);
  return execa<O>(executable, args, execaOpts);
};
/**
 * Spawns a command synchronously using execaSync with normalized input.
 *
 * @example
 * ```ts
 * const result = spawnSync('ls -la', { cwd: '/some/path' });
 * console.log(result.stdout) // lists files in /some/path in console
 * ```
 */
export const spawnSync = <O extends SyncOptions = SyncOptions>(
  cmd: CommandInput,
  execaOpts?: O
) => {
  const [executable, args] = normalize.commandInput(cmd);
  return execaSync<O>(executable, args, execaOpts);
};
/**
 * Chains multiple commands together, piping the output of each command
 * to the input of the next, using execa.
 *
 * Each command is executed with stdio set to 'pipe' to facilitate piping.
 *
 * @example
 * ```ts
 * await chain([
 *   'echo "Hello World"',
 *   'grep Hello',
 *   ['awk', '{print $2}']
 * ]);
 * // Result: { stdout: 'World', ... }
 * ```
 */
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
