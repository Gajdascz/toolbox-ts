---
'@toolbox-ts/tseslint': patch
'@toolbox-ts/configs': patch
'@toolbox-ts/file': patch
---
- file:
  - Change file result object type for easier resolution.
  - Change parseJson to have NonNullable<object> as default parsed type.
- configs:
  - Change vitestConfig export to vitest.
- Update dependencies