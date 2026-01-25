import type { ICruiseOptions } from 'dependency-cruiser';

import type {
  InputCruiseOptions,
  StaticCruiseOptions
} from '../../types/index.ts';

import {
  ARTIFACTS_DIR,
  dedupeArrays,
  DOCS_DIR,
  DIST_DIR,
  TSCONFIG_BUILD_FILE,
  when
} from '../../../../../../../../core/index.js';
import { handleAffected, handleReporter } from './handlers/index.ts';

export const STATIC_OPTIONS: StaticCruiseOptions = {
  tsConfig: { fileName: TSCONFIG_BUILD_FILE },
  tsPreCompilationDeps: true
} as const;
export const EXCLUDE: ICruiseOptions['exclude'] = [
  DOCS_DIR,
  ARTIFACTS_DIR,
  DIST_DIR,
  String.raw`(test|spec|bench)\.[tj]sx?$`
] as const;
export const DO_NOT_FOLLOW = { path: ['node_modules'] } as const;
const resolveDoNotFollowPath = (p: string | string[] = []): string[] =>
  dedupeArrays(DO_NOT_FOLLOW.path, Array.isArray(p) ? p : [p]);

export const ENHANCED_RESOLVE_OPTIONS: InputCruiseOptions['enhancedResolveOptions'] =
  {
    exportsFields: ['exports'],

    conditionNames: ['import', 'require', 'node', 'default', 'types'],

    mainFields: ['module', 'main', 'types', 'typings']
  } as const;

export const resolve = async ({
  affected,
  reaches,
  doNotFollow,
  skipAnalysisNotInRules = true,
  reporterOptions,
  exclude = [],
  enhancedResolveOptions,
  ...rest
}: InputCruiseOptions): Promise<ICruiseOptions> => ({
  skipAnalysisNotInRules,
  exclude: [...EXCLUDE, ...(Array.isArray(exclude) ? exclude : [exclude])],

  doNotFollow: {
    dependencyTypes: doNotFollow?.dependencyTypes,
    path: resolveDoNotFollowPath(doNotFollow?.path)
  },
  ...rest,
  enhancedResolveOptions: {
    ...ENHANCED_RESOLVE_OPTIONS,
    ...enhancedResolveOptions
  },
  reporterOptions: handleReporter(reporterOptions),
  ...when(affected, {
    affected: undefined,
    reaches: await handleAffected(affected)
  }),
  ...STATIC_OPTIONS
});
