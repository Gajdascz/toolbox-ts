import file from '@toolbox-ts/file';
import path from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import { list } from 'watskeburt';

import type { ResolvedCruiseOptions } from '../../../../definitions/index.js';

import { resolve, resolveOptions } from './options.ts';
vi.mock('watskeburt', () => ({ list: vi.fn() }));
const listSpy = vi.spyOn(await import('watskeburt'), 'list');
vi.mock('dependency-cruiser/config-utl/extract-webpack-resolve-config', () => ({
  default: vi.fn().mockReturnValue({ dummyWebpackConfig: true })
}));

vi.mock('dependency-cruiser/config-utl/extract-ts-config', () => ({
  default: vi.fn().mockImplementation((fileName: string) => {
    // return a dummy object that includes the fileName so we can assert on it
    return { dummyTsConfig: true, fileName };
  })
}));

const findFileSpy = vi.spyOn(file.find, 'firstUp');

const repoRoot = process.cwd();
const tsConfigName = 'vitest.tsconfig.json';
const babelConfigName = 'vitest.babel.json';
const mockedList = vi.mocked(list);

describe('resolve', () => {
  describe('graph', () => {
    it('produces .svg outPath for dot graphs when toSvg is true', () => {
      const out = resolve.graph({
        type: 'dot',
        toSvg: true,
        fileName: 'graphfile',
        outDir: '/tmp/outdir'
      } as any);
      expect(out.type).toBe('dot');
      expect(out.outPath).toContain('/tmp/outdir');
      expect(out.outPath).toContain('graphfile');
      expect(out.outPath.endsWith('.svg')).toBe(true);
    });
    it('does not force .svg for non-dot graph types', () => {
      const out = resolve.graph({
        type: 'mermaid',
        toSvg: true,
        fileName: 'graphfile',
        outDir: '/some/out'
      } as any);
      expect(out.type).toBe('mermaid');
      expect(out.outPath).toContain('/some/out');
      expect(out.outPath).toContain('graphfile');
      expect(out.outPath.endsWith('.svg')).toBe(false);
    });
  });
  describe('report', () => {
    it('builds report outPath using outDir and fileName', () => {
      const rep = resolve.report({
        type: 'json',
        fileName: 'myreport',
        outDir: '/reports'
      } as any);
      expect(rep.type).toBe('json');
      expect(rep.outPath).toContain('/reports');
      expect(rep.outPath).toContain('myreport');
      // basic sanity: includes extension
      expect(path.extname(rep.outPath).length).toBeGreaterThan(0);
    });
  });
  describe('depcruiserResolveOptions', () => {
    it('returns undefined when no webpackConfig provided', async () => {
      const res = await resolveOptions({
        base: { outputTo: '/tmp' } as any,
        cruiseOptions: {}
      });
      expect(res.resolveOptions).toBeUndefined();
      expect(res.transpileOptions).toBeUndefined();
      expect(res.output).toBeDefined();
      expect(res.cruiseOptions).toBeDefined();
    });
    it('throws when fileName provided but file not found', async () => {
      findFileSpy.mockResolvedValueOnce(null);
      await expect(
        resolveOptions({
          base: { outputTo: '/tmp' } as any,
          cruiseOptions: {
            webpackConfig: { fileName: 'this-file-does-not-exist.js' }
          }
        })
      ).rejects.toThrow();
    });

    it('returns webpack resolve config when fileName provided and found', async () => {
      findFileSpy.mockResolvedValueOnce('/some/path/that/exists.js');
      const res = await resolveOptions({
        base: { outputTo: '/tmp' } as any,
        cruiseOptions: { webpackConfig: { fileName: 'this-file-exists.js' } }
      });
      expect(res.resolveOptions).toBeDefined();
      expect((res.resolveOptions as any).dummyWebpackConfig).toBe(true);
    });
  });
  describe('depcruiserTranspileOptions', () => {
    it('returns undefined when no opts provided', async () => {
      await expect(resolve.depcruiserTranspileOptions(undefined)).resolves.toBe(
        undefined
      );
    });
    it('throws when tsConfig file not found', async () => {
      await expect(
        resolveOptions({
          base: {
            outputTo: '/tmp',

            tsConfig: { fileName: 'this-file-does-not-exist.tsconfig' }
          } as any,
          cruiseOptions: {}
        })
      ).rejects.toThrow();
    });
    it('throws when babelConfig file not found', async () => {
      findFileSpy.mockResolvedValueOnce('/some/path/that/exists.tsconfig');
      await expect(
        resolveOptions({
          base: {
            outputTo: '/tmp',
            tsConfig: { fileName: 'this-file-exists.tsconfig' },
            babelConfig: { fileName: 'this-file-does-not-exist.babelrc' }
          } as any,
          cruiseOptions: {}
        })
      ).rejects.toThrow();
    });
    it('reads real tsconfig and babel config files when present', async () => {
      // create minimal tsconfig and babel config files at repo root so file.find.firstUp can locate them
      const tsPath = path.join(repoRoot, tsConfigName);
      const babelPath = path.join(repoRoot, babelConfigName);
      findFileSpy
        .mockResolvedValueOnce(tsPath)
        .mockResolvedValueOnce(babelPath);
      const out = await resolveOptions({
        base: {
          outputTo: '/tmp',
          // reference by name so firstUp can find it
          tsConfig: { fileName: tsConfigName },
          babelConfig: { fileName: babelConfigName }
        } as any,
        cruiseOptions: {}
      });

      // transpileOptions should be present and include tsConfig (object) and babelConfig with resolved fileName
      expect(out.transpileOptions).toBeDefined();
      expect((out.transpileOptions as any).tsConfig).toBeDefined();
      expect((out.transpileOptions as any).babelConfig).toBeDefined();
      // babelConfig.fileName should be a path that ends with our created file name
      expect(
        ((out.transpileOptions as any).babelConfig.fileName as string).endsWith(
          babelConfigName
        )
      ).toBe(true);
    });
  });
  describe('ruleSet', () => {
    it('handles forbidden', () => {
      const base = {
        ruleSet: {
          forbidden: [
            { name: 'base-only', severity: 'error', from: {}, to: {} }
          ]
        }
      } as any;
      const cruiseOptions = {
        ruleSet: {
          forbidden: [{ name: 'opts-only', severity: 'warn', from: {}, to: {} }]
        }
      } as any;

      const out = resolve.ruleSet(base.ruleSet, cruiseOptions.ruleSet);
      expect(out.forbidden.length).toBe(2);
      expect(out.forbidden.find((r) => r.name === 'base-only')).toBeDefined();
      expect(out.forbidden.find((r) => r.name === 'opts-only')).toBeDefined();
      const out2 = resolve.ruleSet({}, cruiseOptions.ruleSet);
      expect(out2.forbidden.length).toBe(1);
      expect(out2.forbidden[0].name).toBe('opts-only');
    });
    it('handles allowed', () => {
      const base = {
        ruleSet: {
          allowed: [
            {
              name: 'base-only',
              severity: 'error',
              from: { path: 'a' },
              to: { path: 'b' }
            }
          ]
        }
      } as any;
      const cruiseOptions = {
        ruleSet: {
          allowed: [
            {
              name: 'opts-only',
              severity: 'warn',
              from: { path: 'c' },
              to: { path: 'd' }
            }
          ]
        }
      } as any;
      const out = resolve.ruleSet(base.ruleSet, cruiseOptions.ruleSet);
      expect(out.allowed.length).toBe(2);
      expect(out.allowed.find((r) => r.from.path === 'a')).toBeDefined();
      expect(out.allowed.find((r) => r.to.path === 'd')).toBeDefined();
      const out2 = resolve.ruleSet({}, cruiseOptions.ruleSet);
      expect(out2.allowed.length).toBe(1);
      expect(out2.allowed[0].to.path).toBe('d');
    });
    it('handles required', () => {
      const base = {
        ruleSet: {
          required: [
            {
              name: 'base-only',
              severity: 'error',
              from: { path: 'a' },
              to: { path: 'b' }
            }
          ]
        }
      } as any;
      const cruiseOptions = {
        ruleSet: {
          required: [
            {
              name: 'opts-only',
              severity: 'warn',
              from: { path: 'c' },
              to: { path: 'd' }
            }
          ]
        }
      } as any;
      const out = resolve.ruleSet(base.ruleSet, cruiseOptions.ruleSet);
      expect(out.required.length).toBe(2);
      expect(out.required.find((r) => r.name === 'base-only')).toBeDefined();
      expect(out.required.find((r) => r.name === 'opts-only')).toBeDefined();
      const out2 = resolve.ruleSet({}, cruiseOptions.ruleSet);
      expect(out2.required.length).toBe(1);
      expect(out2.required[0].name).toBe('opts-only');
    });
    it('handles allowedSeverity', () => {
      const base = { ruleSet: { allowedSeverity: 'error' } } as any;
      const cruiseOptions = { ruleSet: { allowedSeverity: 'warn' } } as any;
      const out = resolve.ruleSet(base.ruleSet, cruiseOptions.ruleSet);
      expect(out.allowedSeverity).toBe('warn');
    });
  });
  describe('reaches', () => {
    it('returns undefined when neither affected nor reaches provided', async () => {
      const out = await resolve.reaches({});
      expect(out).toBeUndefined();
    });
    it('returns undefined when empty string provided as affected and no reaches', async () => {
      const out = await resolve.reaches({ affected: '' });
      expect(out).toBeUndefined();
    });

    it('returns undefined when empty string provided as reaches and empty string as affected', async () => {
      const out = await resolve.reaches({ affected: '', reaches: '' });
      expect(out).toBeUndefined();
    });
    it('returns list of modules when affected provided', async () => {
      listSpy.mockResolvedValue('a,b,c');
      const out = await resolve.reaches({ affected: 'src/cli/index.ts' });
      expect(out).toBeDefined();
      expect(out.length).toBeGreaterThan(0);
    });
    it('returns list of modules when reaches provided', async () => {
      listSpy.mockResolvedValue('a,b,c');
      const out = await resolve.reaches({ reaches: 'src/cli/index.ts' });
      expect(out).toBeDefined();
      expect(out.length).toBeGreaterThan(0);
    });
  });
});

describe('resolveOptions', () => {
  it('merges base and cruiseOptions and resolves outputs', async () => {
    const base = {
      outputTo: '/outdir',
      graph: { type: 'dot', toSvg: true, fileName: 'g' },
      report: { type: 'json', fileName: 'r' }
    } as any;
    const cruiseOptions: Partial<ResolvedCruiseOptions> = {
      collapse: 3,
      ruleSet: { forbidden: [] }
    };

    const out = await resolveOptions({ base, cruiseOptions });
    expect(out.output.graph).toBeDefined();
    expect((out.output.graph as any).outPath).toContain('/outdir');
    expect(out.output.report).toBeDefined();
    expect((out.output.report as any).outPath).toContain('/outdir');
    expect(out.output.formatting).toBeDefined();
    expect((out.cruiseOptions as any).collapse).toBe(3);
  });
});
