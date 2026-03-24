import fs from 'node:fs';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { normalizeFileData } from './normalize.js';

const CWD = '/test/mock';

vi.stubGlobal('process', { ...process, cwd: () => CWD });
vi.spyOn(process, 'cwd').mockReturnValue(CWD);
const TMP = path.join(process.cwd(), '.tmp-write-test');

beforeEach(async () => {
  await fs.promises.mkdir(CWD, { recursive: true });
  await fs.promises.rm(TMP, { recursive: true, force: true });
  await fs.promises.mkdir(TMP, { recursive: true });
});
afterEach(async () => {
  await fs.promises.rm(TMP, { recursive: true, force: true });
});

describe('File.normalizeFileData()', () => {
  it('normalizes data correctly', () => {
    expect(normalizeFileData('test')).toBe('test');
    expect(normalizeFileData(null)).toBe('');
    expect(normalizeFileData(undefined)).toBe('');
    expect(normalizeFileData(new Uint8Array([104, 101, 108, 108, 111]))).toBe('hello');
    expect(normalizeFileData(Buffer.from('world'))).toBe('world');
    expect(normalizeFileData({ key: 'value' })).toBe(JSON.stringify({ key: 'value' }, null, 2));
    expect(normalizeFileData(1n)).toBe('1');
    expect(normalizeFileData(new Date())).toEqual(expect.any(String));
  });
});
