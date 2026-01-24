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

## TODO: generate full docs using TypeDoc

---

## Features

* **Find** files with `fast-glob` (search all, first up, or first down).
* **Load modules** (`.ts`/`.js`) with [jiti](https://github.com/unjs/jiti), supporting default/named/function exports.
* **Parse JSON** configs with optional custom resolvers.
* **Write files** with overwrite policies (`force`, `prompt`, `skip`).
* **Write templates** into directories with safe overwrite handling.

---

## Notes

* `find` uses [`fast-glob`](https://github.com/mrmlnc/fast-glob).
* `load-module` uses [`jiti`](https://github.com/unjs/jiti) for seamless TS/JS imports.
* Overwrite behavior is explicit to avoid accidental data loss.

---

## ⚖️ License

MIT – © 2025 [Nolan Gajdascz](https://github.com/gajdascz)
[GitHub](https://github.com/gajdascz/toolbox-ts) | [NPM](https://npmjs.com/package/@toolbox-ts)
