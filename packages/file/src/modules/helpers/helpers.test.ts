import fs from 'node:fs';
import path from 'node:path';
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  expectTypeOf,
  it,
  vi
} from 'vitest';

import {
  arrayToQueueLike,
  hasDirs,
  hasDirsSync,
  hasFiles,
  hasFilesSync,
  initQueueLike,
  isDir,
  isDirSync,
  isFile,
  isFileSync,
  normalizeFileData,
  type QueueLike,
  readFile,
  readFileSync,
  size,
  sizeSync,
  writeFile,
  type WriteFileResult
} from './helpers.ts';

const CWD = '/test/mock';

vi.stubGlobal('process', { ...process, cwd: () => CWD });
vi.spyOn(process, 'cwd').mockReturnValue(CWD);
const TMP = path.join(process.cwd(), '.tmp-write-test');
const file = async (name: string, data?: string) => {
  const p = path.join(TMP, name);
  if (data) await fs.promises.writeFile(p, data);
  return p;
};

beforeEach(async () => {
  await fs.promises.mkdir(CWD, { recursive: true });
  await fs.promises.rm(TMP, { recursive: true, force: true });
  await fs.promises.mkdir(TMP, { recursive: true });
});
afterEach(async () => {
  await fs.promises.rm(TMP, { recursive: true, force: true });
});

describe('helpers', () => {
  describe('isDir', () => {
    describe('(async)', () => {
      it('returns true for directories', async () => {
        expect(await isDir(CWD)).toBe(true);
      });
      it('returns false for files', async () => {
        const f = CWD + '/file.txt';
        fs.writeFileSync(f, 'x');
        expect(await isDir(f)).toBe(false);
      });
      it('returns false for non-existent paths', async () => {
        expect(await isDir(CWD + '/nope')).toBe(false);
      });
    });
    describe('(sync)', () => {
      it('returns true for directories', () => {
        fs.mkdirSync(CWD, { recursive: true });
        expect(isDirSync(CWD)).toBe(true);
      });
      it('returns false for files', () => {
        const f = CWD + '/file.txt';
        fs.writeFileSync(f, 'x');
        expect(isDirSync(f)).toBe(false);
      });
      it('returns false for non-existent paths', () => {
        expect(isDirSync(CWD + '/nope')).toBe(false);
      });
    });
  });
  describe('isFile', () => {
    describe('(async)', () => {
      it('returns true for files', async () => {
        const f = CWD + '/file2.txt';
        fs.writeFileSync(f, 'x');
        expect(await isFile(f)).toBe(true);
      });
      it('returns false for directories', async () => {
        fs.mkdirSync(CWD + '/adir', { recursive: true });
        expect(await isFile(CWD + '/adir')).toBe(false);
      });
      it('returns false for non-existent paths', async () => {
        expect(await isFile(CWD + '/nope2')).toBe(false);
      });
    });
    describe('(sync)', () => {
      it('returns true for files', () => {
        const f = CWD + '/file2.txt';
        fs.writeFileSync(f, 'x');
        expect(isFileSync(f)).toBe(true);
      });
      it('returns false for directories', () => {
        fs.mkdirSync(CWD + '/adir', { recursive: true });
        expect(isFileSync(CWD + '/adir')).toBe(false);
      });
      it('returns false for non-existent paths', () => {
        expect(isFileSync(CWD + '/nope2')).toBe(false);
      });
    });
  });
  describe('size', () => {
    describe('(async)', () => {
      it('returns file size in bytes', async () => {
        const f = CWD + '/file3.txt';
        fs.writeFileSync(f, '12345');
        expect(await size(f)).toBe(5);
      });
      it('returns null for non-existent paths', async () => {
        expect(await size(CWD + '/nope3')).toBe(null);
      });
    });
    describe('(sync)', () => {
      it('returns file size in bytes', () => {
        const f = CWD + '/file3.txt';
        fs.writeFileSync(f, '12345');
        expect(sizeSync(f)).toBe(5);
      });
      it('returns -1 for non-existent paths', () => {
        expect(sizeSync(CWD + '/nope3')).toBe(-1);
      });
    });
  });
  describe('queueLike', () => {
    it('arrayToQueueLike()', () => {
      const arr = ['a', 'b', 'c'];
      const q = arrayToQueueLike(arr);
      expect(q.length).toBe(3);
      expect(q.dequeue()).toBe('a');
      expect(q.length).toBe(2);
      q.enqueue('d', 'e');
      expect(q.length).toBe(4);
      expect(q.dequeue()).toBe('b');
      expect(q.dequeue()).toBe('c');
      expect(q.dequeue()).toBe('d');
      expect(q.dequeue()).toBe('e');
      expect(q.dequeue()).toBeUndefined();
      expect(q.length).toBe(0);
      expect(q.clone?.()).not.toBe(q);
    });
    describe('initQueueLike(', () => {
      it('clones the queue if clone method is available', () => {
        let cloneCalls = 0;
        const original: QueueLike = {
          length: 2,
          clone() {
            cloneCalls += 1;
            return {
              dequeue: this.dequeue,
              enqueue: this.enqueue,
              length: this.length,
              cloneCalls: this.cloneCalls,
              clone: this.clone
            };
          },
          dequeue() {
            return 'item';
          },
          enqueue() {}
        };
        const cloned = initQueueLike(original);
        expect(cloned).not.toBe(original);
        expect(cloned?.length).toBe(2);
        expect(cloneCalls).toBe(1);
      });
      it('returns the same queue if no clone method', () => {
        const queue = {
          length: 3,
          dequeue() {
            return 'item';
          },
          enqueue() {}
        };
        const result = initQueueLike(queue);
        expect(result).toBe(queue);
      });
      it('returns an array-based QueueLike if input is an array', () => {
        const arr = ['x', 'y', 'z'];
        const q = initQueueLike(arr);
        expect(q).toBeDefined();
        expect(q?.length).toBe(3);
        expect(q?.dequeue()).toBe('x');
      });
      it('returns a new empty queue if undefined', () => {
        const result = initQueueLike();
        expect(result).toBeDefined();
        expect(result?.length).toBe(0);
      });
    });
  });
  describe('hasFiles', () => {
    describe('(async)', () => {
      it('returns true if all specified files exist in directory', async () => {
        const dir = CWD + '/dir1';
        await fs.promises.mkdir(dir, { recursive: true });
        await fs.promises.writeFile(dir + '/file1.txt', 'x');
        await fs.promises.writeFile(dir + '/file2.txt', 'y');
        expect(await hasFiles(dir, ['file1.txt', 'file2.txt'])).toBe(true);
      });
      it('returns false if any specified file does not exist in directory', async () => {
        const dir = CWD + '/dir2';
        await fs.promises.mkdir(dir, { recursive: true });
        await fs.promises.writeFile(dir + '/file1.txt', 'x');
        expect(await hasFiles(dir, ['file1.txt', 'file2.txt'])).toBe(false);
      });
      it('returns false if directory does not exist', async () => {
        expect(
          await hasFiles(CWD + '/nope-dir', ['file1.txt', 'file2.txt'])
        ).toBe(false);
      });
    });
    describe('(sync)', () => {
      it('returns true if all specified files exist in directory', () => {
        const dir = CWD + '/dir1-sync';
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(dir + '/file1.txt', 'x');
        fs.writeFileSync(dir + '/file2.txt', 'y');
        expect(hasFilesSync(dir, ['file1.txt', 'file2.txt'])).toBe(true);
      });
      it('returns false if any specified file does not exist in directory', () => {
        const dir = CWD + '/dir2-sync';
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(dir + '/file1.txt', 'x');
        expect(hasFilesSync(dir, ['file1.txt', 'file2.txt'])).toBe(false);
      });
      it('returns false if directory does not exist', () => {
        expect(
          hasFilesSync(CWD + '/nope-dir-sync', ['file1.txt', 'file2.txt'])
        ).toBe(false);
      });
    });
  });
  describe('hasDirs', () => {
    describe('(async)', () => {
      it('returns true if all specified dirs exist in directory', async () => {
        const dir = CWD + '/dir1';
        await fs.promises.mkdir(dir + '/sub1', { recursive: true });
        await fs.promises.mkdir(dir + '/sub2', { recursive: true });
        expect(await hasDirs(dir, ['sub1', 'sub2'])).toBe(true);
      });
      it('returns false if any specified dir does not exist in directory', async () => {
        const dir = CWD + '/dir2';
        await fs.promises.mkdir(dir + '/sub1', { recursive: true });
        expect(await hasDirs(dir, ['sub1', 'sub2'])).toBe(false);
      });
      it('returns false if directory does not exist', async () => {
        expect(await hasDirs(CWD + '/nope-dir', ['sub1', 'sub2'])).toBe(false);
      });
    });
    describe('(sync)', () => {
      it('returns true if all specified dirs exist in directory', () => {
        const dir = CWD + '/dir1-sync';
        fs.mkdirSync(dir + '/sub1', { recursive: true });
        fs.mkdirSync(dir + '/sub2', { recursive: true });
        expect(hasDirsSync(dir, ['sub1', 'sub2'])).toBe(true);
      });
      it('returns false if any specified dir does not exist in directory', () => {
        const dir = CWD + '/dir2-sync';
        fs.mkdirSync(dir + '/sub1', { recursive: true });
        expect(hasDirsSync(dir, ['sub1', 'sub2'])).toBe(false);
      });
      it('returns false if directory does not exist', () => {
        expect(hasDirsSync(CWD + '/nope-dir-sync', ['sub1', 'sub2'])).toBe(
          false
        );
      });
    });
  });
  describe('normalizeFileData', () => {
    it('normalizes data correctly', () => {
      expect(normalizeFileData('test')).toBe('test');
      expect(normalizeFileData(null)).toBe('');
      expect(normalizeFileData(undefined)).toBe('');
      expect(normalizeFileData(new Uint8Array([104, 101, 108, 108, 111]))).toBe(
        'hello'
      );
      expect(normalizeFileData(Buffer.from('world'))).toBe('world');
      expect(normalizeFileData({ key: 'value' })).toBe(
        JSON.stringify({ key: 'value' }, null, 2)
      );
      expect(normalizeFileData(1n)).toBe('1');
      expect(normalizeFileData(new Date())).toEqual(expect.any(String));
    });
  });
  describe('readFile', () => {
    it('(async) readFiles file content', async () => {
      const f = await file('r.txt', 'hello world');
      const content = await readFile(f);
      expect(content).toBe('hello world');
    });
    it('(sync) readFiles file content', async () => {
      const f = await file('r.txt', 'hello world').then((v) => {
        expect(readFileSync(v)).toBe('hello world');
      });
    });
  });
  describe('write', () => {
    const testResult = (
      result: WriteFileResult<any>,
      action: string,
      data: any,
      filePath: string,
      ok: boolean,
      conflict: any,
      readData = data
    ) => {
      expect(result.action).toBe(action);
      expect(result.conflict).toBeOneOf([
        false,
        undefined,
        'overwrite',
        'skip',
        'abort',
        'error'
      ]);
      expect(result.conflict).toBe(conflict);
      expect(result.ok).toBe(ok);
      expect(result.data).toBe(data);
      expect(result.filePath).toBe(filePath);
      expect(fs.readFileSync(filePath, 'utf8')).toBe(readData);
      return true;
    };

    describe('(async)', () => {
      it('creates a new file', async () => {
        const f = await file('a.txt');
        expect(
          testResult(
            await writeFile(f, 'hello'),
            'created',
            'hello',
            f,
            true,
            false
          )
        ).toBeTruthy();
      });

      it('overwrites an existing file by default', async () => {
        const f = await file('b.txt');
        const oldData = 'old';
        const newData = 'new';
        fs.writeFileSync(f, oldData);
        expect(
          testResult(
            await writeFile(f, newData),
            'overwritten',
            newData,
            f,
            true,
            'overwrite'
          )
        ).toBeTruthy();
      });

      it('handles skip correctly', async () => {
        const f = await file('c.txt');
        const oldData = 'keep';
        const newData = 'should not write';
        fs.writeFileSync(f, oldData);
        expect(
          testResult(
            await writeFile(f, newData, { conflict: 'skip' }),
            'skipped',
            newData,
            f,
            true,
            'skip',
            oldData
          )
        ).toBeTruthy();
      });

      it('handles abort correctly', async () => {
        const f = await file('d.txt');
        const oldData = 'old';
        const newData = 'fail';
        fs.writeFileSync(f, oldData);
        expect(
          testResult(
            await writeFile(f, newData, { conflict: 'abort' }),
            'aborted',
            newData,
            f,
            true,
            'abort',
            oldData
          )
        ).toBeTruthy();
      });

      it('catches and returns errors correctly', async () => {
        const f = await file('error.txt');
        const oldData = 'old';
        const newData = 'fail';
        fs.writeFileSync(f, oldData);
        expect(
          testResult(
            await writeFile(f, newData, {
              conflict: () => {
                throw new Error('test error');
              }
            }),
            'error',
            newData,
            f,
            false,
            undefined,
            oldData
          )
        ).toBeTruthy();
      });

      it('calls custom conflict function and can skip', async () => {
        const f = await file('e.txt');
        const oldData = 'old';
        const newData = 'should not write';
        fs.writeFileSync(f, oldData);
        let called = false;
        expect(
          testResult(
            await writeFile(f, newData, {
              conflict: () => {
                called = true;
                return 'skip' as const;
              }
            }),
            'skipped',
            newData,
            f,
            true,
            'skip',
            oldData
          )
        ).toBeTruthy();
        expect(called).toBe(true);
      });

      it('calls custom conflict function and can abort', async () => {
        const f = await file('f.txt');
        fs.writeFileSync(f, 'old');
        let called = false;
        expect(
          testResult(
            await writeFile(f, 'new', {
              conflict: () => {
                called = true;
                return 'abort' as const;
              }
            }),
            'aborted',
            'new',
            f,
            true,
            'abort',
            'old'
          )
        ).toBeTruthy();
        expect(called).toBe(true);
      });

      it('calls custom conflict function and falls back to default if nullish returned', async () => {
        const f = await file('b.txt');
        fs.writeFileSync(f, 'old');
        expect(
          testResult(
            await writeFile(f, 'new', { conflict: () => null }),
            'overwritten',
            'new',
            f,
            true,
            'overwrite'
          )
        ).toBeTruthy();
      });

      it('writes to nested directories', async () => {
        const f = await file('nested/deep/g.txt');
        expect(
          testResult(
            await writeFile(f, 'deep'),
            'created',
            'deep',
            f,
            true,
            false
          )
        ).toBeTruthy();
      });

      it('normalizes non-string data', async () => {
        const f = await file('h.json');
        const obj = { a: 1 };
        expect(
          testResult(
            await writeFile(f, obj),
            'created',
            obj,
            f,
            true,
            false,
            JSON.stringify(obj, null, 2)
          )
        ).toBeTruthy();
      });
      it('handles data return from conflict handler', async () => {
        const f = await file('i.txt');
        fs.writeFileSync(f, 'old');
        expect(
          testResult(
            await writeFile(f, 'new', { conflict: () => ({ newData: 'new' }) }),
            'overwritten',
            'new',
            f,
            true,
            'overwrite'
          )
        ).toBeTruthy();
      });
      it('uses custom stringify function if provided', async () => {
        const f = await file('j.txt');
        const obj = { a: 1 };
        expect(
          testResult(
            await writeFile(f, obj, {
              stringify: (data) => JSON.stringify(data)
            }),
            'created',
            obj,
            f,
            true,
            false,
            JSON.stringify(obj)
          )
        ).toBeTruthy();
      });
      it('uses custom reader function if provided', async () => {
        const f = await file('k.txt', JSON.stringify({ hello: 'hello' }));

        const result = await writeFile<{ hello: string }>(
          f,
          { hello: 'world' },
          {
            conflict: (filePath, newData) => {
              const oldData = JSON.parse(
                fs.readFileSync(filePath, { encoding: 'utf8' })
              ) as { hello: string };
              expectTypeOf(newData).toEqualTypeOf<{ hello: string }>();
              return { newData: { ...oldData, ...newData }, oldData };
            }
          }
        );
        expect(result.action).toBe('overwritten');
        expect(result.data).toEqual({ hello: 'world' });
        expect(result.conflict && result.conflict).toEqual('overwrite');
      });
    });
  });
});
