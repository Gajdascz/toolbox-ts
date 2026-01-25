import { defineConfig } from '@eslint/config-helpers';

import {
  SRC_FILE_EXTS,
  TEST_FILE_SUFFIXES,
  GLOB_ALL_DEV_FILES,
  GLOB_ALL_SRC_FILES,
  GLOB_ALL_TEST_FILES,
  REPO_DOMAIN,
  globAnyFileWithSuffixes,
  withAlwaysIgnore,
  type RepoDomain,
  TSCONFIG_BUILD_FILE,
  TSCONFIG_TEST_FILE,
  TSCONFIG_DEV_FILE
} from '../../../../../core/index.js';
import {
  type BaseConfig,
  buildConfig,
  type BuildConfigInput,
  extendRoot,
  type ExtendRootOptions
} from './core/index.ts';

const BASE_CONFIGS: { [K in RepoDomain]: BaseConfig<K> } = {
  build: {
    name: REPO_DOMAIN.build,
    files: [GLOB_ALL_SRC_FILES],
    tsconfigFilename: TSCONFIG_BUILD_FILE,
    ignores: withAlwaysIgnore([globAnyFileWithSuffixes(TEST_FILE_SUFFIXES)]),
    importResolverNodeExtensions: SRC_FILE_EXTS
  },
  dev: {
    name: REPO_DOMAIN.dev,
    files: [GLOB_ALL_DEV_FILES, `*.{${SRC_FILE_EXTS.join(',')}}`],
    tsconfigFilename: TSCONFIG_DEV_FILE,
    ignores: withAlwaysIgnore([GLOB_ALL_SRC_FILES]),
    importResolverNodeExtensions: SRC_FILE_EXTS
  },
  test: {
    name: REPO_DOMAIN.test,
    files: [GLOB_ALL_TEST_FILES],
    ignores: [],
    tsconfigFilename: TSCONFIG_TEST_FILE,
    importResolverNodeExtensions: SRC_FILE_EXTS,
    rules: {
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'off',
      '@typescript-eslint/no-unnecessary-condition': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/prefer-nullish-coalescing': 'off',
      '@typescript-eslint/prefer-promise-reject-errors': 'off',
      '@typescript-eslint/unbound-method': 'off',
      'unicorn/import-style': 'off'
    }
  }
} as const;

export type Config = { [K in RepoDomain]?: BuildConfigInput } & {
  custom?: [base: BaseConfig<string>, input?: BuildConfigInput][];
  root?: ExtendRootOptions;
};
export const define = ({ custom = [], root, build, dev, test }: Config = {}) =>
  defineConfig([
    extendRoot(root),
    buildConfig(BASE_CONFIGS.build, build),
    buildConfig(BASE_CONFIGS.dev, dev),
    buildConfig(BASE_CONFIGS.test, test),
    ...custom.map(([base, input]) => buildConfig(base, input))
  ]);
// export const tseslint = () =>
//   createConfigModule({
//     fileType: 'runtime',
//     filename: ESLINT_CONFIG_FILE,
//     importName: 'tseslint',
//     importFrom: THIS_PACKAGE,
//     name: 'typescript-eslint',
//     description: 'Powerful static analysis for JavaScript and TypeScript.',
//     url: 'https://typescript-eslint.io',
//     dependencies: [
//       { packageName: 'eslint', isDev: true },
//       { packageName: '@eslint/js', isDev: true },
//       { packageName: '@vitest/eslint-plugin', isDev: true },
//       { packageName: 'eslint-config-prettier', isDev: true },
//       { packageName: 'eslint-plugin-import', isDev: true },
//       { packageName: 'eslint-plugin-jsdoc', isDev: true },
//       { packageName: 'eslint-plugin-perfectionist', isDev: true },
//       { packageName: 'eslint-plugin-tsdoc', isDev: true },
//       { packageName: 'eslint-plugin-unicorn', isDev: true },
//       { packageName: 'typescript-eslint', isDev: true },
//       { packageName: 'eslint-import-resolver-typescript', isDev: true },
//       { packageName: '@eslint/config-inspector', isDev: true }
//     ],

//     packagePatch: {
//       scripts: { 'check:lint': `pnpm eslint . --max-warnings=0` }
//     }
//   });
