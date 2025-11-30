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
  /**
   * Reporters for various output formats and integrations.
   * - Currently includes GitHub Actions Annotations reporter.
   */
  static readonly reporters = {
    ghActionsAnnotations: <T>(adapter: ghActionsAnnotations.Adapter<T>) =>
      new ghActionsAnnotations.Reporter<T>(adapter)
  };
  set defaultErrorBehavior(mode: ErrorBehavior) {
    this._defaultErrorBehavior = mode;
  }
  get defaultErrorBehavior() {
    return this._defaultErrorBehavior;
  }
  /* c8 ignore start */
  /** Utility methods for normalizing command arguments. */
  protected readonly normalize = {
    objArgs: normalize.objToFlags,
    flagArgs: normalize.flagArgs
  };
  /* c8 ignore end */

  protected resolveError = resolveError;

  /** Synchronous command execution utilities. */
  protected readonly sync = {
    /**
     * Executes a command synchronously using execaSync with normalized input.
     *
     * @example
     * ```ts
     * const result = this.sync.exec('ls -la', { execaOpts: { cwd: '/some/path' } });
     * console.log(result.stdout) // lists files in /some/path in console
     * ```
     */
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
    /**
     * Executes a command with specified stdio configuration.
     *
     * @example
     * ```ts
     * const result = this.sync.execWithStdio('ls -la', 'inherit');
     * // Output is printed directly to the console
     * ```
     */
    execWithStdio<
      S extends SyncOptions['stdio'],
      O extends CommandOptionsNoStdio<SyncOptions> =
        CommandOptionsNoStdio<SyncOptions>
    >(cmd: CommandInput, stdio: S, opts?: O) {
      return this.exec<{ stdio: S }>(cmd, {
        execaOpts: { ...opts?.execaOpts, stdio },
        onExecFail: opts?.onExecFail
      });
    },
    /**
     * Executes a command and returns its trimmed stdout as a string.
     * The command is executed with stdio set to 'pipe'.
     * @example
     * ```ts
     * const result = this.sync.string('echo " Hello World "');
     * console.log(result); // 'Hello World'
     * ```
     */
    string(cmd: CommandInput, opts?: CommandOptionsNoStdio<SyncOptions>) {
      return this.execWithStdio(cmd, 'pipe', opts).stdout.trim();
    }
  } as const;
  private _defaultErrorBehavior: ErrorBehavior = 'terminate';

  /**
   * Chains multiple commands together, piping the output of each command
   * to the input of the next, using execa.
   *
   * Each command is executed with stdio set to 'pipe' to facilitate piping.
   *
   * @example
   * ```ts
   * const result = await this.chain([
   *  'echo "Hello World"',
   *  ['grep', ['Hello']],
   *  'awk \'{print $2}\''
   * ]);
   * // Result: { stdout: 'World', ... }
   * ```
   */
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

  /**
   * Executes a command using execa with normalized input.
   *
   * @example
   * ```ts
   * const result = await this.exec('ls -la', { execaOpts: { cwd: '/some/path' } });
   * console.log(result.stdout) // lists files in /some/path in console
   * ```
   */
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

  /**
   * Executes a command with specified stdio configuration.
   *
   * @example
   * ```ts
   * const result = await this.execWithStdio('ls -la', 'inherit');
   * // Output is printed directly to the console
   * ```
   */
  protected async execWithStdio<
    S extends Options['stdio'],
    O extends CommandOptionsNoStdio = CommandOptionsNoStdio
  >(cmd: CommandInput, stdio: S, opts?: O) {
    return await this.exec<{ stdio: S }>(cmd, {
      execaOpts: { ...opts?.execaOpts, stdio },
      onExecFail: opts?.onExecFail
    });
  }

  /**
   * Hook method called after executing a command.
   * - Override to add custom post-execution logic.
   * - Default implementation is a no-op.
   */
  protected postExec() {
    return;
  }

  /**
   * Hook method called before executing a command.
   * - Override to add custom pre-execution logic.
   * - Default implementation is a no-op.
   */
  protected preExec() {
    return;
  }

  /**
   * Executes a command and returns its trimmed stdout as a string.
   * The command is executed with stdio set to 'pipe'.
   *
   * @example
   * ```ts
   * const result = await this.string('echo " Hello World "');
   * console.log(result); // 'Hello World'
   * ```
   */
  protected async string(cmd: CommandInput, opts?: CommandOptionsNoStdio) {
    return (await this.execWithStdio(cmd, 'pipe', opts)).stdout.trim();
  }
  /**
   * Wraps command execution methods to prepend a main command or executable.
   *
   * Useful for wrapping commands with tools like 'npx' or 'git'.
   *
   * @example
   * ```ts
   * const wrapWithNpx = this._wrap('npx');
   * const result = await wrapWithNpx.exec(['eslint', ['--fix', 'src/']]);
   * // Executes: npx eslint --fix src/
   *
   * const wrapWithGit = this._wrap('git');
   * const result2 = await wrapWithGit.exec('commit -m "Initial commit"');
   * // Executes: git commit -m "Initial commit"
   *
   * const wrapWithNpmSilent = this._wrap('npm --silent');
   * const result3 = await wrapWithNpmSilent.exec('install lodash');
   * // Executes: npm --silent install lodash
   * ```
   */
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
        O extends CommandOptionsNoStdio<SyncOptions> =
          CommandOptionsNoStdio<SyncOptions>
      >(
        cmd: CommandInput,
        stdio: S,
        opts?: O
      ) => {
        return this.sync.execWithStdio(normalizeInput(cmd), stdio, opts);
      },
      string: <
        O extends CommandOptionsNoStdio<SyncOptions> =
          CommandOptionsNoStdio<SyncOptions>
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
