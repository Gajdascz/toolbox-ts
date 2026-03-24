# @toolbox-ts/utils

## 0.7.0

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

## 0.6.0

### Minor Changes

- 9c5d838: - completely rework utils package from the ground up
  - updated types package
  - updated cli-kit package to use updated utils and types packages
  - updated dependencies

## 0.5.7

### Patch Changes

- 197ad54: update utils/str module
  - add snake_case utilities
  - complete case conversion types

## 0.5.6

### Patch Changes

- df57e97: refactor types and exports

## 0.5.5

### Patch Changes

- 5e860fb: allow readonly key arrays in object pick and omit methods

## 0.5.4

### Patch Changes

- d08c810: add title case to string utils

## 0.5.3

### Patch Changes

- 2d66cab: export helper functions

## 0.5.2

### Patch Changes

- 8f274b7: add conditional utility helper functions

## 0.5.1

### Patch Changes

- d322075: fix publish config access

## 0.5.0

### Minor Changes

- fe99449: Intial release in reworked repository
