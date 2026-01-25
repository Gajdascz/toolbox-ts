import type { CompilerOptions, TsConfigMeta } from '@toolbox-ts/types';
import {
  ALWAYS_IGNORE,
  ALL_TEST_FILES,
  TSCONFIG_DOMAIN,
  TSCONFIG_SCHEMA
} from '../../../../../../../core/index.js';

export const META: TsConfigMeta<typeof TSCONFIG_DOMAIN.build> = {
  $schema: TSCONFIG_SCHEMA,
  name: TSCONFIG_DOMAIN.build,
  description: 'Strict configuration for building production code.'
} as const;
export type BuildMeta = typeof META;

export const SHARED_SRC_EXCLUDE = [
  ...ALWAYS_IGNORE,
  ...ALL_TEST_FILES
] as const;

export const DEFAULT_BUILD_COMPILER_OPTIONS: CompilerOptions = {
  declaration: true,
  declarationMap: true,
  sourceMap: true,
  rewriteRelativeImportExtensions: true,
  removeComments: true,
  esModuleInterop: true
} as const;
