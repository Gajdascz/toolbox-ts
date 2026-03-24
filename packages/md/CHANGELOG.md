# @toolbox-ts/md

## 0.1.0

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
