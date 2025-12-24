import fs from 'node:fs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { parseJson, syncParseJson } from './parse-json.ts';

// memfs is pre-setup
const testFile = '/tmp/test.json';
const invalidFile = '/tmp/invalid.json';
const missingFile = '/tmp/missing.json';

beforeEach(async () => {
  await fs.promises.mkdir('/tmp', { recursive: true });
  await fs.promises.writeFile(testFile, JSON.stringify({ foo: 42 }), 'utf8');
  await fs.promises.writeFile(invalidFile, '{ bad json', 'utf8');
});

describe('parseJson', () => {
  it('parses valid JSON file', async () => {
    const res = await parseJson<{ foo: number }>(testFile);
    expect(res).toEqual({ foo: 42 });
  });

  it('parses and resolves with resolverFn', async () => {
    const res = await parseJson<{ foo: number }, string>(testFile, {
      resolverFn: (obj) => `foo=${obj.foo}`
    });
    expect(res).toEqual('foo=42');
  });

  it('throws error if resolverFn returns null', async () => {
    await expect(
      parseJson(testFile, { resolverFn: () => null })
    ).rejects.toThrowError();
  });

  it('throws error for invalid JSON', async () => {
    await expect(parseJson(invalidFile)).rejects.toThrowError();
  });

  it('throws error for missing file', async () => {
    await expect(parseJson(missingFile)).rejects.toThrowError();
  });
  it('handles non-Error exceptions gracefully', async () => {
    const mockReadFile = vi
      .spyOn(fs.promises, 'readFile')
      .mockImplementationOnce(() => {
        // eslint-disable-next-line @typescript-eslint/only-throw-error
        throw 'Unexpected error';
      });

    await expect(parseJson(missingFile)).rejects.toThrowError();

    mockReadFile.mockClear();
  });
  it('syncParseJson works', () => {
    const res = syncParseJson<{ foo: number }>(testFile);
    expect(res).toEqual({ foo: 42 });
  });
});
