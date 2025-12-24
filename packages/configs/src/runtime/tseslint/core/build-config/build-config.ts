import type { ConfigWithExtends } from '@eslint/config-helpers';

import path from 'node:path';
import { findConfigFile, sys } from 'typescript';
import { parser } from 'typescript-eslint';

import type { BaseConfig, ProcessedCfg } from '../types.js';

import { dedupeArrays, when } from '../../../../core/index.js';

export interface BuildConfigInput extends Partial<
  Omit<ConfigWithExtends, 'name'>
> {
  importResolverNodeExtensions?: readonly string[];
  languageOptions?: Omit<
    ConfigWithExtends['languageOptions'],
    'parser' | 'parserOptions' | 'sourceType'
  >;
  projectRootDir?: string;

  settings?: ConfigWithExtends['settings'];
}
export const buildConfig = <N extends string>(
  base: BaseConfig<N>,
  input: BuildConfigInput = {}
): ProcessedCfg<N> => {
  const {
    name,
    tsconfigFilename,
    importResolverNodeExtensions: baseImportResolverNodeExtensions,
    files: baseFiles = [],
    ignores: baseIgnores = [],
    rules: baseRules = {}
  } = base;
  const {
    projectRootDir = process.cwd(),
    basePath = undefined,
    extends: _extends,
    files = [],
    ignores = [],
    importResolverNodeExtensions = [],
    language,
    languageOptions,
    linterOptions,
    processor,
    rules: inputRules = {},
    settings = {}
  } = input;
  const tsconfigFilePath = findConfigFile(
    projectRootDir,
    sys.fileExists.bind(sys),
    tsconfigFilename
  );
  if (!tsconfigFilePath)
    throw new Error(`Cannot find: ${tsconfigFilename} in ${projectRootDir}`);
  const { ['import/resolver']: importResolver, ...restSettings } = settings;
  return {
    name: name,
    extends: [...(_extends ?? [])],
    files: [...baseFiles, ...files],
    ignores: [...baseIgnores, ...ignores],
    languageOptions: {
      ...languageOptions,
      parser: parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: basePath ?? path.dirname(tsconfigFilePath)
      },
      sourceType: 'module'
    },
    rules: { ...baseRules, ...inputRules },
    settings: {
      ...restSettings,
      'import/resolver': {
        ...(importResolver as object),
        node: {
          ...(importResolver as Record<string, object> | undefined)?.node,
          extensions: dedupeArrays(
            baseImportResolverNodeExtensions,
            importResolverNodeExtensions
          )
        },
        typescript: {
          ...(importResolver as Record<string, object> | undefined)?.typescript,
          project: tsconfigFilePath
        }
      }
    },
    ...when(basePath, { basePath }),
    ...when(language, { language }),
    ...when(linterOptions, { linterOptions }),
    ...when(processor, { processor })
  };
};
