# @toolbox-ts/cli-kit Utils

`Utils` provide low-level helpers for working with shell processes, flags, and command input.

---

## 🔑 Features

* **Process helpers**

  * Async: `spawn`, `chain`
  * Sync: `spawnSync`
  * Consistent error normalization via `resolveError`.

* **Flag utilities**

  * `kebabToFlagEntry`, `toFlag` for string transformations.
  * `flagMeta` for generating Oclif-friendly flag definitions.
  * `flagArgs` + `objToFlags` for structured → CLI flag conversion.

* **Command input normalization**

  * `commandInput` and `getCommandInputWrapper` handle multiple input formats.
  * Prepend/wrap executables (`git`, `npx`, `docker exec`, etc.).

* **General helpers**

  * `strOrNum`, `when`, `nestWhen` for safer type coercion and conditional object building.

---

## 🧩 API Overview

### Process

| Method                     | Description                                                        |
| -------------------------- | ------------------------------------------------------------------ |
| `resolveError(err)`        | Normalize `ExecaError`, `ExecaSyncError`, or unknown into `Error`. |
| `spawn(cmd, opts?)`        | Run a command asynchronously via `execa`.                          |
| `spawnSync(cmd, opts?)`    | Run a command synchronously via `execaSync`.                       |
| `chain(commands[], opts?)` | Pipe multiple commands together (async).                           |

---

### Flags

| Method / Type                       | Description                                                            |
| ----------------------------------- | ---------------------------------------------------------------------- |
| `kebabToFlagEntry(key)`             | Returns `[camelCase, '--kebab-case']`.                                 |
| `toFlag(key)`                       | Converts camelCase → `--kebab-case`.                                   |
| `flagMeta(name, desc, opts?)`       | Generates metadata (`description`, `aliases`, `helpLabel`).            |
| `FlagMetaOpts`                      | Options: `acceptsCommaSeparated`, `char`, `helpGroup`, `otherAliases`. |
| `flagArgs(obj, spec)`               | Normalizes object input values (arrays, nullables, booleans).          |
| `objToFlags(obj, defaults?, spec?)` | Converts object → CLI flag array.                                      |

---

### Command Input

| Method                        | Description                                                         |
| ----------------------------- | ------------------------------------------------------------------- |
| `commandInput(cmd)`           | Normalize string/tuple/array input into `[executable, args[]]`.     |
| `getCommandInputWrapper(cmd)` | Returns a function that prepends a command (e.g., wrap with `git`). |

---

### General

| Method                       | Description                                              |
| ---------------------------- | -------------------------------------------------------- |
| `strOrNum(input)`            | Converts numeric strings → number, leaves others intact. |
| `when(cond, value)`          | Returns value (or function result) if condition truthy.  |
| `nestWhen(key, cond, value)` | Like `when`, but nests under an object key.              |

---

## 📖 Usage Examples

### Command Utils

```ts
import { spawn, chain, resolveError } from '@toolbox-ts/cli-kit/utils';

try {
  const result = await spawn('ls -la', { cwd: '/tmp' });
  console.log(result.stdout);
} catch (err) {
  throw resolveError(err);
}

// Pipeline
const out = await chain([
  'echo "Hello World"',
  'grep Hello',
  ['awk', ['{print $2}']]
]);

console.log(out.stdout); // "World"
```

---

### Flag Utils

```ts
import { toFlag, flagMeta, objToFlags, flagArgs } from '@toolbox-ts/cli-kit/utils';

// Simple flag conversion
console.log(toFlag('someFlag')); // '--some-flag'

// Generate Oclif metadata
const verboseFlag = flagMeta('verbose', 'print verbose output', {
  char: 'v'
});
// { name: 'verbose', description: 'Print verbose output.', aliases: [], char:'v', helpLabel:'--verbose' }

// Object → CLI flags
const spec = { tags: { arrayFormat: 'repeat', sep: 'space' } };
const args = objToFlags({ verbose: true, timeout: 30, tags: ['a','b'] }, {}, spec);
// ["--verbose", "--timeout", "30", "--tags", "a", "--tags", "b"]

// Normalize raw flag input
const normalized = flagArgs({ random: '', exclude: 'a,b' }, { exclude: { arrayFormat: 'repeat' } });
// { random: [], exclude: ['a','b'] }
```

---

### Normalization Utils

```ts
import { getCommandInputWrapper } from '@toolbox-ts/cli-kit/utils';

const git = getCommandInputWrapper('git');

const commitCmd = git('commit -m "Initial commit"');
// ['git', ['commit', '-m', 'Initial commit']]
```

---

### Conditional helpers

```ts
import { strOrNum, when, nestWhen } from '@toolbox-ts/cli-kit/utils';

const value = strOrNum('42'); // 42
const flags = {
  verbose: when(true, true),           // { verbose: true }
  ...nestWhen('port', '3000', strOrNum) // { port: 3000 }
};
```

---

## ⚖️ License

MIT – © 2025 [Nolan Gajdascz](https://github.com/gajdascz)
[GitHub](https://github.com/gajdascz/toolbox-ts) | [NPM](https://npmjs.com/package/@toolbox-ts)