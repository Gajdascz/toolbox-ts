import type {
  TsConfigMeta,
  TsConfigWithMeta,
  TsConfigWithMetaInput,
  RequiredProps
} from '@toolbox-ts/types';
import {
  type TsConfigBaseFile,
  ALL_TEST_FILES,
  ALWAYS_IGNORE,
  ANY_ROOT_SRC_DIR,
  CONFIG_FILE_PATTERN,
  DEV_DIR,
  matchAllExtsInCurrDir,
  matchAllInDirs,
  SRC_FILE_EXTS,
  TSCONFIG_BASE_FILE,
  TSCONFIG_DOMAIN,
  TSCONFIG_SCHEMA,
  dedupeArrays
} from '../../../../../../../core/index.js';

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

export const STATIC_COMPILER_OPTIONS = {
  rootDir: '.',
  noEmit: true,
  allowImportingTsExtensions: true,
  allowJs: true
} as const;
export type StaticCompilerOptions = typeof STATIC_COMPILER_OPTIONS;

export const META: TsConfigMeta<typeof TSCONFIG_DOMAIN.dev> = {
  $schema: TSCONFIG_SCHEMA,
  name: TSCONFIG_DOMAIN.dev,
  description: 'Development configuration for tooling, mocks, and config files.'
} as const;
export type DevMeta = typeof META;

export interface StaticFields extends DevMeta {
  extends: `./${TsConfigBaseFile}`;
}
export const STATIC_FIELDS: StaticFields = {
  ...META,
  extends: `./${TSCONFIG_BASE_FILE}`
} as const;
export const INCLUDE: Config['include'] = [
  DEV_DIR,
  ...matchAllExtsInCurrDir(SRC_FILE_EXTS),
  `./${CONFIG_FILE_PATTERN}`
] as const;
export const EXCLUDE: Config['exclude'] = [
  ...ALWAYS_IGNORE,
  ...ALL_TEST_FILES,
  ...matchAllInDirs(ANY_ROOT_SRC_DIR)
];

export const define = ({
  compilerOptions = {},
  exclude = [],
  include = [],
  ...rest
}: InputConfig = {}): Config => ({
  ...rest,
  ...STATIC_FIELDS,
  compilerOptions: { ...compilerOptions, ...STATIC_COMPILER_OPTIONS },
  exclude: dedupeArrays(exclude, EXCLUDE),
  include: dedupeArrays(include, INCLUDE)
});
