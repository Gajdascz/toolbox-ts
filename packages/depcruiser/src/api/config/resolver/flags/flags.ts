import type { ModuleSystemType } from 'dependency-cruiser';

import { utils } from '@toolbox-ts/cli-kit';
import { Obj, Str, type StrRecord } from '@toolbox-ts/utils';

import {
  type flags,
  MODULE_SYSTEMS,
  output,
  type ResolvedCruiseOptions
} from '../../../../config/index.js';

const { nestWhen, strOrNum } = utils.normalize;

type Normalize = (flags: Partial<flags.ParsedResult>) => StrRecord | undefined;
const normalize: { [key: string]: Normalize } = {
  exclude: ({ exclude }) =>
    nestWhen('exclude', exclude, (e) => ({ path: Str.parse.csvRow(e) })),
  includeOnly: ({ includeOnly }) =>
    nestWhen('includeOnly', includeOnly, (i) => ({
      path: Str.parse.csvRow(i)
    })),
  reaches: ({ reaches }) =>
    nestWhen('reaches', reaches, (r) => ({ path: Str.parse.csvRow(r) })),
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
      Str.parse
        .csvRow(m)
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
    nestWhen('focus', path, {
      path: Str.parse.csvRow(path),
      depth: strOrNum(depth)
    }),
  doNotFollow: ({ doNotFollowPath: path, doNotFollowDependencyTypes: types }) =>
    nestWhen('doNotFollow', path, (p) => ({
      path: Str.parse.csvRow(p),
      dependencyTypes: Str.parse.csvRow(types)
    })),
  progress: ({ progressType, progressMaximumLevel }) =>
    nestWhen('progress', progressType, (type) => ({
      type,
      maximumLevel: strOrNum(progressMaximumLevel)
    }))
} as const;

export const resolveFlags = (
  result: Partial<flags.ParsedResult>
): ResolvedCruiseOptions =>
  Obj.stripNullish(
    Obj.keys(normalize).reduce(
      (acc, curr) => ({ ...acc, ...normalize[curr](result) }),
      {}
    )
  ) as ResolvedCruiseOptions;
