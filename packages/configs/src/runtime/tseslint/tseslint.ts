import { defineConfig } from '@eslint/config-helpers';

import {
  ALWAYS_IGNORE,
  createRuntimeConfigModule,
  GLOBS,
  type RepoDomain,
  SRC_FILE_EXTS,
  THIS_PACKAGE,
  TsConfigs
} from '../../core/index.js';
import {
  type BaseConfig,
  buildConfig,
  type BuildConfigInput,
  extendRoot,
  type ExtendRootOptions
} from './core/index.js';

const BASE_CONFIGS: { [K in RepoDomain]: BaseConfig<K> } = {
  build: {
    name: 'build',
    files: [GLOBS.allSrcFiles],
    ignores: [...ALWAYS_IGNORE, GLOBS.allTestFiles],
    tsconfigFilename: TsConfigs.FILENAMES.build,
    importResolverNodeExtensions: SRC_FILE_EXTS
  },
  dev: {
    name: 'dev',
    files: [GLOBS.allDevFiles, `*.${GLOBS.srcFileExts}`],
    ignores: [...ALWAYS_IGNORE, GLOBS.allSrcFiles],
    tsconfigFilename: TsConfigs.FILENAMES.dev,
    importResolverNodeExtensions: SRC_FILE_EXTS
  },
  test: {
    name: 'test',
    files: [GLOBS.allTestFiles],
    ignores: [],
    tsconfigFilename: TsConfigs.FILENAMES.test,
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

export const { define, getTemplateString, meta } = createRuntimeConfigModule({
  filename: 'eslint.config.ts',
  importName: 'tseslint',
  importFrom: THIS_PACKAGE,
  dependencies: [
    'eslint',
    '@eslint/js',
    '@vitest/eslint-plugin',
    'eslint-config-prettier',
    'eslint-plugin-import',
    'eslint-plugin-jsdoc',
    'eslint-plugin-perfectionist',
    'eslint-plugin-tsdoc',
    'eslint-plugin-unicorn',
    'typescript-eslint',
    'eslint-import-resolver-typescript',
    { packageName: '@eslint/config-inspector', optional: true }
  ],
  define: ({ custom = [], root, build, dev, test }: Config = {}) =>
    defineConfig([
      extendRoot(root),
      buildConfig(BASE_CONFIGS.build, build),
      buildConfig(BASE_CONFIGS.dev, dev),
      buildConfig(BASE_CONFIGS.test, test),
      ...custom.map(([base, input]) => buildConfig(base, input))
    ])
});
