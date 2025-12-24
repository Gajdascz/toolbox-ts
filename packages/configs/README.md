# @toolbox-ts/configs

**Centralized configuration utilities end standardized architecture for TypeScript projects**



## Install

```sh
pnpm add -D @toolbox-ts/configs
# or
npm install --save-dev @toolbox-ts/configs
# or
yarn add --dev @toolbox-ts/configs
```

## Features

- **Runtime Config Functions**: Modules for defining runtime configurations. Every module exports a `define` function that's exported and picked up by corresponding tooling.
- **Static Config Utilities**: Modules for defining static json-based configurations. Does not generate/write, only builds in-memory configuration objects

---

## Architecture
For tooling to simply work in harmony the configurations have shared expectations about the repository structure and organization. Expectations vary _slightly_ based on the type of repository `singlePackage` or `monorepo` but constraints are kept as closely aligned as possible.

All projects regardless of type have these shared expectations (applies to both `monorepo` and `singlePackage`):
  - Three primary "Domains"
    - `dev` 
      - Covers all js/ts root configuration files and all contents of `dev` directories (`dev`, `_dev`, `.dev`)
      - Never compiled or built, only local utilities for development and management.
    - `build`
      - Covers all source code that is compiled, built, and shipped to consumers
    - `test`
      - Covers all test files (`*.test.*`, `*.bench*`, `*.spec.*`)


## ToDo
- [ ] Update Documentation
  - [ ] Outline opinionated expectations and requirements
  - [ ] Add Examples
  - [ ] Add Comments




---

## ⚖️ License

MIT – © 2025 [Nolan Gajdascz](https://github.com/gajdascz)
[GitHub](https://github.com/gajdascz/toolbox-ts) | [NPM](https://npmjs.com/package/@toolbox-ts)