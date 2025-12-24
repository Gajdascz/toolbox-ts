import type {
  RequiredProps,
  TsConfigWithMeta,
  TsConfigWithMetaInput
} from '@toolbox-ts/types';

import { ALWAYS_IGNORE } from '../../base.js';
import {
  ALL_TEST_FILES,
  ROOT_TO_BASE_TSCONFIG_PATH,
  type RootToBaseTsConfigPath,
  TEST_META,
  type TestMeta
} from '../shared.js';

export type Config = RequiredProps<
  TsConfigWithMeta<TestMeta['name']>,
  'exclude' | 'extends' | 'include'
>
  & StaticFields;

export type InputConfig = TsConfigWithMetaInput<TestMeta['name'], StaticFields>;
export interface StaticFields extends TestMeta {
  extends: RootToBaseTsConfigPath;
}
export const STATIC_FIELDS: StaticFields = {
  ...TEST_META,
  extends: ROOT_TO_BASE_TSCONFIG_PATH
} as const;
export const INCLUDE: Config['include'] = ALL_TEST_FILES;
export const EXCLUDE: Config['exclude'] = ALWAYS_IGNORE;
export const META = { ...TEST_META } as const;
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
//#endregion
