import type { TsConfig } from '@toolbox-ts/types/defs/configs';
import { GLOBS } from '@toolbox-ts/constants/fs';
import { getPresetMeta, createStatic, createDefine, FILENAMES } from '../core.js';
import { serializeJson } from '../../../../helpers.js';
export type Meta = TsConfig.Meta<'test'>;
export const META: Meta = getPresetMeta('test', 'Configuration for test files with relaxed rules.');
export const DEFAULT_COMPILER_OPTIONS = {
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
};

export const STATIC = createStatic({ ...META, include: GLOBS.FILES.TESTS.DEEP }, {});
/** Produces test tsconfig. Relaxed strictness defaults applied before input `compilerOptions`. */
export const define = createDefine({ ...STATIC, defaultCompilerOptions: DEFAULT_COMPILER_OPTIONS });
export type Config = Parameters<typeof define>[0];

export const toFileEntry = (config?: Config) => ({
  [FILENAMES.test]: serializeJson(define(config))
});
