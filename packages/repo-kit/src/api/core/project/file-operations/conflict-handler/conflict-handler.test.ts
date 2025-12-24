import { merge } from '@toolbox-ts/configs/core';
import * as fileModule from '@toolbox-ts/file';
import fs from 'node:fs/promises';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { OperationError } from '../../../../Errors.ts';
import { handleConflict } from './conflict-handler.ts';

vi.mock('@toolbox-ts/file', async (actual) => {
  return {
    ...(await actual()),
    mergeFile: vi.fn(),
    mergeJSON: vi.fn(),
    mergeModule: vi.fn(),
    writeFile: vi.fn()
  };
});

vi.mock('@toolbox-ts/configs/core', async (actual) => {
  return { ...(await actual()), merge: vi.fn((a, b) => ({ ...a, ...b })) };
});

describe('handleConflict', () => {
  const filePath = '/test/file.txt';

  beforeEach(async () => {
    vi.clearAllMocks();
    await fs.mkdir('/test', { recursive: true });
    await fs.writeFile(filePath, 'base');
  });

  describe('basic strategies', () => {
    it('abort strategy throws OperationError', async () => {
      await expect(
        handleConflict('abort', {
          fileData: { name: 'static', type: 'default' },
          filePath
        })
      ).rejects.toBeInstanceOf(OperationError);
    });

    it('skip strategy logs and returns handledWith skip', async () => {
      const spy = vi.spyOn(console, 'info').mockImplementation(() => {});
      const res = await handleConflict('skip', {
        fileData: { name: 'static', type: 'default' },
        filePath
      });
      expect(spy).toHaveBeenCalled();
      expect(res).toEqual({ handledWith: 'skip' });
      spy.mockRestore();
    });
  });

  describe('overwrite', () => {
    it('writes file when no confirmFn (force overwrite)', async () => {
      await handleConflict('overwrite', {
        fileData: { name: 'static', type: 'default' },
        filePath,
        incomingData: 'new'
      });

      expect(fileModule.writeFile).toHaveBeenCalledWith(
        filePath,
        'new',
        expect.objectContaining({ overwrite: { behavior: 'force' } })
      );
    });

    it('delegates to fallback when confirmFn returns skip', async () => {
      const spy = vi.spyOn(console, 'info').mockImplementation(() => {});
      const confirmFn = vi.fn().mockResolvedValue('skip');

      const res = await handleConflict('overwrite', {
        fileData: { name: 'static', type: 'default' },
        filePath,
        incomingData: 'new',
        confirmFn
      });

      // confirm wrapper should set confirmation to 'skip'
      expect(confirmFn).toHaveBeenCalled();
      expect(res.confirmation).toBe('skip');
      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
    });

    it('throws when confirmFn returns abort', async () => {
      const confirmFn = vi.fn().mockResolvedValue('abort');
      await expect(
        handleConflict('overwrite', {
          fileData: { name: 'static', type: 'default' },
          filePath,
          incomingData: 'new',
          confirmFn
        })
      ).rejects.toBeInstanceOf(OperationError);
    });
  });

  describe('merge - default/static & runtime', () => {
    it('static/object incoming uses mergeJSON and reports default-json-stringify & default-object-deep-merge', async () => {
      await fs.writeFile(filePath, JSON.stringify({ a: 1 }), 'utf8');

      const res = await handleConflict('merge', {
        fileData: { name: 'static', type: 'default' },
        filePath,
        incomingData: { b: 2 }
      });

      expect(fileModule.mergeJSON).toHaveBeenCalled();
      expect(res.handledWith).toBe('merge');
      expect(res.usingHandlers.type).toBe('default');
      expect(res.usingHandlers.fileSerializer).toBe('default-json-stringify');
      expect(res.usingHandlers.mergeFileDiskContent).toBe(
        'default-static-json'
      );
      expect(res.usingHandlers.mergeFileData).toBe('default-object-deep-merge');

      // ensure mergeFn provided to mergeJSON is the mocked merge function
      const calledOpts = vi.mocked(fileModule.mergeJSON).mock.calls[0][0];
      expect(calledOpts.baseFilePath).toBe(filePath);
      expect(calledOpts.inputFilePathOrData).toEqual({ b: 2 });
      expect(calledOpts.mergeFn).toBe(merge);
      expect(calledOpts.confirmFn).toBeUndefined();
    });

    it('static/string incoming uses string concatenate merge handler', async () => {
      await fs.writeFile(filePath, 'hello', 'utf8');

      const res = await handleConflict('merge', {
        fileData: { name: 'static', type: 'default' },
        filePath,
        incomingData: ' world'
      });

      expect(fileModule.mergeJSON).toHaveBeenCalled();
      expect(res.usingHandlers.mergeFileData).toBe(
        'default-string-concatenate'
      );
    });

    it('runtime requires and uses provided serializer object and mergeModule', async () => {
      const serializer = {
        name: 'my-serializer',
        fn: (d: unknown) => JSON.stringify(d)
      };
      const res = await handleConflict('merge', {
        fileData: {
          name: 'runtime',
          type: 'default',
          options: { serialize: serializer }
        },
        filePath,
        incomingData: { r: true }
      });

      expect(fileModule.mergeModule).toHaveBeenCalled();
      expect(res.usingHandlers.type).toBe('default');
      expect(res.usingHandlers.mergeFileDiskContent).toBe(
        'default-runtime-module'
      );
      expect(res.usingHandlers.fileSerializer).toBe('my-serializer');

      const opts = vi.mocked(fileModule.mergeModule).mock.calls[0][0];
      expect(opts.serialize).toBe(serializer.fn);
    });
  });

  describe('merge - custom handlers and serializer resolution', () => {
    it('uses user-provided parser/merge/serializer and reports their names', async () => {
      const myMerge = {
        name: 'my-merge',
        fn: vi.fn((a, b) => ({ ...a, ...b }))
      };
      const myParser = { name: 'my-parser', fn: vi.fn(() => ({ a: 1 })) };
      const mySerializer = {
        name: 'my-serialize',
        fn: vi.fn((d: unknown) => JSON.stringify(d))
      };

      await handleConflict('merge', {
        fileData: {
          name: 'custom',
          type: 'custom',
          options: {
            mergeFn: myMerge,
            fileParser: myParser,
            serialize: mySerializer
          }
        },
        filePath,
        incomingData: { b: 2 }
      });

      expect(fileModule.mergeFile).toHaveBeenCalledWith(
        expect.objectContaining({
          mergeFn: myMerge.fn,
          fileParser: myParser.fn,
          serialize: mySerializer.fn
        })
      );

      // the returned result populated the usingHandlers with provided names
      const res = await handleConflict('merge', {
        fileData: {
          name: 'custom',
          type: 'custom',
          options: {
            mergeFn: myMerge,
            fileParser: myParser,
            serialize: mySerializer
          }
        },
        filePath,
        incomingData: { b: 2 }
      });
      expect(
        res.usingHandlers.type === 'custom' && res.usingHandlers.fileParser
      ).toBe('my-parser');
      expect(res.usingHandlers.fileSerializer).toBe('my-serialize');
      expect(res.usingHandlers.mergeFileData).toBe('my-merge');
    });

    it('when custom and incoming is string, uses default string serializer and string-concat merge', async () => {
      await fs.writeFile(filePath, 'old', 'utf8');

      await handleConflict('merge', {
        fileData: { name: 'unknown', type: 'custom', options: {} },
        filePath,
        incomingData: 'new'
      });

      expect(fileModule.mergeFile).toHaveBeenCalled();
      const opts = vi.mocked(fileModule.mergeFile).mock.calls[0][0];
      // serializer will be the default string constructor
      expect(opts.serialize).toBe(String);
      // mergeFn should be default string concat
      const merged = await opts.mergeFn('old', 'new');
      expect(merged).toBe('oldnew');
    });

    it('when custom and incoming is object, uses default json serializer and merge (deep)', async () => {
      await fs.writeFile(filePath, JSON.stringify({ a: 1 }), 'utf8');

      await handleConflict('merge', {
        fileData: { name: 'unknown', type: 'custom', options: {} },
        filePath,
        incomingData: { b: 2 }
      });

      expect(fileModule.mergeFile).toHaveBeenCalled();
      const opts = vi.mocked(fileModule.mergeFile).mock.calls[0][0];
      expect(opts.serialize).toBeDefined();
      // default merge should be the imported merge function
      expect(opts.mergeFn).toBe(merge);
    });
  });

  describe('merge confirm wrapper behavior', () => {
    it('aborts when confirmFn returns abort', async () => {
      const confirmFn = vi.fn().mockResolvedValue('abort');
      vi.mocked(fileModule.mergeJSON).mockImplementation(async (opts: any) => {
        if (opts.confirmFn) await opts.confirmFn({ merged: true });
      });

      await expect(
        handleConflict('merge', {
          fileData: { name: 'static', type: 'default' },
          filePath,
          incomingData: { a: 1 },
          confirmFn
        })
      ).rejects.toBeInstanceOf(OperationError);
    });

    it('delegates to skip when confirmFn returns skip and returns result with confirmation', async () => {
      const confirmFn = vi.fn().mockResolvedValue('skip');
      const info = vi.spyOn(console, 'info').mockImplementation(() => {});

      vi.mocked(fileModule.mergeJSON).mockImplementation(async (opts: any) => {
        if (opts.confirmFn) await opts.confirmFn({ merged: true });
      });

      const res = await handleConflict('merge', {
        fileData: { name: 'static', type: 'default' },
        filePath,
        incomingData: { a: 1 },
        confirmFn
      });

      expect(confirmFn).toHaveBeenCalled();
      expect(info).toHaveBeenCalled();
      expect(res.confirmation).toBe('skip');
      info.mockRestore();
    });

    it('proceeds (overwrites) when confirmFn returns true', async () => {
      const confirmFn = vi.fn().mockResolvedValue(true);
      vi.mocked(fileModule.mergeJSON).mockImplementation(async (opts: any) => {
        if (opts.confirmFn) await opts.confirmFn({ merged: true });
      });

      const res = await handleConflict('merge', {
        fileData: { name: 'static', type: 'default' },
        filePath,
        incomingData: { a: 1 },
        confirmFn
      });

      // mergeJSON still called and confirmation set to 'overwrite'
      expect(fileModule.mergeJSON).toHaveBeenCalled();
      expect(res.confirmation).toBe('overwrite');
    });
  });
});
