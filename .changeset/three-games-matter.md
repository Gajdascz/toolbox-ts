---
'@toolbox-ts/test-utils': minor
'@toolbox-ts/cli-kit': minor
'@toolbox-ts/configs': minor
'@toolbox-ts/types': minor
'@toolbox-ts/utils': minor
'@toolbox-ts/file': minor
'@toolbox-ts/constants': minor
'@toolbox-ts/md': minor
---

major refactor and rework

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

- Preparing for `repo-kit` package integration to scaffold and manage repositories using modern
  tooling and best practices.
