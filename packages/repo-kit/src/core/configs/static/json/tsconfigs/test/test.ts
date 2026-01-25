import type {
  RequiredProps,
  TsConfigMeta,
  TsConfigWithMeta,
  TsConfigWithMetaInput
} from '@toolbox-ts/types';

import {
  type TsConfigBaseFile,
  ALWAYS_IGNORE,
  TSCONFIG_BASE_FILE,
  TSCONFIG_DOMAIN,
  TSCONFIG_SCHEMA,
  TSCONFIG_TEST_FILE,
  dedupeArrays,
  ALL_TEST_FILES
} from '../../../../../../../core/index.js';

export type Config = RequiredProps<
  TsConfigWithMeta<TestMeta['name']>,
  'exclude' | 'extends' | 'include'
>
  & StaticFields;

export type InputConfig = TsConfigWithMetaInput<TestMeta['name'], StaticFields>;
export interface StaticFields extends TestMeta {
  extends: `./${TsConfigBaseFile}`;
}
export const META: TsConfigMeta<typeof TSCONFIG_DOMAIN.test> = {
  $schema: TSCONFIG_SCHEMA,
  filename: TSCONFIG_TEST_FILE,
  name: TSCONFIG_DOMAIN.test,
  description: 'TypeScript configuration for test files with relaxed rules.'
} as const;
export type TestMeta = typeof META;
export const STATIC_FIELDS: StaticFields = {
  ...META,
  extends: `./${TSCONFIG_BASE_FILE}`
} as const;
export const INCLUDE: Config['include'] = ALL_TEST_FILES;
export const EXCLUDE: Config['exclude'] = ALWAYS_IGNORE;
export const DEFAULT_COMPILER_OPTIONS: InputConfig['compilerOptions'] = {
  allowImportingTsExtensions: true,
  noEmit: true,
  allowJs: true,
  strict: false,
  strictNullChecks: false,
  allowUnusedLabels: true,
  allowUnreachableCode: true,
  noImplicitAny: false,
  strictFunctionTypes: false,
  strictBindCallApply: false,
  strictPropertyInitialization: false,
  noUnusedLocals: false,
  noUnusedParameters: false,
  noImplicitReturns: false,
  noFallthroughCasesInSwitch: false,
  noUncheckedIndexedAccess: false,
  noImplicitOverride: false,
  exactOptionalPropertyTypes: false
} as const;

export const define = ({
  exclude = [],
  include = [],
  compilerOptions = {},
  ...rest
}: InputConfig = {}): Config => ({
  ...STATIC_FIELDS,
  include: dedupeArrays(INCLUDE, include),
  exclude: dedupeArrays(EXCLUDE, exclude),
  compilerOptions: { ...DEFAULT_COMPILER_OPTIONS, ...compilerOptions },
  ...rest
});
