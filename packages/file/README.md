# @toolbox-ts/file

![](https://img.shields.io/badge/coverage-100%25-brightgreen)

---

A minimal and flexible toolkit for working with the filesystem—resolve paths,
load modules, parse configs, and safely manage files with consistent, typed
results.

## Installation

```bash
npm install @toolbox-ts/file
```

## Features

- 🔍 **Find Files** by name and extension
- 📦 **Load and Resolve** modules dynamically (default, named, or factory
  exports)
- 📄 **Parse JSON** configs with optional resolver logic
- ⚙️ **Safely execute** file operations with typed result wrappers
- 🛠️ **Write File Templates** with configurable overwrite strategies (prompt,
  force, skip)
- 🧪 **100% Typed and Test-Covered**

## Usage Examples

All functions return a `ResultObj<T>` for safe, pattern friendly usage with
`result` and `error`

### 📍 Find a File

```ts
import { findFile } from "@toolbox-ts/file";

const { result, error } = findFile("./configs", {
  fileName: "app",
  extension: ["json", "js"],
});

if (result) console.log(`Found file: ${result}`);
else console.error(error);
```

### 📦 Load a Script-Based Config

```ts
import { loadModule } from "@toolbox-ts/file";

const { result, error } = await loadModule<{ title: string }>(
  "./my.config.ts",
  { exportKey: "config", resolverFn: (cfg) => (cfg?.title ? cfg : null) },
);

console.log(result); // { title: "my-app" }
```

### 🧾 Parse a JSON File

```ts
import { parseJson } from "@toolbox-ts/file";

const { result, error } = await parseJson<{ port: number }>("config", {
  fileName: "server",
  resolverFn: (cfg) => (cfg.port ? cfg : null),
});
```

### 🛠️ Write Templates

```ts
import { write, type WriteTemplate } from "@toolbox-ts/file";

// Imported - added here for clarity
interface WriteTemplate<Content extends object = object> {
  filename: string;
  generate: (cfg: Content, ...args: any[]) => string;
  relativePath?: string;
}

interface Content {
  title: string;
  tsVersion: string;
  authorName: string;
  message: string;
}
const data: Content = {
  title: "foobar",
  tsVersion: "5.8",
  authorName: "Joe",
  message: "hi",
};

await write<DynamicPageData>(
  { ...data, outputDirectory: "./dist" },
  [
    {
      filename: "readme.txt",
      generate: ({ title, tsVersion, authorName, message }) => `=== ${title} ===
      TS-VER: ${tsVersion}
      AUTHOR: ${authorName}
      
      ${message}
      `,
    },
  ],
  {
    overwrite: {
      behavior: "force", // or 'prompt', optionally with a promptFn
    },
  },
);
```

---

## License

MIT – © 2025 [Nolan Gajdascz](https://github.com/gajdascz)

- @toolbox-ts
  - [NPM](https://www.npmjs.com/org/toolbox-ts)
  - [GitHub](https://github.com/toolbox-ts/toolbox-ts)
