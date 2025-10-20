import type { ModuleSystemType } from 'dependency-cruiser';

import { utils } from '@toolbox-ts/cli-kit';
import { Obj, Str, type StrRecord } from '@toolbox-ts/utils';

import {
  type flags,
  MODULE_SYSTEMS,
  output,
  type ResolvedCruiseOptions
} from '../../../../definitions/index.js';

const { nestWhen, strOrNum } = utils.normalize;

type Normalize = (flags: Partial<flags.ParsedResult>) => StrRecord | undefined;
const normalize: { [key: string]: Normalize } = {
  exclude: ({ exclude }) =>
    nestWhen('exclude', exclude, (e) => ({ path: Str.split.csv(e) })),
  includeOnly: ({ includeOnly }) =>
    nestWhen('includeOnly', includeOnly, (i) => ({ path: Str.split.csv(i) })),
  reaches: ({ reaches }) =>
    nestWhen('reaches', reaches, (r) => ({ path: Str.split.csv(r) })),
  maxDepth: ({ maxDepth }) => nestWhen('maxDepth', maxDepth, strOrNum),
  collapse: ({ collapse }) => nestWhen('collapse', collapse, strOrNum),
  tsConfig: ({ tsConfig }) =>
    nestWhen('tsConfig', tsConfig, { fileName: tsConfig }),
  webpackConfig: ({ webpackConfig }) =>
    nestWhen('webpackConfig', webpackConfig, { fileName: webpackConfig }),
  babelConfig: ({ babelConfig }) =>
    nestWhen('babelConfig', babelConfig, { fileName: babelConfig }),
  moduleSystems: ({ moduleSystems }) =>
    nestWhen('moduleSystems', moduleSystems, (m) =>
      Str.split
        .csv(m)
        .filter((ms): ms is ModuleSystemType => ms in MODULE_SYSTEMS)
    ),
  cache: ({
    noCache: no,
    cacheStrategy: strategy,
    cacheCompression: compress,
    cacheFolder: folder
  }) =>
    nestWhen('cache', no === true, false)
    ?? nestWhen('cache', strategy, { strategy, compress, folder }),
  log: ({ noLog, logType }) =>
    nestWhen('log', noLog === true, false) ?? nestWhen('log', logType, logType),
  report: ({ noReport: no, reportFileName: fileName, reportType: type }) =>
    nestWhen('report', no === true, false)
    ?? nestWhen('report', type, { type, fileName }),
  graph: ({
    noGraph: no,
    graphType: type,
    graphDotToSvg: toSvg,
    graphFileName: fileName
  }) =>
    nestWhen('graph', no === true, false)
    ?? nestWhen('graph', type, (t) => ({
      type,
      fileName,
      toSvg: output.is.dotGraph(t) ? toSvg : undefined
    })),
  focus: ({ focus: path, focusDepth: depth }) =>
    nestWhen('focus', path, (p) => ({
      path: Str.split.csv(p),
      depth: strOrNum(depth)
    })),
  doNotFollow: ({ doNotFollow: path, doNotFollowDependencyTypes: types }) =>
    nestWhen('doNotFollow', path, (p) => ({
      path: Str.split.csv(p),
      dependencyTypes: types ? Str.split.csv(types) : undefined
    })),
  progress: ({ progressType, progressMaximumLevel }) =>
    nestWhen('progress', progressType, (type) => ({
      type,
      maximumLevel: strOrNum(progressMaximumLevel)
    })),
  outputTo: ({ outputTo }) => nestWhen('outputTo', outputTo, outputTo),
  emitActionsSummary: ({ emitActionsSummary }) =>
    nestWhen('emitActionsSummary', emitActionsSummary, emitActionsSummary),
  logOnly: ({ logOnly }) => nestWhen('logOnly', logOnly, logOnly),
  noOutput: ({ noOutput }) => nestWhen('noOutput', noOutput, noOutput)
} as const;

export const resolveFlags = ({
  logOnly,
  noOutput,
  ...rest
}: Partial<flags.ParsedResult>): ResolvedCruiseOptions => {
  const result = Obj.stripNullish(
    Obj.keys(normalize).reduce(
      (acc, curr) => ({ ...acc, ...normalize[curr](rest) }),
      {}
    )
  ) as ResolvedCruiseOptions;

  if (noOutput) {
    result.log = false;
    result.graph = false;
    result.report = false;
  } else if (logOnly) {
    result.graph = false;
    result.report = false;
  }

  return result;
};
