import { beforeEach, describe, expect, it, vi } from 'vitest';

import { loadModule } from '../load-module/index.js';
import { parseJson } from '../parse-json/index.js';
import { writeFile } from '../write/index.js';
import { mergeFile, mergeJSON, mergeModule } from './merge.js';
vi.mock('../write/index.js', () => ({
  writeFile: vi.fn(async () => await Promise.resolve(undefined))
}));
vi.mock('../parse-json/index.js', () => ({ parseJson: vi.fn() }));
vi.mock('../load-module/index.js', () => ({ loadModule: vi.fn() }));

const mockedWrite = vi.mocked(writeFile);
const mockedParse = vi.mocked(parseJson);
const mockedLoad = vi.mocked(loadModule);

beforeEach(() => {
  vi.resetAllMocks();
});

describe('mergeFile', () => {
  type Config = Partial<{ a: number; b: number }>;
  it('parses base and input (object) and writes merged when confirmed (sync mergeFn)', async () => {
    const baseFile = '/base.json';
    const inputData = { b: 2 };
    const fileParser = vi.fn((p: string) =>
      p === baseFile ? { a: 1 } : { b: 2 }
    );
    const mergeFn = (a: any, b: any) => ({ ...a, ...b });
    await mergeFile({
      baseFilePath: baseFile,
      inputFilePathOrData: inputData,
      fileParser,
      mergeFn
    });
    expect(fileParser).toHaveBeenCalledTimes(1);
    expect(mockedWrite).toHaveBeenCalledWith(
      baseFile,
      { a: 1, b: 2 },
      { overwrite: { behavior: 'force' } }
    );
  });

  it('calls fileParser for input when input is a string path', async () => {
    const baseFile = '/base.json';
    const inputPath = '/input.json';
    const fileParser = vi.fn((p: string) =>
      p === baseFile ? { a: 1 } : { b: 2 }
    );
    const mergeFn = (a: any, b: any) => ({ ...a, ...b });
    await mergeFile<Partial<{ a: number; b: number }>>({
      baseFilePath: baseFile,
      inputFilePathOrData: inputPath,
      fileParser,
      mergeFn
    });
    expect(fileParser).toHaveBeenCalledWith(baseFile);
    expect(fileParser).toHaveBeenCalledWith(inputPath);
    expect(mockedWrite).toHaveBeenCalled();
  });

  it('does not write when confirmFn resolves to false', async () => {
    const baseFile = '/base.json';
    const fileParser = vi.fn(() => ({ a: 1 }));
    const mergeFn = () => ({ a: 1 });
    const confirmFn = vi.fn(() => false);
    await mergeFile<Config>({
      baseFilePath: baseFile,
      inputFilePathOrData: {},
      fileParser,
      mergeFn,
      confirmFn
    });
    expect(confirmFn).toHaveBeenCalled();
    expect(mockedWrite).not.toHaveBeenCalled();
  });

  it('uses provided serialize result when present (sync and async)', async () => {
    const baseFile = '/base.json';
    const fileParser = vi.fn(() => ({ a: 1 }));
    const mergeFn = () => ({ a: 1, b: 2 });

    // sync serializer
    const serializerSync = vi.fn((data: any) => JSON.stringify(data));
    await mergeFile<Config>({
      baseFilePath: baseFile,
      inputFilePathOrData: {},
      fileParser,
      mergeFn,
      serialize: serializerSync
    });
    expect(serializerSync).toHaveBeenCalledWith({ a: 1, b: 2 });
    expect(mockedWrite).toHaveBeenCalledWith(
      baseFile,
      JSON.stringify({ a: 1, b: 2 }),
      { overwrite: { behavior: 'force' } }
    );

    vi.resetAllMocks();

    // async serializer
    const serializerAsync = vi.fn((data: any) => JSON.stringify(data));
    await mergeFile({
      baseFilePath: baseFile,
      inputFilePathOrData: {},
      fileParser,
      mergeFn,
      serialize: serializerAsync
    });
    expect(serializerAsync).toHaveBeenCalled();
    expect(mockedWrite).toHaveBeenCalled();
  });

  it('supports async mergeFn and async confirmFn', async () => {
    const baseFile = '/base.json';
    const fileParser = vi.fn(() => ({ a: 1 }));
    const mergeFn = vi.fn((a: any) => ({ ...a, async: true }));
    const confirmFn = vi.fn(() => true);
    await mergeFile({
      baseFilePath: baseFile,
      inputFilePathOrData: {},
      fileParser,
      mergeFn,
      confirmFn
    });
    expect(mergeFn).toHaveBeenCalled();
    expect(confirmFn).toHaveBeenCalled();
    expect(mockedWrite).toHaveBeenCalled();
  });

  it('propagates fileParser errors', async () => {
    const baseFile = '/bad.json';
    const fileParser = vi.fn(() => {
      throw new Error('parse fail');
    });
    const mergeFn = vi.fn();
    await expect(
      mergeFile({
        baseFilePath: baseFile,
        inputFilePathOrData: {},
        fileParser,
        mergeFn
      })
    ).rejects.toThrow('parse fail');
    expect(mockedWrite).not.toHaveBeenCalled();
  });
});

describe('mergeJSON', () => {
  it('delegates to parseJson and writes merged result', async () => {
    mockedParse.mockImplementation(
      async (p: string) =>
        await Promise.resolve(p === '/base.json' ? { a: 1 } : { b: 2 })
    );
    const mergeFn = (a: any, b: any) => ({ ...a, ...b });
    await mergeJSON({
      baseFilePath: '/base.json',
      inputFilePathOrData: '/input.json',
      mergeFn
    });
    expect(mockedParse).toHaveBeenCalledWith('/base.json');
    expect(mockedParse).toHaveBeenCalledWith('/input.json');
    expect(mockedWrite).toHaveBeenCalledWith(
      '/base.json',
      { a: 1, b: 2 },
      { overwrite: { behavior: 'force' } }
    );
  });
});

describe('mergeModule', () => {
  it('uses loadModule as parser and writes merged result', async () => {
    mockedLoad.mockImplementation(
      async (p: string) =>
        await Promise.resolve(p === '/base.mjs' ? { a: 1 } : { b: 2 })
    );
    const mergeFn = (a: any, b: any) => ({ ...a, ...b });
    await mergeModule({
      baseFilePath: '/base.mjs',
      inputFilePathOrData: '/input.mjs',
      mergeFn,
      serialize: async (d: any) => await Promise.resolve(JSON.stringify(d))
    });
    expect(mockedLoad).toHaveBeenCalledWith('/base.mjs');
    expect(mockedLoad).toHaveBeenCalledWith('/input.mjs');
    expect(mockedWrite).toHaveBeenCalled();

    // with serializer
    vi.resetAllMocks();
    mockedLoad.mockResolvedValueOnce({ a: 1 }).mockResolvedValueOnce({ b: 2 });
    const serializer = vi.fn(
      async (d: any) => await Promise.resolve(JSON.stringify(d))
    );
    await mergeModule({
      baseFilePath: '/base.mjs',
      inputFilePathOrData: '/input.mjs',
      mergeFn,
      serialize: serializer
    });
    expect(serializer).toHaveBeenCalled();
    expect(mockedWrite).toHaveBeenCalledWith(
      '/base.mjs',
      JSON.stringify({ a: 1, b: 2 }),
      { overwrite: { behavior: 'force' } }
    );
  });
});
