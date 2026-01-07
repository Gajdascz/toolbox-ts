# @toolbox-ts

![Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

---

A monorepo for Typescript utility packages and libraries.

## Packages

| Package                                    | Version                                            | Description                            |
|--------------------------------------------|----------------------------------------------------|----------------------------------------|
| [`@toolbox-ts/configs`][configs-pkg]       | [![npm version][configs-badge]][configs-npm]       | Repository config utils                |
| [`@toolbox-ts/types`][types-pkg]           | [![npm version][types-badge]][types-npm]           | Type definitions                       |
| [`@toolbox-ts/cli-kit`][cli-kit-pkg]       | [![npm version][cli-kit-badge]][cli-kit-npm]       | CLI building utils                     |
| [`@toolbox-ts/file`][file-pkg]             | [![npm version][file-badge]][file-npm]             | Node filesystem utils                  |
| [`@toolbox-ts/test-utils`][test-utils-pkg] | [![npm version][test-utils-badge]][test-utils-npm] | Vitest utilities and environment setup |
| [`@toolbox-ts/tseslint`][tseslint-pkg]     | [![npm version][tseslint-badge]][tseslint-npm]     | TS-ESlint configuration and utilities  |
| [`@toolbox-ts/utils`][utils-pkg]           | [![npm version][utils-badge]][utils-npm]           | General developer utilities            |

---

[configs-pkg]: https://github.com/Gajdascz/toolbox-ts/tree/main/packages/configs
[configs-badge]: https://img.shields.io/npm/v/@toolbox-ts/configs?label=
[configs-npm]: https://www.npmjs.com/package/@toolbox-ts/configs

[cli-kit-pkg]: https://github.com/Gajdascz/toolbox-ts/tree/main/packages/cli-kit
[cli-kit-badge]: https://img.shields.io/npm/v/@toolbox-ts/cli-kit?label=
[cli-kit-npm]: https://www.npmjs.com/package/@toolbox-ts/cli-kit

[file-pkg]: https://github.com/Gajdascz/toolbox-ts/tree/main/packages/file
[file-badge]: https://img.shields.io/npm/v/@toolbox-ts/file?label=
[file-npm]: https://www.npmjs.com/package/@toolbox-ts/file

[test-utils-pkg]: https://github.com/Gajdascz/toolbox-ts/tree/main/packages/test-utils
[test-utils-badge]: https://img.shields.io/npm/v/@toolbox-ts/test-utils?label=
[test-utils-npm]: https://www.npmjs.com/package/@toolbox-ts/test-utils

[tseslint-pkg]: https://github.com/Gajdascz/toolbox-ts/tree/main/packages/tseslint
[tseslint-badge]: https://img.shields.io/npm/v/@toolbox-ts/tseslint?label=
[tseslint-npm]: https://www.npmjs.com/package/@toolbox-ts/tseslint

[utils-pkg]: https://github.com/Gajdascz/toolbox-ts/tree/main/packages/utils
[utils-badge]: https://img.shields.io/npm/v/@toolbox-ts/utils?label=
[utils-npm]: https://www.npmjs.com/package/@toolbox-ts/utils

[types-pkg]: https://github.com/Gajdascz/toolbox-ts/tree/main/packages/types
[types-badge]: https://img.shields.io/npm/v/@toolbox-ts/types?label=
[types-npm]: https://www.npmjs.com/package/@toolbox-ts/types


## Tooling

- [`pnpm`](https://pnpm.io): package/monorepo management.
- [`typescript`](https://www.typescriptlang.org/) primary language.
- [`node`](https://nodejs.org/en) JS runtime.

<details><summary><b>Quality & Standards</b></summary>

- [`vitest`](https://vitest.dev): Unit and Integration testing.
- [`depcruiser`](https://github.com/Gajdascz/toolbox-ts/tree/main/packages/depcruiser):
  Validates and provides visualization for project dependencies.
- [`prettier`](https://prettier.io/): Formatter.
- [`typescript-eslint`](https://typescript-eslint.io/): Linter
- [`tsdoc`](https://tsdoc.org/): Standardizes doc comments in TypeScript.
- [`commitlint`](https://commitlint.js.org/): Enforces commit convention.
- [`markdownlint`](https://github.com/DavidAnson/markdownlint): Markdown file
  linting

</details>

<details><summary><b>Automation</b></summary>

- [`changesets`](https://github.com/changesets/changesets): automates package
  versioning, changelog generation, and npm publishing.
- [`github-actions`](https://github.com/features/actions): Remotely automates
  CI/CD workflows.
- [`husky`](https://typicode.github.io/husky/): Extends git hooks automating
  standards enforcement locally.
- [`lint-staged`](https://github.com/lint-staged/lint-staged): Runs tasks
  against staged git files.

</details>

---

## 📝 To Do

- **Documentation**
  - [ ] Contributing guide
  - [ ] CI/CD diagrams
  - [ ] Consider documentation tooling like docusaurus
- **Packages**
  - [ ] Find and fix pain-points/bugs
  - [ ] Finalize apis and implementations for stable releases
  
## ⚖️ License

MIT – © 2025 [Nolan Gajdascz](https://github.com/gajdascz)
[GitHub](https://github.com/gajdascz/toolbox-ts) |
[NPM](https://npmjs.com/package/@toolbox-ts)
