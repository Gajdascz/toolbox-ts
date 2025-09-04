import * as file from '@toolbox-ts/file';

import {
  type InputConfig,
  type output,
  PROGRESS_MAXIMUM_LEVEL,
  PROGRESS_TYPES,
  type ResolvedCruiseOptions
} from '../../config/index.js';

export interface BaseConfig extends InputConfig {
  configFileName: string;
  options: {
    graph: output.GraphCfg;
    outputTo: string;
    report: output.ReportCfg;
  } & ResolvedCruiseOptions;
}
export const defaultConfig: BaseConfig = {
  configFileName: 'depcruiser.config.*',
  forbidden: {
    noCircular: true,
    noOrphans: true,
    noDeprecatedCore: true,
    noNonPackageJson: true,
    noDuplicateDepTypes: true,
    notToDeprecated: true,
    notToDevDep: true,
    notToSpec: true,
    notToUnresolvable: true,
    optionalDepsUsed: true,
    peerDepsUsed: true
  },
  options: {
    overwriteBehavior: file.write.overwriteBehaviors.force,
    moduleSystems: ['es6', 'amd', 'cjs'],
    doNotFollow: { path: ['node_modules'] },
    outputTo: 'docs/reports/dependencies',
    cache: false,
    report: { fileName: 'dependency-report', type: 'json' },
    graph: {
      fileName: 'dependency-graph',
      type: 'x-dot-webpage',
      toSvg: false
    },
    log: 'text',
    progress: {
      type: PROGRESS_TYPES.cliFeedback,
      maximumLevel: PROGRESS_MAXIMUM_LEVEL.SUMMARY
    },
    enhancedResolveOptions: {
      conditionNames: ['import', 'require', 'node', 'default', 'types'],
      exportsFields: ['exports'],
      mainFields: ['module', 'main', 'types', 'typings']
    }
  }
} as const;
