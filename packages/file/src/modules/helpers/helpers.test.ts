import fs from 'node:fs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  arrayToQueueLike,
  hasDirs,
  hasFiles,
  initQueueLike,
  isDir,
  isFile,
  type QueueLike,
  size,
  sizeSync,
  syncHasDirs,
  syncHasFiles,
  syncIsDir,
  syncIsFile
} from './helpers.ts';

const CWD = '/test/mock';

vi.stubGlobal('process', { ...process, cwd: () => CWD });
vi.spyOn(process, 'cwd').mockReturnValue(CWD);

beforeEach(async () => {
  await fs.promises.mkdir(CWD, { recursive: true });
});
describe('helpers', () => {
  describe('isDir', () => {
    describe('(async)', () => {
      it('returns true for directories', async () => {
        expect(await isDir(CWD)).toBe(true);
      });
      it('returns false for files', async () => {
        const file = CWD + '/file.txt';
        fs.writeFileSync(file, 'x');
        expect(await isDir(file)).toBe(false);
      });
      it('returns false for non-existent paths', async () => {
        expect(await isDir(CWD + '/nope')).toBe(false);
      });
    });
    describe('(sync)', () => {
      it('returns true for directories', () => {
        fs.mkdirSync(CWD, { recursive: true });
        expect(syncIsDir(CWD)).toBe(true);
      });
      it('returns false for files', () => {
        const file = CWD + '/file.txt';
        fs.writeFileSync(file, 'x');
        expect(syncIsDir(file)).toBe(false);
      });
      it('returns false for non-existent paths', () => {
        expect(syncIsDir(CWD + '/nope')).toBe(false);
      });
    });
  });
  describe('isFile', () => {
    describe('(async)', () => {
      it('returns true for files', async () => {
        const file = CWD + '/file2.txt';
        fs.writeFileSync(file, 'x');
        expect(await isFile(file)).toBe(true);
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
        const file = CWD + '/file2.txt';
        fs.writeFileSync(file, 'x');
        expect(syncIsFile(file)).toBe(true);
      });
      it('returns false for directories', () => {
        fs.mkdirSync(CWD + '/adir', { recursive: true });
        expect(syncIsFile(CWD + '/adir')).toBe(false);
      });
      it('returns false for non-existent paths', () => {
        expect(syncIsFile(CWD + '/nope2')).toBe(false);
      });
    });
  });
  describe('size', () => {
    describe('(async)', () => {
      it('returns file size in bytes', async () => {
        const file = CWD + '/file3.txt';
        fs.writeFileSync(file, '12345');
        expect(await size(file)).toBe(5);
      });
      it('returns null for non-existent paths', async () => {
        expect(await size(CWD + '/nope3')).toBe(null);
      });
    });
    describe('(sync)', () => {
      it('returns file size in bytes', () => {
        const file = CWD + '/file3.txt';
        fs.writeFileSync(file, '12345');
        expect(sizeSync(file)).toBe(5);
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
      expect(q.clone()).not.toBe(q);
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
        expect(syncHasFiles(dir, ['file1.txt', 'file2.txt'])).toBe(true);
      });
      it('returns false if any specified file does not exist in directory', () => {
        const dir = CWD + '/dir2-sync';
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(dir + '/file1.txt', 'x');
        expect(syncHasFiles(dir, ['file1.txt', 'file2.txt'])).toBe(false);
      });
      it('returns false if directory does not exist', () => {
        expect(
          syncHasFiles(CWD + '/nope-dir-sync', ['file1.txt', 'file2.txt'])
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
        expect(syncHasDirs(dir, ['sub1', 'sub2'])).toBe(true);
      });
      it('returns false if any specified dir does not exist in directory', () => {
        const dir = CWD + '/dir2-sync';
        fs.mkdirSync(dir + '/sub1', { recursive: true });
        expect(syncHasDirs(dir, ['sub1', 'sub2'])).toBe(false);
      });
      it('returns false if directory does not exist', () => {
        expect(syncHasDirs(CWD + '/nope-dir-sync', ['sub1', 'sub2'])).toBe(
          false
        );
      });
    });
  });
});
