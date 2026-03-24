# @toolbox-ts/cli-kit

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

## 0.1.5

### Patch Changes

- 9c5d838: - completely rework utils package from the ground up
  - updated types package
  - updated cli-kit package to use updated utils and types packages
  - updated dependencies
- Updated dependencies [9c5d838]
  - @toolbox-ts/utils@0.6.0

## 0.1.4

### Patch Changes

- 8a03bd7: remove file write templates and replace with simpler writeFiles remove depcruiser
  packages and use depcruise cli directly

## 0.1.3

### Patch Changes

- 1a1a5a1: remove file write templates and replace with simpler writeFiles remove depcruiser
  packages and use depcruise cli directly

## 0.1.2

### Patch Changes

- dd01931: - update: dependencies
  - fix: correct type imports in tseslint package
  - feat: make file writeTemplate's more flexible
    - allow generator to return unknown type and make content options optional

## 0.1.1

### Patch Changes

- d322075: fix publish config access
- Updated dependencies [d322075]
  - @toolbox-ts/utils@0.5.1

## 0.1.0

### Minor Changes

- fe99449: Intial release in reworked repository

### Patch Changes

- Updated dependencies [fe99449]
  - @toolbox-ts/utils@0.5.0
