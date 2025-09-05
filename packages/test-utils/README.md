# @toolbox-ts/dev-kit test-utils

The `test-utils` module provides utilities for mocking, isolating, and resetting dependencies in your test environment.  
It is designed for use with [Vitest](https://vitest.dev/) and supports deep mocking of Node.js modules like `fs`, `fs/promises`, and `child_process`, as well as the global `console`.

## Features

- **Automatic environment mocking:**  
  The `setup.ts` file ensures that all destructive modules are mocked before tests run, preventing accidental changes to your real filesystem or processes.
- **Memfs-powered file system mocks:**  
  The `fs.ts` module uses [memfs](https://github.com/streamich/memfs) for an in-memory file system, with reset and inspection utilities.
- **Mocked child process and console:**  
  All methods of `child_process` and `console` are replaced with Vitest mock functions for safe, observable testing.
- **Optional Packages:** Automatically checks and mocks for `execa` and `@inquirer/prompts`.
- **Token-based mock detection:**  
  Utilities in `core.ts` use unique symbols to reliably identify and verify mocked modules.
- **Recursive reset:**  
  All mocks can be reset between tests to ensure isolation and repeatability.
- **Environment assertion:**  
  `assertMockedEnv` checks that all required mocks are present before tests run, failing fast if the environment is not safe.

## Setup

- **Recommended: Point setupFiles to the setup-tests module**

```ts
import { vitestConfig } from '@toolbox-ts/configs'
export default vitestConfig.define({
  coverage: { reportsDirectory: './docs/reports/coverage' },
  dir: import.meta.dirname,
  setupFiles: ['@toolbox-ts/dev-kit/setup-tests'],
  tsconfigFilename: 'tsconfig.test.json'
});
```

OR

- **Import the setup in your test entrypoint or Vitest config:**

```typescript
import '@toolbox-ts/dev-kit/setup-tests';
```

## Why use this?

- **Safety:** Prevents accidental writes or process spawning during tests.
- **Isolation:** Ensures each test runs in a clean, predictable environment.
- **Convenience:** Deep reset and inspection utilities for all mocks.
- **Type safety:** All mocks are typed for use in TypeScript projects.

---

**Recommended:**  
Import the setup file in your test entrypoint to guarantee a safe environment for all tests in your project.

## Troubleshooting

- "[TEST ENV ERROR]: `X` is not mocked. Refusing to run tests."
  - Ensure your vitest config's setupFiles points to the the package setup export

```ts
import { vitestConfig } from '@toolbox-ts/configs';

const root = import.meta.dirname;

export default vitestConfig.define({
  root,
  coverage: { reportsDirectory: `${root}/docs/reports/vitest-ui` },
  dir: import.meta.dirname,
  setupFiles: ['@toolbox-ts/test-utils/setup'],
  tsconfigFilename: 'tsconfig.test.json'
});
```

- Ensure you're not overwriting the wrapped export details by mocking the module.
  - If possible it's advised to avoid mocking the `fs` module entirely and to work with memfs as it is.

```ts

import child_process from 'child_process';
vi.mock('child_process') // ❌ This will refuse to run tests because the exported mocked module settings are overwritten and cannot be detected

vi.mock('child_process', async (actual)=>([
  ...actual,
  ...(your mocks)
])) // ✅ This should work as long as you do not override the Symbol tokens managed by test-utils
```

- Do not import the mocked modules in your tests directly. They're already setup and ready for you to use.

```ts
// some.test.ts

import { fs } from '@toolbox-ts/test-utils' // ❌ This will 'feel' like it should be working but it won't. You need to use the same module import as your source code.
import fs from 'node:fs' // ✅ Just make sure your source also imports from `node:fs`
```

- If you're manipulating the process.cwd return, you must match the pattern in your memory fs (and vice-versa).

```ts

import fs from 'node:fs';

describe('test suite', () => {
  beforeEach(() => {
    vi.spyOn(process, 'cwd').mockReturnValue('/root');
    fs.mkdirSync('/root', { recursive: true });
  });
})

```

## ⚖️ License

MIT – © 2025 [Nolan Gajdascz](https://github.com/gajdascz)
[GitHub](https://github.com/gajdascz/toolbox-ts) | [NPM](https://npmjs.com/package/@toolbox-ts)