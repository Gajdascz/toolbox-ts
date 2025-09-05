# @toolbox-ts/cli-kit

![Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

## 📦 Installation

```bash
npm install @toolbox-ts/cli-kit
# or
pnpm add @toolbox-ts/cli-kit
# or
yarn add @toolbox-ts/cli-kit
```

## [BaseCommand](https://github.com/Gajdascz/toolbox-ts/tree/main/packages/cli-kit/src/BaseCommand/README.md)

`BaseCommand` is an abstract [`@oclif/core`](https://oclif.io/) `Command` subclass that standardizes CLI command execution using [`execa`](https://www.npmjs.com/package/execa/v/5.1.0).

```ts
import { BaseCommand } from '@toolbox-ts/cli-kit';

export default class CustomCmd extends BaseCommand {
  ...(your command logic)
}
```

## [Reporters](https://github.com/Gajdascz/toolbox-ts/tree/main/packages/cli-kit/src/reporters/README.md)

`Reporters` provide a consistent way to format domain-specific data for CLI and CI/CD output.

```ts
import { reporters } from '@toolbox-ts/cli-kit';


export class Reporter<T = Message> implements reporters.Reporter<T[]> {
  ...(method implementations)
}
```

## [Utils](https://github.com/Gajdascz/toolbox-ts/tree/main/packages/cli-kit/src/utils/README.md)

`Utils` provide low-level helpers for working with shell processes, flags, and command input. They power higher-level abstractions like `BaseCommand` and `Reporters`.

## ⚖️ License

MIT – © 2025 [Nolan Gajdascz](https://github.com/gajdascz)
[GitHub](https://github.com/gajdascz/toolbox-ts) | [NPM](https://npmjs.com/package/@toolbox-ts)