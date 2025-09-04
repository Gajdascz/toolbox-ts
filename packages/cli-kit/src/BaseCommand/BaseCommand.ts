import type { Options, Result, SyncOptions } from 'execa';

import { Command } from '@oclif/core';

import type {
  CommandInput,
  CommandOptions,
  CommandOptionsNoStdio,
  ErrorBehavior
} from '../types.js';

import { ghActionsAnnotations } from '../reporters/index.js';
import {
  chain,
  normalize,
  resolveError,
  spawn,
  spawnSync
} from '../utils/index.js';

/** Base command class for executing shell commands with Oclif. */
export abstract class BaseCommand extends Command {
  static readonly reporters = {
    ghActionsAnnotations: <T>(adapter: ghActionsAnnotations.Adapter<T>) =>
      new ghActionsAnnotations.Reporter<T>(adapter)
  };
  /* c8 ignore start */
  readonly normalize = {
    objArgs: normalize.objToFlags,
    flagArgs: normalize.flagArgs,
    strOrNum: normalize.strOrNum,
    when: normalize.when,
    nestWhen: normalize.nestWhen
  };
  /* c8 ignore end */
  set defaultErrorBehavior(mode: ErrorBehavior) {
    this._defaultErrorBehavior = mode;
  }
  get defaultErrorBehavior() {
    return this._defaultErrorBehavior;
  }

  protected resolveError = resolveError;

  protected readonly sync = {
    exec: <O extends SyncOptions = SyncOptions>(
      cmd: CommandInput,
      opts?: CommandOptions<O>
    ) => {
      const { execaOpts, onExecFail = this._defaultErrorBehavior } = opts ?? {};
      try {
        return spawnSync<O>(cmd, execaOpts);
      } catch (error) {
        const err = resolveError(error);
        if (onExecFail === 'throw') throw err;
        this.error(err);
      }
    },
    execWithStdio<
      S extends SyncOptions['stdio'],
      O extends
        CommandOptionsNoStdio<SyncOptions> = CommandOptionsNoStdio<SyncOptions>
    >(cmd: CommandInput, stdio: S, opts?: O) {
      return this.exec<{ stdio: S }>(cmd, {
        execaOpts: { ...opts?.execaOpts, stdio },
        onExecFail: opts?.onExecFail
      });
    },
    string(cmd: CommandInput, opts?: CommandOptionsNoStdio<SyncOptions>) {
      return this.execWithStdio(cmd, 'pipe', opts).stdout.trim();
    }
  } as const;
  private _defaultErrorBehavior: ErrorBehavior = 'terminate';

  protected async chain(
    input: CommandInput[],
    opts?: CommandOptionsNoStdio
  ): Promise<Result> {
    const { execaOpts, onExecFail = this._defaultErrorBehavior } = opts ?? {};
    try {
      this.preExec();
      return await chain(input, execaOpts);
    } catch (error) {
      const err = this.resolveError(error);
      if (onExecFail === 'throw') throw err;
      this.error(err);
      /* c8 ignore start */
    } finally {
      this.postExec();
    }
    /* c8 ignore end */
  }
  protected async exec<O extends Options = Options>(
    cmd: CommandInput,
    opts?: CommandOptions<O>
  ) {
    const { execaOpts, onExecFail = this._defaultErrorBehavior } = opts ?? {};
    try {
      this.preExec();
      return await spawn(cmd, execaOpts);
    } catch (error) {
      const err = resolveError(error);
      if (onExecFail === 'throw') throw err;
      this.error(err);
    } finally {
      this.postExec();
    }
  }

  protected async execWithStdio<
    S extends Options['stdio'],
    O extends CommandOptionsNoStdio = CommandOptionsNoStdio
  >(cmd: CommandInput, stdio: S, opts?: O) {
    return await this.exec<{ stdio: S }>(cmd, {
      execaOpts: { ...opts?.execaOpts, stdio },
      onExecFail: opts?.onExecFail
    });
  }

  protected postExec() {
    return;
  }

  protected preExec() {
    return;
  }

  protected async string(cmd: CommandInput, opts?: CommandOptionsNoStdio) {
    return (await this.execWithStdio(cmd, 'pipe', opts)).stdout.trim();
  }
  protected wrap(mainCommand: string) {
    const normalizeInput = normalize.getCommandInputWrapper(mainCommand);
    const exec = <O extends CommandOptions = CommandOptions>(
      cmd: CommandInput,
      opts?: O
    ) => {
      return this.exec(normalizeInput(cmd), opts);
    };
    const execWithStdio = <
      S extends Options['stdio'],
      O extends CommandOptionsNoStdio = CommandOptionsNoStdio
    >(
      cmd: CommandInput,
      stdio: S,
      opts?: O
    ) => {
      return this.execWithStdio(normalizeInput(cmd), stdio, opts);
    };
    const string = <O extends CommandOptionsNoStdio = CommandOptionsNoStdio>(
      cmd: CommandInput,
      opts?: O
    ) => {
      return this.string(normalizeInput(cmd), opts);
    };
    const sync = {
      exec: <
        O extends CommandOptions<SyncOptions> = CommandOptions<SyncOptions>
      >(
        cmd: CommandInput,
        opts?: O
      ) => {
        return this.sync.exec(normalizeInput(cmd), opts);
      },
      execWithStdio: <
        S extends SyncOptions['stdio'],
        O extends
          CommandOptionsNoStdio<SyncOptions> = CommandOptionsNoStdio<SyncOptions>
      >(
        cmd: CommandInput,
        stdio: S,
        opts?: O
      ) => {
        return this.sync.execWithStdio(normalizeInput(cmd), stdio, opts);
      },
      string: <
        O extends
          CommandOptionsNoStdio<SyncOptions> = CommandOptionsNoStdio<SyncOptions>
      >(
        cmd: CommandInput,
        opts?: O
      ) => {
        return this.sync.string(normalizeInput(cmd), opts);
      }
    } as const;
    return { exec, execWithStdio, normalizeInput, string, sync };
  }
}
