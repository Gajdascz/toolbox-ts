import { packageJson } from '@toolbox-ts/configs';
import { SRC_DIR } from '@toolbox-ts/configs/core';
import * as file from '@toolbox-ts/file';
import fs from 'node:fs/promises';
import path from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';

import * as configsModule from '../../core/configs/index.ts';
import { init } from './builder.js';
import * as core from './core/index.js';
import { gitignore, license, readme } from './templates/index.js';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('builder.init - early abort', () => {
  it('returns aborted when package.json already exists and onExistingProject is abort', async () => {
    vi.spyOn(file, 'isFile').mockResolvedValueOnce(true);

    const res = await init('singlePackage', {
      repo: {} as any,
      onExistingProject: 'abort'
    });

    expect(res).toEqual({
      status: 'aborted',
      reason:
        'project already exists, pass onExistingProject "overwrite" to overwrite'
    });
  });
});

describe('builder.init - errors from tooling and build steps', () => {
  it('returns error when validateTooling rejects', async () => {
    vi.spyOn(file, 'isFile').mockResolvedValueOnce(false);
    vi.spyOn(core, 'validateTooling').mockRejectedValueOnce(
      new Error('tooling fail')
    );

    const res = await init('singlePackage', {
      repo: { repoType: 'singlePackage' } as any
    });

    expect(res).toEqual({ status: 'error', message: 'tooling fail' });
  });

  it('returns error when buildConfigs rejects', async () => {
    vi.spyOn(file, 'isFile').mockResolvedValueOnce(false);
    vi.spyOn(core, 'validateTooling').mockResolvedValueOnce(undefined);
    vi.spyOn(core, 'withTmpDir').mockImplementation(async (_root, cb) => {
      await cb('/tmp/tmp');
    });

    vi.spyOn(configsModule, 'buildConfigs').mockRejectedValueOnce(
      new Error('build failed')
    );
    // keep other internals quiet
    vi.spyOn(file, 'writeFile').mockResolvedValueOnce();
    vi.spyOn(gitignore, 'write').mockResolvedValueOnce();
    vi.spyOn(license, 'write').mockResolvedValueOnce();
    vi.spyOn(readme, 'writeSinglePkg').mockResolvedValueOnce();
    vi.spyOn(fs, 'cp').mockResolvedValueOnce();

    const res = await init('singlePackage', {
      repo: { repoType: 'singlePackage' } as any
    });

    expect(res).toEqual({ status: 'error', message: 'build failed' });
  });
});

describe('builder.init - successful flows', () => {
  it('runs full init for singlePackage and calls expected helpers', async () => {
    vi.spyOn(file, 'isFile').mockResolvedValueOnce(false);
    vi.spyOn(core, 'validateTooling').mockResolvedValueOnce(undefined);
    vi.spyOn(core, 'withTmpDir').mockImplementation(async (_root, cb) => {
      await cb('/tmp/tmp');
    });

    const pkgDefineSpy = vi
      .spyOn(packageJson, 'define')
      .mockReturnValueOnce({ name: 'test-pkg' } as any);
    const writeFileSpy = vi.spyOn(file, 'writeFile').mockResolvedValue();
    vi.spyOn(gitignore, 'write').mockResolvedValue();
    vi.spyOn(license, 'write').mockResolvedValue();
    const readmeSpy = vi.spyOn(readme, 'writeSinglePkg').mockResolvedValue();
    vi.spyOn(configsModule, 'buildConfigs').mockResolvedValue();
    const extendConfigs = vi.fn().mockResolvedValue(true);
    vi.spyOn(fs, 'cp').mockResolvedValue();

    const cfg = { repoType: 'singlePackage', license: 'MIT' } as any;
    const res = await init('singlePackage', {
      repo: cfg,
      extend: { configs: extendConfigs }
    });

    expect(res).toEqual({ status: 'success' });

    expect(pkgDefineSpy).toHaveBeenCalledWith(cfg);
    expect(writeFileSpy).toHaveBeenCalledWith(
      path.join('/tmp/tmp', packageJson.meta.filename),
      expect.objectContaining({ name: 'test-pkg' })
    );
    expect(writeFileSpy).toHaveBeenCalledWith(
      path.join('/tmp/tmp', SRC_DIR, 'index.ts'),
      expect.stringContaining('Hello, World!')
    );
    expect(readmeSpy).toHaveBeenCalled();
    expect(configsModule.buildConfigs).toHaveBeenCalledWith({
      repoType: 'singlePackage',
      configs: {},
      writePath: '/tmp/tmp'
    });
    expect(extendConfigs).toHaveBeenCalledWith('singlePackage', '/tmp/tmp');
  });

  it('runs full init for monorepo and calls writeMonorepo', async () => {
    vi.spyOn(file, 'isFile').mockResolvedValueOnce(false);
    vi.spyOn(core, 'validateTooling').mockResolvedValueOnce(undefined);
    vi.spyOn(core, 'withTmpDir').mockImplementation(async (_root, cb) => {
      await cb('/tmp/tmp');
    });

    vi.spyOn(file, 'writeFile').mockResolvedValue();
    vi.spyOn(gitignore, 'write').mockResolvedValue();
    vi.spyOn(license, 'write').mockResolvedValue();
    const monoreadme = vi.spyOn(readme, 'writeMonorepo').mockResolvedValue();
    vi.spyOn(configsModule, 'buildConfigs').mockResolvedValue();
    vi.spyOn(fs, 'cp').mockResolvedValue();

    const cfg = { repoType: 'monorepo', license: 'MIT' } as any;
    const res = await init('monorepo', { repo: cfg });

    expect(res).toEqual({ status: 'success' });
    expect(monoreadme).toHaveBeenCalledWith(cfg, undefined, '/tmp/tmp');
  });

  it('returns error when extend.configs returns false', async () => {
    vi.spyOn(file, 'isFile').mockResolvedValueOnce(false);
    vi.spyOn(core, 'validateTooling').mockResolvedValueOnce(undefined);
    vi.spyOn(core, 'withTmpDir').mockImplementation(async (_root, cb) => {
      await cb('/tmp/tmp');
    });

    vi.spyOn(file, 'writeFile').mockResolvedValue();
    vi.spyOn(gitignore, 'write').mockResolvedValue();
    vi.spyOn(license, 'write').mockResolvedValue();
    vi.spyOn(readme, 'writeSinglePkg').mockResolvedValue();
    vi.spyOn(configsModule, 'buildConfigs').mockResolvedValue();
    vi.spyOn(fs, 'cp').mockResolvedValue();

    const extendConfigs = vi.fn().mockResolvedValue(false);
    const res = await init('singlePackage', {
      repo: { repoType: 'singlePackage' } as any,
      extend: { configs: extendConfigs }
    });

    expect(res).toEqual({
      status: 'error',
      message: expect.stringContaining('Failed to extend configs.')
    });
  });
});
