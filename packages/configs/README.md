# @toolbox-ts/configs

**Centralized configuration utilities for TypeScript monorepos.**  
This package provides reusable config factories for tools like Prettier, Vitest, and Commitlint, enabling consistent standards and easy sharing across projects.

## Install

```sh
pnpm add -D @toolbox-ts/configs
# or
npm install --save-dev @toolbox-ts/configs
# or
yarn add --dev @toolbox-ts/configs
```

## Features

- **Prettier config**: Opinionated formatting, easy to extend and override.
- **Vitest config**: Sensible defaults for coverage, caching, and type-checking.
- **Commitlint config**: Conventional commit enforcement with customizable scopes and rules.
- **Type-safe config factories**: All configs are provided as `define()` functions with type hints.

---

## Prettier

```typescript
// prettier.config.js
import { prettier } from '@toolbox-ts/configs';

export default prettier.define({
  printWidth: 100,
  semi: false,
  // ...override any defaults
});
```

### Vitest

```typescript
// vitest.config.ts
import { vitest } from '@toolbox-ts/configs';

export default vitestConfig.define({
  test: {
    coverage: { enabled: true, reporter: ['text', 'lcov'] },
    include: ['src/**/*.test.ts']
  }
});
```

### Commitlint

```typescript
// commitlint.config.ts
import { commitlint } from '@toolbox-ts/configs';

export default commitlint.define({
  scopes: ['ui', 'core', 'repo'],
  rules: {
    'header-max-length': [2, 'always', 72]
  }
});
```

---

## ⚖️ License

MIT – © 2025 [Nolan Gajdascz](https://github.com/gajdascz)
[GitHub](https://github.com/gajdascz/toolbox-ts) | [NPM](https://npmjs.com/package/@toolbox-ts)