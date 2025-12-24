import fs from 'node:fs/promises';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { $pnpm } from '../../../shell-exec.ts';
import { createPackageJsonOps } from './package-json.ts';
vi.mock('../../shell-exec.ts', async (importActual) => {
  return { ...(await importActual()), $shell: vi.fn(), $pnpm: vi.fn() };
});
vi.mock('@toolbox-ts/file', async (importActual) => {
  return {
    ...(await importActual()),
    writeFile: vi.fn(async (path: string, content) =>
      fs.writeFile(path, JSON.stringify(content))
    )
  };
});
const NAME = '@mocked/package';
const VERSION = '1.2.3';
const SCRIPTS = {
  'test:script1': 'echo "Test Script 1"',
  'test:script2': 'echo "Test Script 2"',
  build: 'tsc -b',
  start: 'node ./dist/index.js',
  lint: 'eslint .',
  format: 'prettier --write .',
  test: 'vitest'
};

const DEPS = {
  'example-dep': '^1.0.0',
  'another-dep': '^2.0.0',
  zedep: '^3.0.0',
  _adep: '^4.0.0',
  '@scoped/dep': '^5.0.0',
  '@zcoped/dep': '^6.0.0'
};

const DEV_DEPS = { ...DEPS };
const OPTIONAL_DEPS = { ...DEPS };

describe('Package Json Ops', () => {
  const mockedPnpm = vi.mocked($pnpm);
  const setMockPnpmResolvedOnce = (stdout = '') => {
    mockedPnpm.mockResolvedValueOnce({ stdout } as any);
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    await fs.writeFile(
      '/package.json',
      JSON.stringify({
        name: NAME,
        version: VERSION,
        scripts: SCRIPTS,
        dependencies: DEPS,
        devDependencies: DEV_DEPS,
        optionalDependencies: OPTIONAL_DEPS
      })
    );
  });
  it('should throw error if package.json not found', async () => {
    await expect(createPackageJsonOps('/no-pkg-json')).rejects.toThrow();
  });

  describe('general commands', () => {
    describe('set', () => {
      it('should set string and object properties', async () => {
        setMockPnpmResolvedOnce();
        const ops = await createPackageJsonOps('/');
        await ops.set([
          ['name', '@test/package'],
          ['version', '2.0.0']
        ]);
        expect(mockedPnpm).toHaveBeenCalledWith(
          'pkg set name=@test/package version=2.0.0 --json',
          { cwd: '/' }
        );

        await ops.set([
          ['repository', { type: 'git', url: 'https://github.com/test/repo' }]
        ]);
        expect(mockedPnpm).toHaveBeenCalledWith(
          'pkg set repository={"type":"git","url":"https://github.com/test/repo"} --json',
          { cwd: '/' }
        );
      });
    });
    describe('delete', () => {
      it('should delete specified properties', async () => {
        setMockPnpmResolvedOnce();
        const ops = await createPackageJsonOps('/');
        await ops.delete(['repository', 'keywords']);
        expect(mockedPnpm).toHaveBeenCalledWith(
          'pkg delete repository keywords --json',
          { cwd: '/' }
        );
      });

      it('should be no-op when no properties provided', async () => {
        const ops = await createPackageJsonOps('/');
        await ops.delete([]);
        expect(mockedPnpm).not.toHaveBeenCalled();
      });
    });
  });

  describe('Scripts', () => {
    describe('get', () => {
      it('should return all scripts when no names provided', async () => {
        setMockPnpmResolvedOnce(JSON.stringify(SCRIPTS));
        const ops = await createPackageJsonOps('/');
        const scripts = await ops.scripts.get();
        expect(scripts).toEqual(SCRIPTS);
        expect(mockedPnpm).toHaveBeenCalledWith('pkg get scripts --json', {
          cwd: '/'
        });
      });

      it('should return selected scripts when names provided', async () => {
        setMockPnpmResolvedOnce(JSON.stringify(SCRIPTS));
        const ops = await createPackageJsonOps('/');
        const subset = await ops.scripts.get(['build', 'test']);
        expect(subset).toEqual({ build: 'tsc -b', test: 'vitest' });
      });
      it('set: should set multiple scripts in a single pnpm call', async () => {
        setMockPnpmResolvedOnce('');
        const ops = await createPackageJsonOps('/');
        await ops.scripts.set([
          ['newScript', 'echo "new"'],
          ['another', 'echo "test"']
        ]);
        expect(mockedPnpm).toHaveBeenCalledWith(
          expect.stringContaining(
            'pkg set scripts.newScript=echo "new" scripts.another=echo "test" --json'
          ),
          { cwd: '/' }
        );
      });
      it('find: should find scripts by name or command substring', async () => {
        setMockPnpmResolvedOnce(JSON.stringify(SCRIPTS));
        const ops = await createPackageJsonOps('/');
        const found = await ops.scripts.find('test');
        expect(found).toContainEqual(['test:script1', 'echo "Test Script 1"']);
        expect(found).toContainEqual(['test:script2', 'echo "Test Script 2"']);
        expect(found).toContainEqual(['test', 'vitest']);
      });

      it('sort: should sort scripts and set them', async () => {
        setMockPnpmResolvedOnce(); // set call

        const ops = await createPackageJsonOps('/');
        await ops.scripts.sort();
        expect(mockedPnpm).toHaveBeenCalledWith(
          expect.stringContaining('pkg set scripts='),
          { cwd: '/' }
        );
      });

      it('delete: should delete specified scripts', async () => {
        setMockPnpmResolvedOnce(); // delete call
        const ops = await createPackageJsonOps('/');
        await ops.scripts.delete(['test:script1', 'test:script2']);
        expect(mockedPnpm).toHaveBeenCalledWith(
          'pkg delete scripts.test:script1 scripts.test:script2 --json',
          { cwd: '/' }
        );
      });
    });
  });

  describe('Config', () => {
    const CONFIG = { port: '3000', env: 'development' };
    describe('get', () => {
      it('should get all config when no names provided', async () => {
        setMockPnpmResolvedOnce(JSON.stringify(CONFIG));
        const ops = await createPackageJsonOps('/');
        const cfg = await ops.config.get();
        expect(cfg).toEqual(CONFIG);
        expect(mockedPnpm).toHaveBeenCalledWith('pkg get config --json', {
          cwd: '/'
        });
      });
      it('should return subset when names provided', async () => {
        setMockPnpmResolvedOnce(JSON.stringify(CONFIG));
        const ops = await createPackageJsonOps('/');
        const subset = await ops.config.get(['port', 'env']);
        expect(subset).toEqual(CONFIG);
      });
    });
    it('set: should set simple and object config values', async () => {
      setMockPnpmResolvedOnce();
      const ops = await createPackageJsonOps('/');
      await ops.config.set([['port', '8080']]);
      expect(mockedPnpm).toHaveBeenCalledWith(
        'pkg set config.port=8080 --json',
        { cwd: '/' }
      );

      await ops.config.set([['options', { debug: true }]]);
      expect(mockedPnpm).toHaveBeenCalledWith(
        'pkg set config.options={"debug":true} --json',
        { cwd: '/' }
      );
    });
  });

  describe('Dependencies', () => {
    it('get: should get dependencies of various types', async () => {
      setMockPnpmResolvedOnce(JSON.stringify(DEPS));
      const ops = await createPackageJsonOps('/');
      const deps = await ops.deps.get('dependencies');
      expect(deps).toEqual(DEPS);
      expect(mockedPnpm).toHaveBeenCalledWith('pkg get dependencies --json', {
        cwd: '/'
      });

      setMockPnpmResolvedOnce(JSON.stringify(DEV_DEPS));
      const devDeps = await ops.deps.get('devDependencies');
      expect(devDeps).toEqual(DEV_DEPS);

      setMockPnpmResolvedOnce(JSON.stringify(OPTIONAL_DEPS));

      const optDeps = await ops.deps.get('optionalDependencies');
      expect(optDeps).toEqual(OPTIONAL_DEPS);

      const peerDeps = { react: '^18.0.0' };
      setMockPnpmResolvedOnce(JSON.stringify(peerDeps));
      const p = await ops.deps.get('peerDependencies');
      expect(p).toEqual(peerDeps);
    });

    it('sort: should sort and set dependencies for all types', async () => {
      // returns for get calls
      mockedPnpm
        .mockResolvedValueOnce({ stdout: JSON.stringify(DEPS) } as any)
        .mockResolvedValueOnce({ stdout: JSON.stringify(DEV_DEPS) } as any)
        .mockResolvedValueOnce({ stdout: JSON.stringify(OPTIONAL_DEPS) } as any)
        .mockResolvedValueOnce({ stdout: JSON.stringify({}) } as any)
        // then resolve for the set operations
        .mockResolvedValue({} as any);

      const ops = await createPackageJsonOps('/');
      await ops.deps.sort();

      expect(mockedPnpm).toHaveBeenCalledWith('pkg get dependencies --json', {
        cwd: '/'
      });
      expect(mockedPnpm).toHaveBeenCalledWith(
        'pkg get devDependencies --json',
        { cwd: '/' }
      );
      expect(mockedPnpm).toHaveBeenCalledWith(
        'pkg get optionalDependencies --json',
        { cwd: '/' }
      );
      expect(mockedPnpm).toHaveBeenCalledWith(
        'pkg get peerDependencies --json',
        { cwd: '/' }
      );

      expect(mockedPnpm).toHaveBeenCalledWith(
        expect.stringContaining('pkg set dependencies='),
        { cwd: '/' }
      );
      expect(mockedPnpm).toHaveBeenCalledWith(
        expect.stringContaining('pkg set devDependencies='),
        { cwd: '/' }
      );
      expect(mockedPnpm).toHaveBeenCalledWith(
        expect.stringContaining('pkg set optionalDependencies='),
        { cwd: '/' }
      );
      expect(mockedPnpm).toHaveBeenCalledWith(
        expect.stringContaining('pkg set peerDependencies='),
        { cwd: '/' }
      );
    });
  });
  it('should merge two partial package.json configs', async () => {
    setMockPnpmResolvedOnce();
    const ops = await createPackageJsonOps('/');
    const base = {
      scripts: SCRIPTS,
      test: { ing: '3', x: { test: { ing: '2' } } },
      config: {
        port: 3000,
        env: 'development',
        nested: {
          level1: {
            level2: {
              value: 'original',
              level3: { value: 'deepOriginal', static: 'same' }
            }
          }
        }
      }
    };
    await fs.writeFile('/package.json', JSON.stringify(base));
    const override = {
      scripts: { test: 'override', build: 'override', newScript: 'new' },
      test: { ing: 'newProp', x: { test: { ing: 'override' } } },
      config: {
        port: 3000,
        env: 'development',
        nested: {
          level1: {
            level2: { value: 'new', level3: { value: 'new-deepOriginal' } }
          }
        }
      }
    };

    await ops.merge(override);
    await fs.readFile('/package.json', 'utf8').then((data) => {
      const pkg = JSON.parse(data);
      expect(pkg.scripts).toEqual({ ...SCRIPTS, ...override.scripts });
      expect(pkg.test).toEqual({
        ing: 'newProp',
        x: { test: { ing: 'override' } }
      });
      expect(pkg.config).toEqual({
        port: 3000,
        env: 'development',
        nested: {
          level1: {
            level2: {
              value: 'new',
              level3: { value: 'new-deepOriginal', static: 'same' }
            }
          }
        }
      });
    });
  });
});
