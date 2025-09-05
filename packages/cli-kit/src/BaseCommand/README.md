# @toolbox-ts/cli-kit BaseCommand

`BaseCommand` is an abstract [`@oclif/core`](https://oclif.io/) `Command` subclass that standardizes how CLI commands in your project execute shell processes.

It provides:

* Safe async/sync execution wrappers around [`execa`](https://github.com/sindresorhus/execa).
* Consistent error handling (default terminate or override to throw).
* Normalization utilities for turning objects into flags/args.
* Helpers to wrap commands with a prefix (`git`, `npm --silent`, `docker exec ...`).
* Hooks for pre/post execution lifecycle.

---

## 🔑 Features

* **Unified process execution**
  * Async: `exec`, `execWithStdio`, `string`
  * Sync: `sync.exec`, `sync.execWithStdio`, `sync.string`
* **Pipelines**: `chain()` to run multiple commands in sequence with piping.
* **Input normalization**: `normalize.objArgs`, `normalize.flagArgs`.
* **Error handling**: configurable via `defaultErrorBehavior` or per-call `onExecFail`.
* **Command wrapping**: `wrap(mainCommand)` generates new helpers automatically prefixed with a tool.

---

## ⚙️ Error Handling

* Default behavior: `'terminate'` — exits using Oclif’s `this.error`.
* Per-call override: `{ onExecFail: 'throw' }` rethrows normalized errors for custom handling.
* Errors are normalized via `resolveError`.

---

## 🧩 API Overview

| Method / Property                        | Description                                                               |
| ---------------------------------------- | ------------------------------------------------------------------------- |
| `defaultErrorBehavior`                   | Getter/setter for default error mode (`'terminate'` or `'throw'`).        |
| `exec(cmd, opts?)`                       | Run a command asynchronously. Calls `preExec` / `postExec`.               |
| `execWithStdio(cmd, stdio, opts?)`       | Async execution with explicit stdio.                                      |
| `string(cmd, opts?)`                     | Async execution, returns trimmed stdout.                                  |
| `sync.exec(cmd, opts?)`                  | Synchronous command execution.                                            |
| `sync.execWithStdio(cmd, stdio, opts?)`  | Sync exec with stdio.                                                     |
| `sync.string(cmd, opts?)`                | Sync exec returning trimmed stdout.                                       |
| `chain(input[], opts?)`                  | Run multiple commands piped together.                                     |
| `wrap(mainCommand)`                      | Returns `{ exec, execWithStdio, string, sync, normalizeInput }` wrappers. |
| `normalize.objArgs / normalize.flagArgs` | Convert object inputs into CLI flags.                                     |
| `resolveError`                           | Normalize any error thrown by execa or the system.                        |
| `preExec()` / `postExec()`               | Lifecycle hooks (no-ops by default).                                      |

---

## 📖 Usage Examples

### Async execution

```ts
import { BaseCommand } from '@toolbox-ts/cli-kit';

class MyCommand extends BaseCommand {
  async run() {
    const result = await this.exec('ls -la', {
      execaOpts: { cwd: '/tmp' }
    });
    this.log(result.stdout);
  }
}
```

### Sync execution

```ts
class MySyncCommand extends BaseCommand {
  run() {
    const result = this.sync.string('echo Hello');
    this.log(result); // "Hello"
  }
}
```

### Pipeline

```ts
const result = await this.chain([
  'echo "Hello World"',
  ['grep', ['Hello']],
  "awk '{print $2}'"
]);

console.log(result.stdout); // "World"
```

### Wrapping commands

```ts
class GitCmd extends BaseCommand {
  git = this.wrap('git');

  push(branch:string) {
    this.git.exec(['push', [branch]]) // runs git push branch
  }
}
```

---

## ⚖️ License

MIT – © 2025 [Nolan Gajdascz](https://github.com/gajdascz)
[GitHub](https://github.com/gajdascz/toolbox-ts) | [NPM](https://npmjs.com/package/@toolbox-ts)