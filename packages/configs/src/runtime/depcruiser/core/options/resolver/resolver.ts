import type { ICruiseOptions } from 'dependency-cruiser';

import { Arr } from '@toolbox-ts/utils';
import { when } from '@toolbox-ts/utils/core';

import type { InputCruiseOptions, StaticCruiseOptions } from '../../types/index.js';

import { DIRS, FILES } from '@toolbox-ts/constants/fs';
import { handleAffected, handleReporter } from './handlers/index.js';

export const STATIC_OPTIONS: StaticCruiseOptions = {
  tsConfig: { fileName: FILES.CONFIG.TS_BUILD },
  tsPreCompilationDeps: true
} as const;
export const EXCLUDE: ICruiseOptions['exclude'] = [
  DIRS.DOCS,
  DIRS.ARTIFACTS,
  DIRS.OUT,
  String.raw`(${FILES.TEST_INFIXES.join('|')})\.[tj]sx?$`
] as const;
export const DO_NOT_FOLLOW = { path: [DIRS.NODE_MODULES] };
const resolveDoNotFollowPath = (p: string | string[] = []): string[] =>
  Arr.mergeUnique(DO_NOT_FOLLOW.path, Arr.ensure(p));

export const ENHANCED_RESOLVE_OPTIONS: InputCruiseOptions['enhancedResolveOptions'] = {
  exportsFields: ['exports'],

  conditionNames: ['import', 'require', 'node', 'default', 'types'],

  mainFields: ['module', 'main', 'types', 'typings']
} as const;
export const DEFAULTS: InputCruiseOptions = {
  ...STATIC_OPTIONS,
  exclude: EXCLUDE,
  doNotFollow: DO_NOT_FOLLOW,
  enhancedResolveOptions: ENHANCED_RESOLVE_OPTIONS
};
export const resolve = async ({
  affected,
  doNotFollow,
  skipAnalysisNotInRules = true,
  reporterOptions,
  exclude = [],
  enhancedResolveOptions,
  reaches: _reaches,
  ...rest
}: InputCruiseOptions): Promise<ICruiseOptions> => ({
  skipAnalysisNotInRules,
  exclude: [...EXCLUDE, ...Arr.ensure(exclude)],

  doNotFollow: {
    dependencyTypes: doNotFollow?.dependencyTypes,
    path: resolveDoNotFollowPath(doNotFollow?.path)
  },
  ...rest,
  enhancedResolveOptions: { ...ENHANCED_RESOLVE_OPTIONS, ...enhancedResolveOptions },
  reporterOptions: handleReporter(reporterOptions),
  ...when(affected, { affected: undefined, reaches: await handleAffected(affected) }),
  ...STATIC_OPTIONS
});
