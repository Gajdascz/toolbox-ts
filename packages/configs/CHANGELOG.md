# @toolbox-ts/configs

## 0.2.0

### Minor Changes

- 0710279: major refactor and rework
  - `md` package added
    - Provides utilities for creating and generating markdown content. Primarily focused on GitHub
      Flavored Markdown (GFM).
  - `constants` package added
    - Central location providing a single-source-of-truth for shared constants.
  - `file` package refactored and reworked
    - Added shortcut unwrap functions to bypass ok/err results
    - Renamed ok/err functions to try<FnName>
  - `utils` package refactored and reworked
  - `cli-kit` package updated to use refactored libs
  - `test-utils` package updated to use refactored libs
  - `configs` refactored and reworked
    - Include static config file define functions
    - Added toFileEntry functions to provide file-ready configs
  - `types` major additions and re-organization
  - update root readme
  - update ci workflow
  - Preparing for `repo-kit` package integration to scaffold and manage repositories using modern
    tooling and best practices.

### Patch Changes

- Updated dependencies [0710279]
  - @toolbox-ts/types@0.3.0
  - @toolbox-ts/utils@0.7.0
  - @toolbox-ts/constants@0.1.0

## 0.1.6

### Patch Changes

- 9c5d838: - completely rework utils package from the ground up
  - updated types package
  - updated cli-kit package to use updated utils and types packages
  - updated dependencies

## 0.1.5

### Patch Changes

- 8a03bd7: remove file write templates and replace with simpler writeFiles remove depcruiser
  packages and use depcruise cli directly

## 0.1.4

### Patch Changes

- 1a1a5a1: remove file write templates and replace with simpler writeFiles remove depcruiser
  packages and use depcruise cli directly

## 0.1.3

### Patch Changes

- 8ffdc22: - file:
  - Change file result object type for easier resolution.
  - Change parseJson to have NonNullable<object> as default parsed type.
  - configs:
    - Change vitestConfig export to vitest.
  - Update dependencies

## 0.1.2

### Patch Changes

- d08c810: add title case to string utils

## 0.1.1

### Patch Changes

- d322075: fix publish config access

## 0.1.0

### Minor Changes

- fe99449: Intial release in reworked repository
