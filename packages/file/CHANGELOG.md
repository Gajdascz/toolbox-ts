# @toolbox-ts/file

## 0.4.4

### Patch Changes

- 1a1a5a1: remove file write templates and replace with simpler writeFiles
  remove depcruiser packages and use depcruise cli directly

## 0.4.3

### Patch Changes

- 571e7e2: change write templates to take per template config instead of a
  single shared config for every template

## 0.4.2

### Patch Changes

- 8ffdc22: - file:
  - Change file result object type for easier resolution.
  - Change parseJson to have NonNullable<object> as default parsed type.
  - configs:
    - Change vitestConfig export to vitest.
  - Update dependencies

## 0.4.1

### Patch Changes

- dd01931: - update: dependencies
  - fix: correct type imports in tseslint package
  - feat: make file writeTemplate's more flexible
    - allow generator to return unknown type and make content options optional

## 0.4.0

### Minor Changes

- 38d5283: - file: update and refactor
  - depcruiser: patch changes from file in depcruiser

## 0.3.0

### Minor Changes

- 5b81cce: - **file package:**
  - Change export to provide default and named.
  - \+ dedicated traversal methods
  - \+ sync parse-json
  - \+ multiple find methods
  - \+ helpers
  - \+ repo methods
  - \+ documented with comments
  - **depcruiser:**
    - update file package imports

## 0.2.1

### Patch Changes

- d322075: fix publish config access

## 0.2.0

### Minor Changes

- fe99449: Intial release in reworked repository
