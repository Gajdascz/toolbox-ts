# @toolbox-ts/file

Utility functions for common file operations: finding files, loading/parsing configs, and writing templates.
Designed for **config-driven tools** where you need to locate files, load structured content, and persist artifacts safely.

```sh
pnpm add @toolbox-ts/utils
# or
npm install @toolbox-ts/utils
# or
yarn add @toolbox-ts/utils
```

---

## Features

* **Find** files with `fast-glob` (search all, first up, or first down).
* **Load modules** (`.ts`/`.js`) with [jiti](https://github.com/unjs/jiti), supporting default/named/function exports.
* **Parse JSON** configs with optional custom resolvers.
* **Write files** with overwrite policies (`force`, `prompt`, `skip`).
* **Write templates** into directories with safe overwrite handling.

---

## API

### 🔍 Find files (`find/`)

Search for files using glob patterns. Ignores `node_modules/` and `dist/` by default.

```ts
import { all, firstUp, firstDown, sync } from '@toolbox-ts/file/find';

// Find all matching files in cwd
const files = await all('*.ts');

// Find nearest tsconfig.json by traversing upwards
const tsconfig = await firstUp('tsconfig.json');

// Find first match by searching downward breadth-first
const pkg = await firstDown('package.json');

// Sync variants also available
const filesSync = sync.all('*.js');
```

---

### 📦 Load modules (`load-module/`)

Load `.ts`/`.js` configs with flexible export resolution.

```ts
import { loadModule } from '@toolbox-ts/file/load-module';

const { result, error } = await loadModule<MyConfig>('depcruiser.config.ts', {
  exportKey: 'default', // default | named key
  resolverFn: (cfg) => cfg ?? null, // optional transform/validation
});

if (error) console.error(error);
else console.log(result);
```

Supported module shapes:

* Default export
* Named export
* Entire object export
* Function that returns config (sync or async)

---

### 📄 Parse JSON (`parse-json/`)

```ts
import { parseJson } from '@toolbox-ts/file/parse-json';

const { result, error } = await parseJson<MyConfig>('config.json', {
  resolverFn: (cfg) => validate(cfg)
});
```

---

### ✏️ Write files (`write/`)

#### Normalize arbitrary data to string

```ts
import { normalizeData } from '@toolbox-ts/file/write';

normalizeData({ a: 1 }); // -> JSON string
normalizeData(Buffer.from('hello')); // -> "hello"
```

#### Write single file

```ts
import { file } from '@toolbox-ts/file/write';

await file('out/config.json', { foo: 'bar' }, {
  overwrite: { behavior: 'force' }
});
```

#### Write templates

```ts
import { templates } from '@toolbox-ts/file/write';

await templates('out', { name: 'pkg' }, [
  {
    filename: 'package.json',
    generate: (cfg) => JSON.stringify({ name: cfg.name }, null, 2)
  }
], {
  overwrite: { behavior: 'skip' }
});
```

Overwrite behaviors:

* `force` – always overwrite
* `prompt` – ask before overwrite (requires `promptFn`)
* `skip` – never overwrite

---

## Types

* `ResultObj<T>` – standard `{ result: T | null; error?: string }` wrapper.
* `OverwriteBehavior` – `'force' | 'prompt' | 'skip'`.
* `WriteTemplate` – template definition `{ filename, generate, outDir?, relativePath? }`.

---

## Notes

* `find` uses [`fast-glob`](https://github.com/mrmlnc/fast-glob).
* `load-module` uses [`jiti`](https://github.com/unjs/jiti) for seamless TS/JS imports.
* Overwrite behavior is explicit to avoid accidental data loss.

---

## ⚖️ License

MIT – © 2025 [Nolan Gajdascz](https://github.com/gajdascz)
[GitHub](https://github.com/gajdascz/toolbox-ts) | [NPM](https://npmjs.com/package/@toolbox-ts)