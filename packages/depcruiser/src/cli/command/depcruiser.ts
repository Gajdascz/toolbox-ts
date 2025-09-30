import type { ICruiseResult } from 'dependency-cruiser';

import { checkbox, confirm, input, select } from '@inquirer/prompts';
import { Args } from '@oclif/core';
import { BaseCommand, utils } from '@toolbox-ts/cli-kit';
import file from '@toolbox-ts/file';
import { Obj, Str } from '@toolbox-ts/utils';

import { cruise, defaultConfig, format, loadConfig } from '../../api/index.js';
import {
  flags,
  type IFormattingOptions,
  type InputConfig,
  output,
  rules
} from '../../definitions/index.js';

interface GetCacheOptions {
  cfgFileName?: string;
  startingDir?: string;
}

import fs from 'node:fs/promises';

export class DependencyCruiser extends BaseCommand {
  static override readonly args = {
    scan: Args.string({
      name: 'filesOrDirectories',
      description:
        'Files, directories, or glob patterns to analyze. Wrap globs in quotes to prevent shell expansion (e.g. "packages/*").'
    })
  };

  static override description = `Inherited from https://github.com/sverweij/dependency-cruiser/blob/main/bin/dependency-cruise.mjs`;
  static override examples = ['$ <%= config.bin %> <%= command.id %>'];
  static override readonly flags = flags.definitions;

  static override id = 'dependency-cruiser';

  private _cache: InputConfig | undefined = undefined;

  readonly cache = {
    get: async (opts: GetCacheOptions = {}) => {
      this._cache ??= await loadConfig(opts.cfgFileName, opts.startingDir);
      return this._cache;
    },
    clear: () => {
      this._cache = undefined;
    }
  };

  cruiseDeps = this.wrap('pnpm depcruise');

  /* c8 ignore start */
  readonly prompt = {
    overwrite: (filePath = '') =>
      confirm({
        message: `The file ${filePath} already exists. Overwrite?`,
        default: false
      }),
    isTs: () => confirm({ message: 'Is this a TypeScript project?' }),
    fileName: (fileType: string, defaultFilename = '') =>
      input({
        message: `What do you want to name the ${fileType} file?`,
        default: defaultFilename
      }),
    tsConfig: () =>
      input({
        message:
          'What is the path to your tsconfig.json file? (leave empty if you do not use one)',
        default: 'tsconfig.json'
      }),
    isMonorepo: () => confirm({ message: 'Is this a monorepo?' }),
    includeOnly: (defaultIncludes: string) =>
      input({
        message:
          'What glob pattern(s) do you want to include? (Comma separated for multiple)',
        default: defaultIncludes
      }),
    nativeRules: () =>
      checkbox({
        message:
          'Which (if any) of the native rule sets do you want to disable?',
        choices: Obj.keys(rules.forbidden.definitions).map((name) => ({
          name: rules.forbidden.definitions[name].META.name,
          description: rules.forbidden.definitions[name].META.comment,
          value: { [name]: false }
        }))
      }),
    outDir: () =>
      input({
        message:
          'Where do you want to put generated artifacts (graphs and reports)?',
        default: defaultConfig.options.outputTo
      }),
    graph: async (): Promise<false | output.GraphCfg> => {
      const type = await select<'disabled' | output.Graph>({
        message: 'What type of graph do you want to generate?',
        choices: ['disabled', ...output.keys.graph],
        default: defaultConfig.options.graph.type
      });
      if (type === 'disabled') return false;
      const toSvg =
        output.is.dotGraph(type) ?
          await confirm({ message: 'Do you want the graph in SVG format?' })
        : false;
      const fileName = await input({
        message: 'What do you want to name the graph file?',
        default: defaultConfig.options.graph.fileName
      });
      return { type, toSvg, fileName };
    },
    report: async (): Promise<false | output.ReportCfg> => {
      const type = await select<'disabled' | output.Report>({
        message: 'What type of report do you want to generate?',
        choices: ['disabled', ...output.keys.report],
        default: defaultConfig.options.report.type
      });
      if (type === 'disabled') return false;
      const fileName = await input({
        message: 'What do you want to name the report file?',
        default: defaultConfig.options.report.fileName
      });
      return { type, fileName };
    },
    logType: async (): Promise<false | output.Loggable> => {
      const result = await select<'disabled' | output.Loggable>({
        message: 'What format do you want the log output to be in?',
        choices: ['disabled', ...output.keys.loggable],
        default: defaultConfig.options.log
      });
      return result === 'disabled' ? false : result;
    },
    runCruise: () => confirm({ message: 'Do you want to run it now?' })
  };
  /* c8 ignore end */

  async dotToSvg(
    cruiseResult: ICruiseResult,
    dotType: output.DotGraph
  ): Promise<string> {
    return (
      await this.execWithStdio(['dot', ['-T', 'svg']], 'pipe', {
        execaOpts: {
          input: await format(cruiseResult, { outputType: dotType })
        }
      })
    ).stdout;
  }

  async emitActionsSummary(prBaseSha: string): Promise<void> {
    const outputFile = process.env.GITHUB_STEP_SUMMARY;
    if (!outputFile) {
      this.warn(
        'GITHUB_STEP_SUMMARY not set, cannot emit GitHub Actions summary.'
      );
      return;
    }
    const { result, output: out } = await cruise(['.'], {
      flags: { affected: prBaseSha, noOutput: true }
    });
    const mermaidGraph = await format(result, {
      outputType: 'mermaid',
      reaches: out.formatting.reaches as string
    });
    await fs.appendFile(
      outputFile,
      `# Modules changed and affected by this PR
\`\`\`mermaid
${mermaidGraph}
\`\`\``
    );
  }

  async initConfig(overwriteBehavior: file.write.OverwriteBehavior = 'force') {
    const isTs = await this.prompt.isTs();
    const fileName = await this.prompt.fileName(
      'config',
      'depcruiser.config' + (isTs ? '.ts' : '.js')
    );
    const tsConfig = isTs ? await this.prompt.tsConfig() : undefined;

    const isMonorepo = await this.prompt.isMonorepo();
    const defaultIncludes = isMonorepo ? 'packages/**/src/**' : 'src/**';
    const includeOnly = await this.prompt.includeOnly(defaultIncludes);
    const nativeRules = (await this.prompt.nativeRules()).reduce(
      (acc, curr) => ({ ...acc, ...curr }),
      {}
    );
    const outputTo = await this.prompt.outDir();
    const graph = await this.prompt.graph();
    const report = await this.prompt.report();
    const log = await this.prompt.logType();

    const cfg: InputConfig = {
      configFileName: fileName,
      options: {
        outputTo,
        graph,
        log,
        report,
        doNotFollow: { path: defaultConfig.options.doNotFollow.path },
        includeOnly: { path: Str.split.csv(includeOnly) },
        combinedDependencies: isMonorepo,
        ...utils.normalize.nestWhen('tsConfig', tsConfig, {
          fileName: tsConfig
        })
      },
      forbidden: { ...defaultConfig.forbidden, ...nativeRules },
      extendForbidden: [],
      allowed: [],
      extends: [],
      required: []
    };
    await file.write.file(
      fileName,
      `import { config } from '@toolbox-ts/depcruiser';

const cfg = config(${JSON.stringify(cfg, null, 2)});

export default cfg;
`,
      {
        overwrite: {
          behavior: overwriteBehavior,
          /* c8 ignore start */
          promptFn: () =>
            confirm({
              message: `Config file already exists. Overwrite?`,
              default: false
            })
        }
        /* c8 ignore end */
      }
    );
    this.log(`Wrote ${fileName}`);
    return await this.prompt.runCruise();
  }

  public async run(): Promise<void> {
    const { args, flags: _flags } = await this.parse(DependencyCruiser);
    if (_flags.init) {
      const runNow = await this.initConfig();
      if (!runNow || !args.scan) return;
      this.cache.clear();
    }
    if (!args.scan) {
      await DependencyCruiser.run(['--help']);
      return;
    }

    if (typeof _flags.emitActionsSummary === 'string')
      await this.emitActionsSummary(_flags.emitActionsSummary);
    const cfg = await this.cache.get();
    const { output: out, result } = await cruise([args.scan], {
      input: cfg,
      flags: _flags
    });

    if (out.log) this.log(await format(result, { outputType: out.log }));

    if (out.report)
      await this.write({
        cruiseResult: result,
        filePath: out.report.outPath,
        outputType: out.report.type,
        overwriteBehavior: out.overwriteBehavior,
        formatOpts: out.formatting
      });
    if (out.graph) {
      const outputResult =
        out.graph.outPath.endsWith('.svg') ?
          await this.dotToSvg(result, out.graph.type as output.DotGraph)
        : result;
      await this.write({
        cruiseResult: outputResult,
        filePath: out.graph.outPath,
        outputType: out.graph.type,
        overwriteBehavior: out.overwriteBehavior,
        formatOpts: out.formatting
      });
    }
  }

  private async write({
    cruiseResult,
    filePath,
    outputType,
    overwriteBehavior,
    formatOpts
  }: {
    cruiseResult: ICruiseResult | string;
    filePath: string;
    formatOpts?: Partial<IFormattingOptions>;
    outputType: output.Graph | output.Report;
    overwriteBehavior: file.write.OverwriteBehavior;
  }): Promise<void> {
    await file.write.file(
      filePath,
      typeof cruiseResult === 'string' ? cruiseResult : (
        await format(cruiseResult, { outputType, ...formatOpts })
      ),
      {
        overwrite: {
          behavior: overwriteBehavior,
          /* c8 ignore start */
          promptFn: () =>
            confirm({
              message: `The graph at ${filePath} already exists. Overwrite?`,
              default: false
            })
          /* c8 ignore end */
        }
      }
    );
  }
}
