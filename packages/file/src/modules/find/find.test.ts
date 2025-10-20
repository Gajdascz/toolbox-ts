import fs from 'node:fs/promises';
import path from 'node:path';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  findAllDown,
  findAllUp,
  findFirstDown,
  findFirstUp,
  findFirstWhen,
  findFirstWhenRead,
  findLastDown,
  findLastUp,
  findLastWhen,
  findLastWhenRead,
  syncFindAllDown,
  syncFindAllUp,
  syncFindFirstDown,
  syncFindFirstUp,
  syncFindFirstWhen,
  syncFindFirstWhenRead,
  syncFindLastDown,
  syncFindLastUp,
  syncFindLastWhen,
  syncFindLastWhenRead
} from './find.js';

const ROOT = '/root';

const FN1 = 'file1.txt';
const FN2 = 'file2.txt';
const FN3 = 'file3.log';
const FN4 = 'file4.txt';

const D1 = 'l1';
const D2 = 'l2';
const D3 = 'l3';
const D4 = 'l4';

const L1 = path.join(ROOT, D1);
const L2 = path.join(L1, D2);
const L3 = path.join(L2, D3);
const L4 = path.join(L3, D4);
const F1 = path.join(L1, FN1);
const F2 = path.join(L2, FN2);
const F3 = path.join(L3, FN3);
const F4 = path.join(L4, FN4);

const cwdSpy = vi.spyOn(process, 'cwd').mockReturnValue(ROOT);

beforeEach(async () => {
  await fs.mkdir(L4, { recursive: true });
  await Promise.all([
    fs.writeFile(F1, '1'),
    fs.writeFile(F2, '2'),
    fs.writeFile(F3, '3'),
    fs.writeFile(F4, '4')
  ]);
});

describe('find', () => {
  describe('utils', () => {
    it('startDir resolves to process.cwd() if not provided', () => {
      expect(
        syncFindLastWhen((dir) => (dir.endsWith('l1') ? dir : undefined), {
          direction: 'down'
        })
      ).toBe(L1);
    });
    it('endAtDir resolves to cwd root if not provided and up direction', () => {
      expect(
        syncFindLastWhen((dir) => (dir.endsWith('l3') ? dir : undefined), {
          startDir: L4,
          direction: 'up'
        })
      ).toBe(L3);
    });
    it('result resolves to undefined if find returns false', () => {
      expect(
        syncFindFirstWhen(() => false, { startDir: ROOT, direction: 'down' })
      ).toBeNull();
    });
  });
  describe('findFirstWhen()', () => {
    describe('(async)', () => {
      it('down: finds the first matching result', async () => {
        expect(
          await findFirstWhen((dir) => (dir.endsWith('l3') ? dir : undefined), {
            startDir: ROOT,
            direction: 'down'
          })
        ).toBe(L3);
      });
      it('up: finds the first matching result', async () => {
        expect(
          await findFirstWhen((dir) => (dir.endsWith('l1') ? dir : undefined), {
            startDir: L4,
            endDir: ROOT,
            direction: 'up'
          })
        ).toBe(L1);
      });
      it('respects endDir boundary', async () => {
        expect(
          await findFirstWhen((dir) => (dir.endsWith('l2') ? dir : undefined), {
            startDir: L3,
            endDir: L1
          })
        ).toBe(L2);
      });
    });
    describe('(sync)', () => {
      it('down: finds the first matching result', () => {
        expect(
          syncFindFirstWhen((dir) => (dir.endsWith('l3') ? dir : undefined), {
            startDir: ROOT,
            direction: 'down'
          })
        ).toBe(L3);
      });
      it('up: finds the first matching result', () => {
        expect(
          syncFindFirstWhen((dir) => (dir.endsWith('l1') ? dir : undefined), {
            startDir: L4,
            endDir: ROOT,
            direction: 'up'
          })
        ).toBe(L1);
      });
    });
  });
  describe('findFirstWhenRead()', () => {
    describe('(async)', () => {
      it('down: finds the first matching result based on directory content', async () => {
        expect(
          await findFirstWhenRead(
            (_, content) => content.find((f) => f === FN3),
            { startDir: ROOT, direction: 'down' }
          )
        ).toBe(FN3);
      });
      it('up: finds the first matching result based on directory content', async () => {
        expect(
          await findFirstWhenRead(
            (_, content) => content.find((f) => f === FN1),
            { startDir: L4, endDir: ROOT, direction: 'up' }
          )
        ).toBe(FN1);
      });
    });
    describe('(sync)', () => {
      it('down: finds the first matching result based on directory content', () => {
        expect(
          syncFindFirstWhenRead(
            (_, content) => content.find((f) => f === FN3),
            { startDir: ROOT, direction: 'down' }
          )
        ).toBe(FN3);
      });
      it('up: finds the first matching result based on directory content', () => {
        expect(
          syncFindFirstWhenRead(
            (_, content) => content.find((f) => f === FN1),
            { startDir: L4, endDir: ROOT, direction: 'up' }
          )
        ).toBe(FN1);
      });
    });
  });
  describe('findLastWhen()', () => {
    describe('(async)', () => {
      it('down: finds the last matching result', async () => {
        expect(
          await findLastWhen((dir) => (dir.endsWith('l1') ? dir : undefined), {
            startDir: ROOT,
            direction: 'down'
          })
        ).toBe(L1);
      });
      it('up: finds the last matching result', async () => {
        expect(
          await findLastWhen((dir) => (dir.endsWith('l3') ? dir : undefined), {
            startDir: L4,
            endDir: ROOT,
            direction: 'up'
          })
        ).toBe(L3);
      });
    });
    describe('(sync)', () => {
      it('down: finds the last matching result', () => {
        expect(
          syncFindLastWhen((dir) => (dir.endsWith('l1') ? dir : undefined), {
            startDir: ROOT,
            direction: 'down'
          })
        ).toBe(L1);
      });
      it('up: finds the last matching result', () => {
        expect(
          syncFindLastWhen((dir) => (dir.endsWith('l3') ? dir : undefined), {
            startDir: L4,
            endDir: ROOT,
            direction: 'up'
          })
        ).toBe(L3);
      });
    });
  });
  describe('findLastWhenRead()', () => {
    describe('(async)', () => {
      it('down: finds the last matching result based on directory content', async () => {
        expect(
          await findLastWhenRead(
            (_, content) => content.find((f) => f === FN1),
            { direction: 'down' }
          )
        ).toBe(FN1);
      });
      it('up: finds the last matching result based on directory content', async () => {
        expect(
          await findLastWhenRead(
            (_, content) => content.find((f) => f === FN3),
            { startDir: L4, direction: 'up' }
          )
        ).toBe(FN3);
      });
    });
    describe('(sync)', () => {
      it('down: finds the last matching result based on directory content', () => {
        expect(
          syncFindLastWhenRead((_, content) => content.find((f) => f === FN1), {
            startDir: ROOT,
            direction: 'down'
          })
        ).toBe(FN1);
      });
      it('up: finds the last matching result based on directory content', () => {
        expect(
          syncFindLastWhenRead((_, content) => content.find((f) => f === FN3), {
            startDir: L4,
            endDir: ROOT,
            direction: 'up'
          })
        ).toBe(FN3);
      });
    });
  });
  describe('findAllDown()', () => {
    describe('(async)', () => {
      it('finds all matching files', async () => {
        const results = await findAllDown('**/*.txt', { startDir: ROOT });
        expect(results).toEqual(
          expect.arrayContaining([
            expect.stringContaining(path.basename(F1)),
            expect.stringContaining(path.basename(F2)),
            expect.stringContaining(path.basename(F4))
          ])
        );
        expect(results.some((r) => r.endsWith('.log'))).toBe(false);
      });
      it('respects endDir boundary', async () => {
        const results = await findAllDown('**/*.txt', {
          startDir: ROOT,
          endDir: L3
        });
        expect(results).toEqual(
          expect.arrayContaining([
            expect.stringContaining(path.basename(F1)),
            expect.stringContaining(path.basename(F2))
          ])
        );
        expect(results.some((r) => r.endsWith('.log'))).toBe(false);
        expect(results.some((r) => r.endsWith('file4.txt'))).toBe(false);
      });
    });
    describe('(sync)', () => {
      it('finds all matching files', () => {
        const results = syncFindAllDown('**/*.txt', { startDir: ROOT });
        expect(results).toEqual(
          expect.arrayContaining([
            expect.stringContaining(path.basename(F1)),
            expect.stringContaining(path.basename(F2)),
            expect.stringContaining(path.basename(F4))
          ])
        );
        expect(results.some((r) => r.endsWith('.log'))).toBe(false);
      });
      it('respects endDir boundary', () => {
        const results = syncFindAllDown('**/*.txt', {
          startDir: ROOT,
          endDir: L3
        });
        expect(results).toEqual(
          expect.arrayContaining([
            expect.stringContaining(path.basename(F1)),
            expect.stringContaining(path.basename(F2))
          ])
        );
        expect(results.some((r) => r.endsWith('.log'))).toBe(false);
        expect(results.some((r) => r.endsWith('file4.txt'))).toBe(false);
      });
    });
  });
  describe('findAllUp() finds all matching files', () => {
    it('(async)', async () => {
      const results = await findAllUp('**/*.txt', { startDir: L4 });
      expect(results).toEqual(
        expect.arrayContaining([
          expect.stringContaining(path.basename(F1)),
          expect.stringContaining(path.basename(F2)),
          expect.stringContaining(path.basename(F4))
        ])
      );
      expect(results.some((r) => r.endsWith('.log'))).toBe(false);
    });
    it('(sync)', () => {
      const results = syncFindAllUp('**/*.txt', { startDir: L4 });
      expect(results).toEqual(
        expect.arrayContaining([
          expect.stringContaining(path.basename(F1)),
          expect.stringContaining(path.basename(F2)),
          expect.stringContaining(path.basename(F4))
        ])
      );
      expect(results.some((r) => r.endsWith('.log'))).toBe(false);
    });
  });
  describe('findFirstUp() finds the first matching file', () => {
    it('(async)', async () => {
      const result = await findFirstUp('**/*.txt', { startDir: L4 });
      expect(result).toBe(path.resolve(F4));
    });
    it('(sync) finds the first matching file', () => {
      const result = syncFindFirstUp('**/*.txt', { startDir: L4 });
      expect(result).toBe(path.resolve(F4));
    });
  });
  describe('findLastUp() finds the last matching file', () => {
    it('(async)', async () => {
      const result = await findLastUp('**/*.txt', { startDir: L4 });
      expect(result).toBe(path.resolve(F1));
    });
    it('(sync)', () => {
      const result = syncFindLastUp('**/*.txt', { startDir: L4 });
      expect(result).toBe(path.resolve(F1));
    });
  });
  describe('findFirstDown() finds first matching file', () => {
    it('(async)', async () => {
      const result = await findFirstDown('**/*.txt', { startDir: ROOT });
      expect(result).toBe(path.resolve(F1));
    });
    it('(sync)', () => {
      const result = syncFindFirstDown('**/*.txt', { startDir: ROOT });
      expect(result).toBe(path.resolve(F1));
    });
  });
  describe('findLastDown() finds last matching file', () => {
    it('(async)', async () => {
      const result = await findLastDown('**/*.txt', { startDir: ROOT });
      expect(result).toBe(path.resolve(F4));
    });
    it('(sync)', () => {
      const result = syncFindLastDown('**/*.txt', { startDir: ROOT });
      expect(result).toBe(path.resolve(F4));
    });
  });
});
