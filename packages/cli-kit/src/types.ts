import type { Options, SyncOptions } from 'execa';

/**
 * Input formats supported:
 * - Tuple Input: [executable, [arg1,arg2]?]
 * - String Input: 'executable arg1? arg2?'
 * - Array Input: ['executable', 'arg1'?, 'arg2'?]
 */
export type CommandInput = [string, string[]?] | string | string[];
/** Options for executing commands, extending execa's Options. */
export interface CommandOptions<O extends Options | SyncOptions = Options> {
  execaOpts?: O;

  onExecFail?: ErrorBehavior;
}

export interface CommandOptionsNoStdio<
  O extends Options | SyncOptions = Options
> {
  execaOpts?: ExecaOptionsNoStdio<O>;
  onExecFail?: ErrorBehavior;
}

/** A tuple containing a command and its arguments. */
export type CommandTuple<Executable extends string = string> = [
  /** Primary executable (e.g. git, depcruise, run) */
  executable: Executable,
  /** Positional arguments and flags */
  args: string[]
];
export type ErrorBehavior = 'terminate' | 'throw';

export type ExecaOptionsNoStdio<O extends Options | SyncOptions = Options> =
  Omit<O, 'stdio'>;

export type Flag<S extends string = string> = `--${S}`;
