import path from 'node:path';
/* c8 ignore start */
import { parser } from 'typescript-eslint';
/* c8 ignore end */

import type { BaseCfg, CfgInput, ProcessedCfg } from '../../types.js';

import { getTsconfigPath } from '../get-tsconfig-path/index.js';

export interface CreateInput<N extends string> {
  base: BaseCfg<N>;
  cfg?: CfgInput<N>;
}
/** Merge base + overrides and create a final flat config */
export const create = <N extends string>({
  base,
  cfg = {}
}: CreateInput<N>): ProcessedCfg<N> => {
  const {
    basePath = undefined,
    extends: _extends,
    files = [],
    ignores = [],
    importResolverNodeExtensions = base.importResolverNodeExtensions,
    language,
    languageOptions,
    linterOptions,
    processor,
    rules = {},
    settings,
    tsconfigFilenameOverride
  } = cfg;
  const tsconfigFilePath = getTsconfigPath(
    tsconfigFilenameOverride ?? `tsconfig.${base.name}.json`
  );
  return {
    extends: [...(_extends ?? [])],
    files: [...base.files, ...files],
    ignores: [...base.ignores, ...ignores],
    languageOptions: {
      ...languageOptions,
      parser: parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: basePath ?? path.dirname(tsconfigFilePath)
      },
      sourceType: 'module'
    },
    name: base.name,
    rules: { ...base.rules, ...rules },
    settings: {
      ...settings,
      'import/resolver': {
        node: { extensions: importResolverNodeExtensions },
        typescript: { project: tsconfigFilePath }
      }
    },
    ...(basePath && { basePath }),
    ...(language && { language }),
    ...(linterOptions && { linterOptions }),
    ...(processor && { processor })
  };
};
