import type {
  RequiredProps,
  TsConfigWithMeta,
  TsConfigWithMetaInput
} from '@toolbox-ts/types';

import {
  ALL_SRC_DIRS,
  ALWAYS_IGNORE,
  DEV_DIRS,
  FILE_PATTERNS,
  matchAllExtsInCurrDir,
  matchAllInDirs,
  SRC_FILE_EXTS
} from '../../base.js';
import {
  ALL_TEST_FILES,
  DEV_META,
  type DevMeta,
  ROOT_TO_BASE_TSCONFIG_PATH,
  type RootToBaseTsConfigPath
} from '../shared.js';

export type Config = RequiredProps<
  TsConfigWithMeta<DevMeta['name'], StaticCompilerOptions>,
  'compilerOptions' | 'exclude' | 'extends' | 'include'
>
  & StaticFields;

export type InputConfig = TsConfigWithMetaInput<
  DevMeta['name'],
  StaticFields,
  StaticCompilerOptions
>;

export interface StaticCompilerOptions {
  allowImportingTsExtensions: true;
  allowJs: true;
  noEmit: true;
  rootDir: '.';
}
export const STATIC_COMPILER_OPTIONS: StaticCompilerOptions = {
  rootDir: '.',
  noEmit: true,
  allowImportingTsExtensions: true,
  allowJs: true
} as const;

export interface StaticFields extends DevMeta {
  extends: RootToBaseTsConfigPath;
}
export const STATIC_FIELDS: StaticFields = {
  ...DEV_META,
  extends: ROOT_TO_BASE_TSCONFIG_PATH
} as const;
export const INCLUDE: Config['include'] = [
  ...DEV_DIRS,
  ...matchAllExtsInCurrDir(SRC_FILE_EXTS),
  `./${FILE_PATTERNS.config}`
] as const;
export const EXCLUDE: Config['exclude'] = [
  ...ALWAYS_IGNORE,
  ...ALL_TEST_FILES,
  ...matchAllInDirs(ALL_SRC_DIRS)
];
export const META = { ...DEV_META } as const;
