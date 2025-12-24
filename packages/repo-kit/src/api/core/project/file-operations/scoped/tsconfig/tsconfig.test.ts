import fs from 'node:fs/promises';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createTsConfigOps } from './tsconfig.ts';

const TS_PATH = '/tsconfig.json';
const SAMPLE = {
  $schema: 'http://example.com/schema',
  name: 'sample-ts',
  filename: 'tsconfig.json',
  description: 'a sample tsconfig',
  compilerOptions: {
    target: 'ES2018',
    module: 'ESNext',
    types: ['@types/node']
  },
  exclude: ['node_modules', 'dist'],
  extends: './base.json',
  files: ['index.ts'],
  include: ['src/**/*'],
  references: [{ path: '../other' }],
  typeAcquisition: { enable: true },
  watchOptions: { watchFile: 'UseFsEvents' }
};

beforeEach(async () => {
  vi.resetAllMocks();
  // ensure a clean memfs state
  await fs.rm(TS_PATH, { force: true }).catch(() => undefined);
  // write a known tsconfig for tests that need it
  await fs.writeFile(TS_PATH, JSON.stringify(SAMPLE), 'utf8');
});

describe('createTsConfigOps', () => {
  it('throws when the tsconfig file is missing', async () => {
    // ensure target file doesn't exist
    await fs
      .rm('/missing/tsconfig.json', { force: true })
      .catch(() => undefined);
    await expect(
      createTsConfigOps('/missing', 'tsconfig.json')
    ).rejects.toThrow('No tsconfig.json found at /missing/tsconfig.json');
  });

  it('get returns the full config when passed the file path', async () => {
    const ops = await createTsConfigOps('/', 'tsconfig.json');
    const full = await ops.get(TS_PATH);
    expect(full).toEqual(SAMPLE);
  });

  it('get(field) returns a single field and undefined for missing fields', async () => {
    const ops = await createTsConfigOps('/', 'tsconfig.json');

    const compiler = await ops.get(TS_PATH, 'compilerOptions');
    expect(compiler).toEqual(SAMPLE.compilerOptions);

    const missing = await ops.get(TS_PATH, 'nonexistent' as any);
    expect(missing).toBeUndefined();
  });

  it('get(array) returns an object with the requested fields', async () => {
    const ops = await createTsConfigOps('/', 'tsconfig.json');
    const subset = await ops.get(TS_PATH, ['compilerOptions', 'exclude']);
    expect(subset).toEqual({
      compilerOptions: SAMPLE.compilerOptions,
      exclude: SAMPLE.exclude
    });
  });

  it('provides typed accessors for all top-level tsconfig fields', async () => {
    const ops = await createTsConfigOps('/', 'tsconfig.json');

    await expect(ops.compilerOptions()).resolves.toEqual(
      SAMPLE.compilerOptions
    );
    await expect(ops.exclude()).resolves.toEqual(SAMPLE.exclude);
    await expect(ops.extends()).resolves.toEqual(SAMPLE.extends);
    await expect(ops.files()).resolves.toEqual(SAMPLE.files);
    await expect(ops.include()).resolves.toEqual(SAMPLE.include);
    await expect(ops.references()).resolves.toEqual(SAMPLE.references);
    await expect(ops.typeAcquisition()).resolves.toEqual(
      SAMPLE.typeAcquisition
    );
    await expect(ops.watchOptions()).resolves.toEqual(SAMPLE.watchOptions);
  });

  it('meta returns expected metadata with filename mapped properly', async () => {
    const ops = await createTsConfigOps('/', 'tsconfig.json');
    const meta = await ops.meta();
    expect(meta).toEqual({
      $schema: SAMPLE.$schema,
      name: SAMPLE.name,
      description: SAMPLE.description,
      filename: SAMPLE.filename
    });
  });

  it('merges new data into the tsconfig file', async () => {
    const ops = await createTsConfigOps('/', 'tsconfig.json');
    await ops.merge({
      compilerOptions: { strict: true, types: ['test-types'] },
      exclude: ['dist', 'build', 'src', 'custom'],
      description: 'updated description',
      filename: 'tsconfig.json',
      $schema: SAMPLE.$schema,
      name: 'newName'
    });

    const updated = JSON.parse(await fs.readFile(TS_PATH, 'utf8')) as {
      newField: string;
    } & typeof SAMPLE;

    expect(updated.compilerOptions).toEqual({
      target: 'ES2018',
      module: 'ESNext',
      types: ['@types/node', 'test-types'],
      strict: true
    });
    expect(updated.exclude).toEqual([
      'node_modules',
      'dist',
      'build',
      'src',
      'custom'
    ]);
  });
  it('get throws if the file contains invalid JSON', async () => {
    // write invalid JSON
    await fs.writeFile(TS_PATH, '{ invalid json }', 'utf8');
    const ops = await createTsConfigOps('/', 'tsconfig.json');
    await expect(ops.get(TS_PATH)).rejects.toThrow(SyntaxError);
  });
});
