import type file from '@toolbox-ts/file';
import type {
  ICruiseOptions,
  IFlattenedRuleSet,
  IResolveOptions,
  ITranspileOptions
} from 'dependency-cruiser';

import { utils } from '@toolbox-ts/cli-kit';
import { findFirstUp, type OverwriteBehavior } from '@toolbox-ts/file';
import { obj } from '@toolbox-ts/utils';
import extractTSConfig from 'dependency-cruiser/config-utl/extract-ts-config';
import extractWebpackResolveConfig from 'dependency-cruiser/config-utl/extract-webpack-resolve-config';
import path from 'node:path';
import { list } from 'watskeburt';

import {
  EXTS,
  type IFormattingOptions,
  type InputCruiseOptions,
  output,
  type ResolvedCruiseOptions
} from '../../../../definitions/index.js';

const { nestWhen } = utils.normalize;

export const resolve = {
  graph: ({
    type,
    toSvg,
    fileName,
    outDir
  }: {
    outDir: string;
  } & output.GraphCfg): output.ResolvedOutput<output.Graph> => ({
    outPath: path.join(
      outDir,
      fileName
        + (output.sets.dotGraph.has(type) && toSvg ?
          '.svg'
        : output.definitions.graph[type].fileExtension)
    ),
    type
  }),
  report: ({
    type,
    fileName,
    outDir
  }: {
    outDir: string;
  } & output.ReportCfg): output.ResolvedOutput<output.Report> => ({
    outPath: path.join(
      outDir,
      fileName + output.definitions.report[type].fileExtension
    ),
    type
  }),

  depcruiserResolveOptions: async ({
    webpackConfig
  }: Pick<ResolvedCruiseOptions, 'webpackConfig'>): Promise<
    IResolveOptions | undefined
  > => {
    let resolveOptions: IResolveOptions | undefined;
    const webpackConfigFileName = webpackConfig?.fileName;
    if (webpackConfigFileName) {
      const webpackConfigPath = await findFirstUp(webpackConfigFileName);
      if (!webpackConfigPath)
        throw new Error(
          `Webpack config file provided but not found: ${webpackConfigFileName}`
        );

      resolveOptions = (await extractWebpackResolveConfig(
        webpackConfigPath
      )) as IResolveOptions;

      return resolveOptions;
    }
  },
  depcruiserTranspileOptions: async (
    opts: Pick<ResolvedCruiseOptions, 'babelConfig' | 'tsConfig'> | undefined
  ): Promise<ITranspileOptions | undefined> => {
    if (!opts) return undefined;

    const { babelConfig, tsConfig } = opts;
    let resolveOptions: ITranspileOptions | undefined = undefined;

    const tsConfigFileName = tsConfig?.fileName;
    if (tsConfigFileName) {
      const tsconfigPath = await findFirstUp(tsConfigFileName);
      if (!tsconfigPath)
        throw new Error(
          `TypeScript config file not found: ${tsConfigFileName}`
        );
      resolveOptions = { tsConfig: extractTSConfig(tsconfigPath) };
    }
    const babelConfigFileName = babelConfig?.fileName;
    if (babelConfigFileName) {
      const babelConfigPath = await findFirstUp(babelConfigFileName);
      if (!babelConfigPath)
        throw new Error(`Babel config file not found: ${babelConfigFileName}`);
      resolveOptions = {
        ...resolveOptions,
        babelConfig: { fileName: babelConfigPath }
      };
    }
    return resolveOptions;
  },
  ruleSet: (
    base: IFlattenedRuleSet,
    {
      allowed = [],
      allowedSeverity,
      forbidden = [],
      required = []
    }: IFlattenedRuleSet = {}
  ) => {
    const result: IFlattenedRuleSet = obj.clone(base);
    if (allowed.length > 0)
      result.allowed = [...(result.allowed ?? []), ...allowed];
    if (forbidden.length > 0)
      result.forbidden = [...(result.forbidden ?? []), ...forbidden];
    if (required.length > 0)
      result.required = [...(result.required ?? []), ...required];
    if (allowedSeverity) result.allowedSeverity = allowedSeverity;
    return result;
  },
  output: ({
    log,
    graph,
    report,
    outputTo,
    overwriteBehavior,
    collapse,
    exclude,
    focus,
    includeOnly,
    prefix,
    reaches
  }: ResolvedCruiseOptions): {
    formatting: Partial<IFormattingOptions>;
    graph: false | output.ResolvedOutput<output.Graph>;
    log: false | output.Loggable;
    overwriteBehavior: OverwriteBehavior;
    report: false | output.ResolvedOutput<output.Report>;
  } => ({
    graph:
      graph && output.is.graph(graph.type) ?
        resolve.graph({ ...graph, outDir: outputTo })
      : false,
    report:
      report && output.is.report(report.type) ?
        resolve.report({ ...report, outDir: outputTo })
      : false,
    log,
    overwriteBehavior,
    formatting: {
      ...nestWhen('collapse', collapse, collapse),
      ...nestWhen('exclude', exclude, exclude),
      ...nestWhen('focus', focus, focus),
      ...nestWhen('includeOnly', includeOnly, includeOnly),
      ...nestWhen('prefix', prefix, prefix),
      ...nestWhen('reaches', reaches, reaches)
    }
  }),

  /**
   * @see {@link https://github.com/sverweij/dependency-cruiser/blob/8a52b07a2e868fc72c6019b7b2a08df5df34d576/src/cli/normalize-cli-options.mjs#L226}
   */
  reaches: async (opts: { affected?: string; reaches?: string }) => {
    const affected =
      typeof opts.affected === 'string' ? opts.affected.trim() : undefined;
    const reaches =
      typeof opts.reaches === 'string' ? opts.reaches.trim() : undefined;
    if (affected && affected.length > 0)
      return await list({
        oldRevision: affected,
        outputType: 'regex',
        extensions: EXTS.join(',')
      });
    if (reaches && reaches.length > 0) return reaches;

    return undefined;
  }
} as const;
export interface ResolvedOptions {
  cruiseOptions: Omit<ICruiseOptions, 'outputTo' | 'outputType'>;
  output: {
    formatting: Partial<IFormattingOptions>;
    graph: false | output.ResolvedOutput<output.Graph>;
    log: false | output.Loggable;
    overwriteBehavior: OverwriteBehavior;
    report: false | output.ResolvedOutput<output.Report>;
  };
  resolveOptions?: IResolveOptions;
  transpileOptions?: ITranspileOptions;
}
export interface ResolveOptions {
  base: ResolvedCruiseOptions;
  cruiseOptions?: InputCruiseOptions;
}
export const resolveOptions = async ({
  base,
  cruiseOptions = {}
}: ResolveOptions): Promise<ResolvedOptions> => {
  const merged = obj.merge(base, cruiseOptions);

  if (cruiseOptions.ruleSet && !obj.guards.isObjEmpty(cruiseOptions.ruleSet)) {
    merged.ruleSet = resolve.ruleSet(base.ruleSet ?? {}, cruiseOptions.ruleSet);
  }
  const {
    outputTo,
    graph,
    log,
    report,
    affected,
    babelConfig,
    webpackConfig,
    tsConfig,
    reaches: _reaches,
    overwriteBehavior,
    ...rest
  } = merged;
  const resolvedOutput = resolve.output({
    outputTo,
    graph,
    log,
    report,
    overwriteBehavior,
    ...rest
  });
  const reaches = await resolve.reaches({
    affected,
    reaches: _reaches as string | undefined
  });
  const _resolveOptions = await resolve.depcruiserResolveOptions({
    webpackConfig
  });
  const transpileOptions = await resolve.depcruiserTranspileOptions({
    babelConfig,
    tsConfig
  });

  return {
    output: resolvedOutput,
    ...nestWhen('resolveOptions', _resolveOptions, _resolveOptions),
    ...nestWhen('transpileOptions', transpileOptions, transpileOptions),
    cruiseOptions: { ...rest, ...nestWhen('reaches', reaches, reaches) }
  };
};
