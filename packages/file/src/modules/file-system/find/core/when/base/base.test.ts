import { describe, expect, it, beforeEach, vi } from 'vitest';
import {
  tryBaseWhen,
  tryBaseWhenSync,
  resolveFirstResult,
  resolveResult,
  resolveWhenOpts
} from './base.js';
import path from 'node:path';
import fs from 'node:fs/promises';
import { accessSync } from 'node:fs';
import type { Traverse } from '../../../../traverse/index.js';
import type { FindResult } from '../../types.js';

const ROOT = '/root';
const L1 = path.join(ROOT, 'l1');
const L2 = path.join(L1, 'l2');
const L3 = path.join(L2, 'l3');
const TARGET_FILE = 'target.txt';
const F_ROOT = path.join(ROOT, TARGET_FILE);
const F_L1 = path.join(L1, TARGET_FILE);
const F_L2 = path.join(L2, TARGET_FILE);

vi.stubGlobal('process', { cwd: () => L3 });

beforeEach(async () => {
  await fs.mkdir(L3, { recursive: true });
  await Promise.all([
    fs.writeFile(F_ROOT, 'root'),
    fs.writeFile(F_L1, 'l1'),
    fs.writeFile(F_L2, 'l2')
  ]);
});

const fileExistsInSync = (dir: string) => {
  const target = path.join(dir, TARGET_FILE);
  try {
    return (accessSync(target), target);
  } catch {
    return false;
  }
};

const fileExistsIn = async (dir: string) => {
  const target = path.join(dir, TARGET_FILE);
  return fs.access(target).then(
    () => target,
    () => false
  );
};

// Does not break on match — allows traversal to collect all results
const resolveAllResults = <R = string>(result: FindResult<R>): Traverse.OnDirResult<R> =>
  ({ break: false, ...resolveResult(result) }) as Traverse.OnDirResult<R>;

describe('File.Find (base)', () => {
  describe('tryBaseWhen', () => {
    describe('should find the first (nearest) file traversing up', () => {
      it('[async]', async () => {
        const result = await tryBaseWhen(fileExistsIn, resolveFirstResult, 'first', {
          direction: 'up'
        });
        expect(result).toEqual({ ok: true, detail: F_L2 });
      });
      it('[sync]', () => {
        const result = tryBaseWhenSync(fileExistsInSync, resolveFirstResult, 'first', {
          direction: 'up'
        });
        expect(result).toEqual({ ok: true, detail: F_L2 });
      });
    });

    describe('should find the last (farthest) file traversing up', () => {
      it('[async]', async () => {
        const result = await tryBaseWhen(fileExistsIn, resolveAllResults, 'last', {
          direction: 'up'
        });
        expect(result).toEqual({ ok: true, detail: F_ROOT });
      });
      it('[sync]', () => {
        const result = tryBaseWhenSync(fileExistsInSync, resolveAllResults, 'last', {
          direction: 'up'
        });
        expect(result).toEqual({ ok: true, detail: F_ROOT });
      });
    });

    describe('should find the first (nearest) file traversing down', () => {
      it('[async]', async () => {
        const result = await tryBaseWhen(fileExistsIn, resolveFirstResult, 'first', {
          direction: 'down',
          startDir: ROOT
        });
        expect(result).toEqual({ ok: true, detail: F_ROOT });
      });
      it('[sync]', () => {
        const result = tryBaseWhenSync(fileExistsInSync, resolveFirstResult, 'first', {
          direction: 'down',
          startDir: ROOT
        });
        expect(result).toEqual({ ok: true, detail: F_ROOT });
      });
    });

    describe('should find the last (farthest) file traversing down', () => {
      it('[async]', async () => {
        const result = await tryBaseWhen(fileExistsIn, resolveAllResults, 'last', {
          direction: 'down',
          startDir: ROOT
        });
        expect(result).toEqual({ ok: true, detail: F_L2 });
      });
      it('[sync]', () => {
        const result = tryBaseWhenSync(fileExistsInSync, resolveAllResults, 'last', {
          direction: 'down',
          startDir: ROOT
        });
        expect(result).toEqual({ ok: true, detail: F_L2 });
      });
    });

    describe('should return null if file does not exist in any directory', () => {
      it('[async]', async () => {
        const result = await tryBaseWhen(async () => false, resolveFirstResult, 'first', {});
        expect(result).toEqual({ ok: true, detail: null });
      });
      it('[sync]', () => {
        const result = tryBaseWhenSync(() => false, resolveFirstResult, 'first', {});
        expect(result).toEqual({ ok: true, detail: null });
      });
    });

    describe('should return an error if find throws', () => {
      const error = new Error('find error');
      it('[async]', async () => {
        const result = await tryBaseWhen(
          async () => {
            throw error;
          },
          resolveFirstResult,
          'first',
          {}
        );
        expect(result.ok).toBe(false);
        expect(!result.ok && result.error).toBeInstanceOf(Error);
      });
      it('[sync]', () => {
        const result = tryBaseWhenSync(
          () => {
            throw error;
          },
          resolveFirstResult,
          'first',
          {}
        );
        expect(result.ok).toBe(false);
        expect(!result.ok && result.error).toBeInstanceOf(Error);
      });
    });
  });

  describe('helpers', () => {
    describe('resolveWhenOpts', () => {
      it('should return default values', () => {
        const opts = resolveWhenOpts();
        expect(opts).toMatchObject({
          startDir: process.cwd(),
          direction: 'up',
          endDir: path.parse(process.cwd()).root
        });
      });
      it('should override default values with provided options', () => {
        const customOpts = { startDir: '/start', direction: 'down', endDir: '/end' } as const;
        const opts = resolveWhenOpts(customOpts);
        expect(opts).toMatchObject(customOpts);
      });
      it('should set endDir to root when direction is up and endDir is not provided', () => {
        const opts = resolveWhenOpts({ startDir: '/start', direction: 'up' });
        expect(opts.endDir).toBe(path.parse('/start').root);
      });
      it('should set endDir to undefined when direction is down and endDir is not provided', () => {
        const opts = resolveWhenOpts({ startDir: '/start', direction: 'down' });
        expect(opts.endDir).toBeUndefined();
      });
    });

    describe('resolveResult', () => {
      it('should return undefined when result is false', () => {
        expect(resolveResult(false)).toMatchObject({ result: undefined });
      });
      it('should return the result when it is truthy', () => {
        expect(resolveResult('test')).toMatchObject({ result: 'test' });
      });
    });

    describe('resolveFirstResult', () => {
      it('should return break true when result is truthy', () => {
        expect(resolveFirstResult('test')).toMatchObject({ break: true, result: 'test' });
      });
      it('should return break false when result is falsy', () => {
        expect(resolveFirstResult(false)).toMatchObject({ break: false, result: undefined });
      });
    });
  });
});
