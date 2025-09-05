# @toolbox-ts/tseslint

![Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
A comprehensive TypeScript ESLint configuration package that provides
opinionated, production-ready ESLint configurations for TypeScript projects with
standardized built-in support for different environments (build, development,
and test). Supports both single-package and monorepo project structures.

## Features

- 🎯 **Environment-specific configurations** (build, dev, test)
- 📦 **Built-in TypeScript support** with automatic tsconfig detection
- 🔧 **Highly customizable** with override capabilities
- 🌟 **Modern ESLint flat config** format
- 🔍 **Import resolution** with TypeScript and Node.js support
- 📝 **Documentation linting** with JSDoc and TSDoc
- ⚡ **Performance optimized** with project service integration

## 📦 Installation

```bash
npm install --save-dev @toolbox-ts/tseslint
# or
pnpm add -D @toolbox-ts/tseslint
# or
yarn add --dev @toolbox-ts/tseslint
```

The following peerDependencies are required:

- `eslint`
- `@eslint/js`
- `eslint-config-prettier`
- `eslint-import-resolver-typescript`
- `eslint-plugin-import`
- `eslint-plugin-jsdoc`
- `eslint-plugin-tsdoc`
- `typescript`
- `typescript-eslint`
- `eslint-plugin-perfectionist`
- `eslint-plugin-unicorn`
- `@vitest/eslint-plugin`
- \*\*`jiti` — only required if your eslint config is in TypeScript.

### Installation by Package Manager

**pnpm:** Choose one of the following methods:

- Execute `pnpm config set auto-install-peers true` to automatically install
  peer dependencies
- Add `auto-install-peers=true` in your project's root `.npmrc` file
- Manual installation:

```bash
pnpm i -D - eslint @eslint/js eslint-config-prettier eslint-import-resolver-typescript eslint-plugin-import eslint-plugin-jsdoc eslint-plugin-tsdoc typescript typescript-eslint eslint-plugin-perfectionist eslint-plugin-unicorn @vitest/eslint-plugin
# Add jiti if using eslint.config.ts
pnpm i -D jiti
```

**npm:** Peer dependencies are automatically installed since v7.

**yarn:** Peer dependencies must be installed manually:

```bash
yarn add --dev eslint @eslint/js eslint-config-prettier eslint-import-resolver-typescript eslint-plugin-import eslint-plugin-jsdoc eslint-plugin-tsdoc typescript typescript-eslint eslint-plugin-perfectionist eslint-plugin-unicorn @vitest/eslint-plugin
# Add jiti if using eslint.config.ts
yarn add --dev jiti
```

---

## 🚀 Quick Start

- Ensure you have at minimum the following tsconfigs:
  `tsconfig.build.json`,`tsconfig.dev.json`,`tsconfig.test.json`
- Create an `eslint.config.{js|ts}` file in your project root:

```javascript
import { defineConfig } from '@toolbox-ts/tseslint';

export default defineConfig();
```

That's it! This will automatically configure ESLint for your TypeScript project
with three environments:

- **Build**: Production source code (`src/**/*.{ts,tsx,js,jsx}`)
- **Dev**: Development tools and config files (`dev/**/*`, `tools/**/*`,
  `*.{ts,js}`)
- **Test**: Test files (`**/*.{test,spec,bench}.{ts,tsx,js,jsx}`)

## 🔨 Configuration

### Default Configurations

The package provides three pre-configured environments:

| name  | tsconfig             | includes                                                             | excludes           | description                                    |
| ----- | -------------------- | -------------------------------------------------------------------- | ------------------ | ---------------------------------------------- |
| build | `tsconfig.build.json | [`src`, `packages`, `apps`, `bin`] directories                       | test files         | Production source code with strict linting     |
| dev   | `tsconfig.dev.json   | [`dev`, `_dev`, `tools`, `_tools`] directories and root config files | test files         | Development tools and root configuration files |
| test  | `tsconfig.test.json  | [ `*.{test,spec,bench}.*`]                                           | all non-test files | Relaxed rules for testing                      |

### Custom Configuration

#### Overriding Default Configurations

```javascript
import { defineConfig } from '@toolbox-ts/tseslint';

export default defineConfig({
  defaults: {
    // Disable build configuration
    build: false,

    // Customize dev configuration
    dev: { files: ['custom-dev/**/*.ts'], rules: { 'no-console': 'warn' } },

    // Customize test configuration
    test: {
      ignores: ['**/*.integration.test.ts'],
      rules: { '@typescript-eslint/no-explicit-any': 'error' }
    }
  }
});
```

#### Adding Custom Configurations

```javascript
import { defineConfig } from '@toolbox-ts/tseslint';

export default defineConfig({
  custom: {
    integration: {
      base: {
        name: 'integration',
        files: ['tests/integration/**/*.ts'],
        ignores: [],
        importResolverNodeExtensions: ['ts', 'js'],
        rules: { '@typescript-eslint/no-floating-promises': 'error' }
      },
      cfg: { files: ['additional/files/**/*.ts'] }
    }
  }
});
```

### Advanced Usage

#### Manual Configuration with Create Function

For advanced use cases, you can use the lower-level `create` function:

```javascript
import { create, configs } from '@toolbox-ts/tseslint';

const customConfig = create({
  base: configs.build,
  cfg: { files: ['custom/**/*.ts'], rules: { 'prefer-const': 'error' } }
});
```

#### Custom Base Configuration

You can also create your own base level configs at the lowest level using
`createBaseConfig`

```javascript
import { createBaseConfig } from '@toolbox-ts/tseslint';

const customBase = createBaseConfig('api', {
  files: ['api/**/*.ts'],
  rules: { '@typescript-eslint/explicit-function-return-type': 'error' }
});
```

## 🔎 TypeScript Configuration Detection

The package automatically detects TypeScript configuration files using the
pattern:

- tsconfig.json (for empty config names)
- `tsconfig.{configName}.json` | override if provided (for named configurations)

The `getTsconfigPath` utility searches for these files starting from the current
working directory and traversing up the directory tree.

## ⚙️ Built-in Rules and Plugins

For rule overrides see the
[rules definition file](./src/base/configs/root/rules.ts)

### Included Plugins

- **@typescript-eslint**: Comprehensive TypeScript linting
- **eslint-plugin-import**: Import/export validation and optimization
- **eslint-plugin-unicorn**: Modern JavaScript/TypeScript best practices
- **eslint-plugin-perfectionist**: Code organization and sorting
- **eslint-plugin-jsdoc**: JSDoc validation
- **eslint-plugin-tsdoc**: TSDoc validation
- **@vitest/eslint-plugin**: Vitest testing framework support
- **eslint-config-prettier**: Prettier integration

## 📖 API Reference

### `defineConfig(options?)`

Main configuration function that creates a complete ESLint flat config.

**Parameters:**

- `options.defaults`: Control default configurations (boolean or per-config
  overrides)
- `options.custom`: Add custom configurations

**Returns:** ESLint flat config array

### `create(input)`

Lower-level function to create individual configurations.

**Parameters:**

- `input.base`: Base configuration object
- `input.cfg`: Optional configuration overrides

### `getTsconfigPath(filename, start?)`

Utility to locate TypeScript configuration files.

**Parameters:**

- `filename`: TSConfig filename to search for
- `start`: Starting directory (defaults to `process.cwd()`)

**Returns:** Absolute path to the configuration file

### `createBaseConfig(name, config)`

Utility primarily for internal use, to create base configurations.

**Parameters:**

- `name`: Name of the configuration
- `config`: The base configuration shape

**Returns:** Resolved `BaseCfg`

### Configuration Types

The package exports comprehensive TypeScript types for all configuration
options:

- `BaseCfg<N>`: Base configuration interface
- `CfgInput<N>`: Configuration override interface
- `ProcessedCfg<N>`: Final processed configuration
- `DefineConfigInput`: Main configuration input interface

## 🤝 Contributing

This package is part of the @toolbox-ts monorepo. See the main repository for
contribution guidelines.

## ⚖️ License

MIT – © 2025 [Nolan Gajdascz](https://github.com/gajdascz)
[GitHub](https://github.com/gajdascz/toolbox-ts) | [NPM](https://npmjs.com/package/@toolbox-ts)