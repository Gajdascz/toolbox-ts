# @toolbox-ts/types

## 0.3.0

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

## 0.2.0

### Minor Changes

- 9c5d838: - completely rework utils package from the ground up
  - updated types package
  - updated cli-kit package to use updated utils and types packages
  - updated dependencies

## 0.1.1

### Patch Changes

- 2f225ae: - Created a new `types` package to house commonly used and specialized TypeScript types
  for easy reuse across projects.
  - Updated repo configs to include the new `types` package.
  - Updated tseslint rules to accommodate test-d.ts files and type-exclusive test files.
  - updated dependencies
