import type { InferredFlags } from '@oclif/core/interfaces';

import { Flags } from '@oclif/core';
import { utils } from '@toolbox-ts/cli-kit';
import { overwriteBehavior } from '@toolbox-ts/file';
import { obj } from '@toolbox-ts/utils';
import { EOL } from 'node:os';

import { CACHE_STRATEGIES, MODULE_SYSTEMS } from '../constants.js';
import * as output from '../output-types/index.js';

export type ParsedResult = InferredFlags<typeof definitions>;

export const definitions = {
  //#region> Output
  noLog: Flags.boolean({
    ...utils.flagMeta('noLog', 'disable logging.', {
      helpGroup: 'Output',
      otherAliases: ['silent']
    })
  }),
  logType: Flags.string({
    ...utils.flagMeta('logType', 'logging output type', {
      helpGroup: 'Output'
    }),
    options: output.keys.loggable
  }),
  noReport: Flags.boolean({
    ...utils.flagMeta('noReport', 'do not generate a report.', {
      helpGroup: 'Output'
    })
  }),
  reportFileName: Flags.file({
    ...utils.flagMeta(
      'reportFileName',
      'The file path to write reports to. If not provided, no report is written.',
      { helpGroup: 'Output' }
    )
  }),
  reportType: Flags.string({
    ...utils.flagMeta('reportType', 'report output type.', {
      helpGroup: 'Output'
    }),
    options: output.keys.report
  }),
  noGraph: Flags.boolean({
    ...utils.flagMeta('noGraph', 'Do not generate a graph.', {
      helpGroup: 'Output'
    })
  }),
  graphType: Flags.string({
    ...utils.flagMeta('graphType', 'The type of graph to generate.', {
      helpGroup: 'Output'
    }),
    options: output.keys.graph
  }),
  graphFileName: Flags.string({
    ...utils.flagMeta(
      'graphFileName',
      'The name to use for the generated graph file.',
      { helpGroup: 'Output' }
    ),
    dependsOn: ['graphType']
  }),
  graphDotToSvg: Flags.boolean({
    ...utils.flagMeta('graphDotToSvg', 'Transform dot output to SVG.', {
      helpGroup: 'Output'
    }),
    dependsOn: ['graphType']
  }),
  overwriteBehavior: Flags.string({
    ...utils.flagMeta(
      'overwriteBehavior',
      'what to do when the output file already exists',
      { helpGroup: 'Output' }
    ),
    options: obj.keys(overwriteBehavior)
  }),
  outputTo: Flags.directory({
    ...utils.flagMeta('outputTo', 'the folder to write output files to', {
      char: 'f',
      helpGroup: 'Output'
    })
  }),
  emitActionsSummary: Flags.string({
    ...utils.flagMeta(
      'emitActionsSummary',
      'emit a GitHub Actions step summary with a Mermaid graph of the affected modules. Pass it the git revision to compare against ${{ github.event.pull_request.base.sha }} to get a graph of the modules changed in a PR and all modules that depend on them. It requires the process.env.GITHUB_STEP_SUMMARY environment variable to find out where to write the summary to.',
      { helpGroup: 'Output' }
    )
  }),
  logOnly: Flags.boolean({
    ...utils.flagMeta(
      'logOnly',
      'Disable graph and report generation; only emit logs to the console.',
      { helpGroup: 'Output' }
    )
  }),
  noOutput: Flags.boolean({
    ...utils.flagMeta('noOutput', 'disable all output.', {
      helpGroup: 'Output'
    })
  }),
  //#endregion

  //#region> Cache
  noCache: Flags.boolean({
    ...utils.flagMeta('noCache', 'disable caching.', { helpGroup: 'Cache' })
  }),
  cacheFolder: Flags.string({
    ...utils.flagMeta('cacheFolder', `the folder to store the cache in.`, {
      helpGroup: 'Cache'
    })
  }),
  cacheStrategy: Flags.string({
    ...utils.flagMeta(
      'cacheStrategy',
      `the strategy to use for caching${EOL}- 'metadata': use git metadata to detect changes;${EOL}- 'content': use (a checksum of) the contents of files to detect changes.`,
      { helpGroup: 'Cache' }
    ),
    options: obj.keys(CACHE_STRATEGIES)
  }),
  cacheCompression: Flags.boolean({
    ...utils.flagMeta(
      'cacheCompression',
      `whether to compress the cache or not.`,
      { helpGroup: 'Cache' }
    )
  }),
  //#endregion

  //#region> Progress
  progressType: Flags.string({
    ...utils.flagMeta(
      'progressType',
      'the type of progress indicator to use.',
      { helpGroup: 'Progress' }
    )
  }),
  progressMaximumLevel: Flags.integer({
    ...utils.flagMeta(
      'progressMaximumLevel',
      'the maximum depth to show progress for',
      { helpGroup: 'Progress' }
    )
  }),
  //#endregion

  //#region> Resolution
  tsConfig: Flags.file({
    ...utils.flagMeta('tsConfig', 'path to tsconfig.json', {
      helpGroup: 'Resolution'
    })
  }),
  webpackConfig: Flags.file({
    ...utils.flagMeta(
      'webpackConfig',
      'path to webpack configuration (if you use webpack aliases)',
      { helpGroup: 'Resolution' }
    )
  }),
  babelConfig: Flags.file({
    ...utils.flagMeta(
      'babelConfig',
      'path to babel configuration (if you use babel aliases)',
      { helpGroup: 'Resolution' }
    )
  }),
  preserveSymlinks: Flags.boolean({
    ...utils.flagMeta(
      'preserveSymlinks',
      'do not resolve symlinks to their real path',
      { helpGroup: 'Resolution' }
    )
  }),
  moduleSystems: Flags.string({
    ...utils.flagMeta('moduleSystems', 'The module systems to support', {
      acceptsCommaSeparated: true,
      char: 'M',
      helpGroup: 'Resolution'
    }),
    options: obj.keys(MODULE_SYSTEMS)
  }),
  //#endregion

  //#region> Traversal
  maxDepth: Flags.integer({
    ...utils.flagMeta(
      'maxDepth',
      'limit how deep dependency-cruiser follows dependencies',
      { char: 'd', helpGroup: 'Traversal' }
    )
  }),
  tsPreCompilationDeps: Flags.boolean({
    ...utils.flagMeta(
      'tsPreCompileDeps',
      'detect dependencies that only exist before typescript-to-javascript compilation',
      { helpGroup: 'Traversal' }
    )
  }),
  doNotFollow: Flags.string({
    ...utils.flagMeta(
      'doNotFollow',
      "include modules matching the regex, but don't follow their dependencies.",
      { acceptsCommaSeparated: true, char: 'X', helpGroup: 'Traversal' }
    )
  }),
  doNotFollowDependencyTypes: Flags.string({
    ...utils.flagMeta(
      'doNotFollowDependencyTypes',
      'Dependency types to consider when applying the do-not-follow rule',
      { acceptsCommaSeparated: true, helpGroup: 'Traversal' }
    )
  }),
  //#endregion

  //#region> Filtering
  includeOnly: Flags.string({
    ...utils.flagMeta(
      'includeOnly',
      'Only include modules matching the regex pattern.',
      { char: 'I', helpGroup: 'Filtering' }
    )
  }),
  prefix: Flags.string({
    ...utils.flagMeta(
      'prefix',
      'prefix to use for links in the dot and err-html reporters',
      { char: 'P', helpGroup: 'Filtering' }
    )
  }),
  exclude: Flags.string({
    ...utils.flagMeta('exclude', 'Exclude all modules matching the regex.', {
      acceptsCommaSeparated: true,
      char: 'x',
      helpGroup: 'Filtering'
    })
  }),
  collapse: Flags.string({
    ...utils.flagMeta(
      'collapse',
      'collapse to folder depth (digit) or regex pattern; e.g. "^packages/[^/]+/".',
      { acceptsCommaSeparated: true, char: 'S', helpGroup: 'Filtering' }
    )
  }),
  reaches: Flags.string({
    ...utils.flagMeta(
      'reaches',
      'only include modules matching the regex + all modules they reach',
      { acceptsCommaSeparated: true, char: 'R', helpGroup: 'Filtering' }
    )
  }),
  focus: Flags.string({
    ...utils.flagMeta(
      'focus',
      'only include modules matching the regex + their direct neighbours',
      { acceptsCommaSeparated: true, char: 'F', helpGroup: 'Filtering' }
    )
  }),
  focusDepth: Flags.integer({
    ...utils.flagMeta(
      'focusDepth',
      'depth to focus on (only applied when --focus is passed); 1=direct neighbours, 2=neighbours of neighbours, etc.',
      { helpGroup: 'Filtering' }
    ),
    dependsOn: ['focus']
  }),
  highlight: Flags.string({
    ...utils.flagMeta(
      'highlight',
      'mark modules matching the regex as highlighted',
      { char: 'H', helpGroup: 'Filtering' }
    )
  }),
  //#endregion

  //#region> Misc
  init: Flags.boolean({
    ...utils.flagMeta(
      'init',
      'generate a dependency-cruiser configuration file in the current working directory.',
      { helpGroup: 'Misc' }
    ),
    default: false
  }),
  affected: Flags.string({
    ...utils.flagMeta(
      'affected',
      'only include modules changed since revision + all modules that can reach them.',
      { char: 'A', helpGroup: 'Misc' }
    )
  }),
  metrics: Flags.boolean({
    ...utils.flagMeta('metrics', 'calculate and include code metrics', {
      char: 'm',
      helpGroup: 'Misc'
    })
  }),
  validate: Flags.boolean({
    ...utils.flagMeta('validate', 'validate the configuration file', {
      char: 'v',
      helpGroup: 'Misc'
    })
  }),
  config: Flags.file({
    ...utils.flagMeta('config', 'the configuration file to use.', {
      char: 'c',
      helpGroup: 'Misc'
    }),
    exists: true
  })
  //#endregion
} as const;
