# @toolbox-ts

![Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

---

A monorepo for Typescript utility packages.

## Packages

| Package                              | Version                                      | Description                    |
| ------------------------------------ | -------------------------------------------- | ------------------------------ |
| [`@toolbox-ts/configs`][configs-pkg] | [![npm version][configs-badge]][configs-npm] | Repository Configurations |

---

[configs-pkg]: (./packages/configs)
[configs-badge]: https://img.shields.io/npm/v/@toolbox-ts/configs?label=
[configs-npm]: https://www.npmjs.com/package/@toolbox-ts/configs

## Development

## Tooling

- [`pnpm`](https://pnpm.io): package/monorepo management.
- [`typescript`](https://www.typescriptlang.org/) primary language.
- [`node`](https://nodejs.org/en) JS runtime.

<details><summary><b>Quality & Standards</b></summary>

- [`vitest`](https://vitest.dev): Unit and Integration testing.
- [`dependency-cruiser`](https://github.com/sverweij/dependency-cruiser):
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

## License

MIT – © 2025 [Nolan Gajdascz](https://github.com/gajdascz)

- @toolbox-ts
  - [NPM](https://www.npmjs.com/org/toolbox-ts)
  - [GitHub](https://github.com/gajdascz/toolbox-ts)
