import fs from 'node:fs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { parseJson, parseJsonSync } from './parse-json.ts';

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
    expect(res).toEqual({ result: { foo: 42 } });
    expect(res).not.toHaveProperty('error');
  });

  it('parses and resolves with resolverFn', async () => {
    const res = await parseJson<{ foo: number }, string>(testFile, {
      resolverFn: (obj) => `foo=${obj.foo}`
    });
    expect(res).toEqual({ result: 'foo=42' });
  });

  it('returns error if resolverFn returns null', async () => {
    const res = await parseJson<{ foo: number }, null>(testFile, {
      resolverFn: () => null
    });
    expect(res.result).toBeNull();
    expect(res.error).toMatch(/Resolver function returned null/);
  });

  it('returns error for invalid JSON', async () => {
    const res = await parseJson(invalidFile);
    expect(res.result).toBeNull();
    expect(res.error).toMatch(/Failed to parse JSON config/);
    expect(res.error).toMatch(/Error:/);
  });

  it('returns error for missing file', async () => {
    const res = await parseJson(missingFile);
    expect(res.result).toBeNull();
    expect(res.error).toMatch(/Failed to parse JSON config/);
    expect(res.error).toMatch(/Error:/);
  });
  it('handles non-Error exceptions gracefully', async () => {
    const mockReadFile = vi
      .spyOn(fs.promises, 'readFile')
      .mockImplementationOnce(() => {
        // eslint-disable-next-line @typescript-eslint/only-throw-error
        throw 'Unexpected error';
      });

    const res = await parseJson(testFile);
    expect(res.result).toBeNull();
    expect(res.error).toMatch(/Failed to parse JSON config/);
    expect(res.error).toMatch(/Unexpected error/);

    mockReadFile.mockClear();
  });
  it('parseJsonSync works', () => {
    const res = parseJsonSync<{ foo: number }>(testFile);
    expect(res).toEqual({ result: { foo: 42 } });
    expect(res).not.toHaveProperty('error');
  });
});
