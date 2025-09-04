import { mockConsole } from '@toolbox-ts/test-utils';
import fs from 'node:fs/promises';
import path from 'node:path';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { cruise, format, loadConfig } from '../../api/index.ts';
import { DependencyCruiser } from './depcruiser.js';
mockConsole.stub();
vi.mock('../../api/index.js', async () => {
  const actual = await vi.importActual<any>('../../api/index.js');
  return { ...actual, cruise: vi.fn(), format: vi.fn(), loadConfig: vi.fn() };
});
describe('DependencyCruiser CLI', () => {
  const cwd = '/';
  const cfgFileName = 'depcruiser.config.ts';
  const outDir = path.join(cwd, 'out');
  const instance = new DependencyCruiser([], {} as any);
  const mockPrompts = {
    overwrite: vi.spyOn(instance.prompt, 'overwrite').mockResolvedValue(true),
    isTs: vi.spyOn(instance.prompt, 'isTs').mockResolvedValue(false),
    fileName: vi
      .spyOn(instance.prompt, 'fileName')
      .mockResolvedValue(cfgFileName),
    isMonorepo: vi
      .spyOn(instance.prompt, 'isMonorepo')
      .mockResolvedValue(false),
    includeOnly: vi.spyOn(instance.prompt, 'includeOnly'),
    nativeRules: vi.spyOn(instance.prompt, 'nativeRules').mockResolvedValue([]),
    graph: vi
      .spyOn(instance.prompt, 'graph')
      .mockResolvedValue({
        type: 'dot',
        fileName: 'dependency-graph',
        toSvg: false
      }),
    report: vi
      .spyOn(instance.prompt, 'report')
      .mockResolvedValue({ type: 'json', fileName: 'dependency-report' }),
    logType: vi.spyOn(instance.prompt, 'logType').mockResolvedValue('json'),
    tsConfig: vi
      .spyOn(instance.prompt, 'tsConfig')
      .mockResolvedValue('tsconfig.json'),
    outDir: vi.spyOn(instance.prompt, 'outDir').mockResolvedValue('out')
  };
  const cwdSpy = vi.spyOn(process, 'cwd').mockReturnValue(outDir);
  const readFile = async (fileName: string = cfgFileName) =>
    await fs.readFile(path.join(outDir, fileName), 'utf8');
  beforeEach(async () => {
    await fs.rm(outDir, { recursive: true, force: true });
    await fs.mkdir(outDir, { recursive: true });
  });
  describe('init', () => {
    it('handles ts project', async () => {
      mockPrompts.isTs.mockResolvedValueOnce(true);
      await instance.initConfig('force');
      expect(await readFile())
        .includes('tsconfig.json')
        .includes('depcruiser.config.ts');
    });
    it('handles js project', async () => {
      mockPrompts.isTs.mockResolvedValueOnce(false);
      mockPrompts.fileName.mockResolvedValueOnce('depcruiser.config.js');
      await instance.initConfig('force');
      expect(await readFile('depcruiser.config.js'))
        .includes('depcruiser.config.js')
        .not.includes('tsconfig.json');
    });
    it('handles monorepo', async () => {
      mockPrompts.isMonorepo.mockResolvedValueOnce(true);
      mockPrompts.includeOnly.mockResolvedValueOnce('packages/**/src/**');
      await instance.initConfig('force');
      expect(await readFile()).includes('packages/**/src/**');
    });
    it('handles non-monorepo', async () => {
      mockPrompts.isMonorepo.mockResolvedValueOnce(false);
      mockPrompts.includeOnly.mockResolvedValueOnce('src/**');
      await instance.initConfig('force');
      expect(await readFile()).includes('src/**');
    });
    it('handles nativeRules', async () => {
      mockPrompts.nativeRules.mockResolvedValueOnce([
        { noCircular: false },
        { noOrphans: false }
      ]);
      await instance.initConfig('force');
      expect(await readFile())
        .includes('noCircular')
        .includes('noOrphans');
    });
    it('parses includeOnly as comma separated list', async () => {
      mockPrompts.includeOnly.mockResolvedValueOnce(
        'src/**,packages/**/src/**'
      );
      await instance.initConfig('force');
      console.log(await readFile());
      expect(await readFile())
        .includes('src/**')
        .includes('packages/**/src/**');
    });
  });
  describe('run', () => {
    const mockCruise = vi.mocked(cruise);
    const mockFormat = vi.mocked(format);
    const mockLoadConfig = vi.mocked(loadConfig);

    it('with --init and runCruise=false returns early (no cruise, no loadConfig)', async () => {
      const cmd = new DependencyCruiser([], {} as any);

      // init() prompt flow
      vi.spyOn(cmd.prompt, 'isTs').mockResolvedValue(false);
      vi.spyOn(cmd.prompt, 'fileName').mockResolvedValue(
        'depcruiser.config.js'
      );
      vi.spyOn(cmd.prompt, 'tsConfig').mockResolvedValue('tsconfig.json');
      vi.spyOn(cmd.prompt, 'isMonorepo').mockResolvedValue(false);
      vi.spyOn(cmd.prompt, 'includeOnly').mockResolvedValue('src/**');
      vi.spyOn(cmd.prompt, 'nativeRules').mockResolvedValue([]);
      vi.spyOn(cmd.prompt, 'outDir').mockResolvedValue('out');
      vi.spyOn(cmd.prompt, 'graph').mockResolvedValue(false);
      vi.spyOn(cmd.prompt, 'report').mockResolvedValue(false);
      vi.spyOn(cmd.prompt, 'logType').mockResolvedValue(false as any);
      vi.spyOn(cmd.prompt, 'runCruise').mockResolvedValue(false);

      // Inject --init
      vi.spyOn(cmd as any, 'parse').mockResolvedValueOnce({
        args: { scan: '.' },
        flags: { init: true }
      });

      await cmd.run();

      expect(mockCruise).not.toHaveBeenCalled();
      expect(mockLoadConfig).not.toHaveBeenCalled();
      const cfg = await fs.readFile(
        path.join(outDir, 'depcruiser.config.js'),
        'utf8'
      );
      expect(cfg).toContain('export default cfg;');
    });

    it('with --init and runCruise=true (non-TS, toSvg=false) loads config, cruises, writes .dot', async () => {
      const cmd = new DependencyCruiser([], {} as any);
      vi.spyOn(cmd.prompt, 'isTs').mockResolvedValue(false);
      vi.spyOn(cmd.prompt, 'fileName').mockResolvedValue(
        'depcruiser.config.js'
      );
      vi.spyOn(cmd.prompt, 'isMonorepo').mockResolvedValue(false);
      vi.spyOn(cmd.prompt, 'includeOnly').mockResolvedValue('src/**');
      vi.spyOn(cmd.prompt, 'nativeRules').mockResolvedValue([]);
      vi.spyOn(cmd.prompt, 'outDir').mockResolvedValue('out');
      vi.spyOn(cmd.prompt, 'graph').mockResolvedValue({
        type: 'dot',
        toSvg: false,
        fileName: 'graph.dot'
      });
      vi.spyOn(cmd.prompt, 'report').mockResolvedValue(false);
      vi.spyOn(cmd.prompt, 'logType').mockResolvedValue(false as any);
      vi.spyOn(cmd.prompt, 'runCruise').mockResolvedValue(true);
      vi.spyOn(cmd as any, 'parse').mockResolvedValueOnce({
        args: { scan: 'src' },
        flags: { init: true }
      });

      mockLoadConfig.mockResolvedValueOnce({ loaded: true } as any);
      const fakeResult = { modules: [{ source: 'a' }], summary: {} } as any;
      const graphDotPath = path.join(outDir, 'graph.dot');

      mockFormat.mockImplementation((res: any, opts: any) =>
        opts.outputType === 'dot' ?
          'GRAPH_FORMAT'
        : (JSON.stringify({ res, opts }) as any)
      );
      mockCruise.mockResolvedValueOnce({
        output: {
          log: false,
          report: false,
          graph: { type: 'dot', outPath: graphDotPath },
          overwriteBehavior: 'force',
          formatting: {}
        },
        result: fakeResult,
        exitCode: 0
      });

      const execSpy = vi.spyOn(cmd as any, 'execWithStdio');

      await cmd.run();

      expect(mockLoadConfig).toHaveBeenCalledTimes(1);
      expect(mockCruise).toHaveBeenCalledTimes(1);
      expect(execSpy).not.toHaveBeenCalled();

      const cfg = await fs.readFile(
        path.join(outDir, 'depcruiser.config.js'),
        'utf8'
      );
      expect(cfg).toContain('export default cfg;');
      expect(cfg).not.toContain('"tsConfig"');

      const graphContent = await fs.readFile(graphDotPath, 'utf8');
      expect(graphContent).toBe('GRAPH_FORMAT');
    });

    it('no --init: logs json, writes report, and writes svg graph (dotToSvg path)', async () => {
      const cmd = new DependencyCruiser([], {} as any);

      vi.spyOn(cmd as any, 'parse').mockResolvedValueOnce({
        args: { scan: 'pkg' },
        flags: {}
      });

      const fakeResult = { modules: [], summary: {} } as any;
      mockFormat.mockImplementation((_res: any, opts: any): any => {
        if (opts.outputType === 'dot') return 'DOT_CONTENT';
        if (opts.outputType === 'json') return 'JSON_FORMAT';
        return 'OTHER_FORMAT';
      });

      const reportPath = path.join(outDir, 'report.json');
      const graphSvgPath = path.join(outDir, 'graph.svg');
      mockCruise.mockResolvedValueOnce({
        output: {
          log: 'json',
          report: { type: 'json', outPath: reportPath },
          graph: { type: 'dot', outPath: graphSvgPath },
          overwriteBehavior: 'force',
          formatting: {}
        },
        result: fakeResult,
        exitCode: 0
      });

      const execSpy = vi
        .spyOn(cmd as any, 'execWithStdio')
        .mockResolvedValue({ stdout: '<svg>ok</svg>' } as any);
      const logSpy = vi.spyOn(cmd as any, 'log');

      await cmd.run();

      expect(logSpy).toHaveBeenCalledWith('JSON_FORMAT');

      const reportContent = await fs.readFile(reportPath, 'utf8');
      expect(reportContent).toBe('JSON_FORMAT');

      expect(execSpy).toHaveBeenCalledWith(
        ['dot', ['-T', 'svg']],
        'pipe',
        expect.objectContaining({
          execaOpts: expect.objectContaining({ input: 'DOT_CONTENT' })
        })
      );

      const svg = await fs.readFile(graphSvgPath, 'utf8');
      expect(svg).toBe('<svg>ok</svg>');
    });

    it('no --init: non-svg graph uses format() directly (no dotToSvg)', async () => {
      const cmd = new DependencyCruiser([], {} as any);

      vi.spyOn(cmd as any, 'parse').mockResolvedValueOnce({
        args: { scan: '.' },
        flags: {}
      });

      const fakeResult = { modules: [{ source: 'a' }], summary: {} } as any;
      mockFormat.mockImplementation((_res: any, opts: any): any => {
        if (opts.outputType === 'dot') return 'GRAPH_FORMAT';
        return 'OTHER';
      });

      const graphDotPath = path.join(outDir, 'graph.dot');
      mockCruise.mockResolvedValueOnce({
        output: {
          log: false,
          report: false,
          graph: { type: 'dot', outPath: graphDotPath },
          overwriteBehavior: 'force',
          formatting: {}
        },
        result: fakeResult,
        exitCode: 0
      });

      const execSpy = vi.spyOn(cmd as any, 'execWithStdio');

      await cmd.run();

      expect(execSpy).not.toHaveBeenCalled();
      const graph = await fs.readFile(graphDotPath, 'utf8');
      expect(graph).toBe('GRAPH_FORMAT');
    });
  });
});
