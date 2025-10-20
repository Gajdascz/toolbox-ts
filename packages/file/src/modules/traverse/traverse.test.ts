import fs from 'node:fs';
import path from 'node:path';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  syncTraverseDown,
  syncTraverseUp,
  traverseDown,
  traverseToParent,
  traverseUp
} from './traverse.js';

const join = path.posix.join;
const PROJECT_ROOT = '/project';
const SRC_DIR = join(PROJECT_ROOT, 'src');
const NESTED_DIR = join(SRC_DIR, 'nested');
const DEEPER_DIR = join(NESTED_DIR, 'deeper');
const STOP_DIR = join(PROJECT_ROOT, 'stop');

// class ClonableQueue implements QueueLike {
//   public cloneCalls = 0;
//   get length(): number {
//     return this.store.length;
//   }

//   private store: (null | string)[];

//   constructor(initial: (null | string)[] = []) {
//     this.store = [...initial];
//   }

//   clone(): ClonableQueue {
//     this.cloneCalls += 1;
//     return new ClonableQueue(this.store);
//   }

//   dequeue(): string | undefined {
//     const value = this.store.shift();
//     return value === null || value === undefined ? undefined : value;
//   }

//   enqueue(...items: string[]) {
//     this.store.push(...items);
//   }
// }

beforeEach(async () => {
  await fs.promises.mkdir(DEEPER_DIR, { recursive: true });
});

describe('traverseToParent', () => {
  it('returns the parent directory while respecting end boundaries', () => {
    expect(traverseToParent(DEEPER_DIR)).toBe(NESTED_DIR);
    expect(traverseToParent('/')).toBeNull();
    expect(traverseToParent(SRC_DIR, SRC_DIR)).toBeNull();
  });
});

describe('traverseUp', () => {
  describe('(async)', () => {
    it('aggregates results until break', async () => {
      const visited: string[] = [];
      const results = await traverseUp(
        (dir) => {
          visited.push(dir);
          if (dir === PROJECT_ROOT) {
            return {
              break: true,
              result: [`break:${path.posix.basename(dir)}`]
            };
          }
          return { break: false, result: dir };
        },
        { startDir: DEEPER_DIR, endAtDir: '/' }
      );

      expect(visited).toEqual([DEEPER_DIR, NESTED_DIR, SRC_DIR, PROJECT_ROOT]);
      expect(results).toEqual([
        DEEPER_DIR,
        NESTED_DIR,
        SRC_DIR,
        'break:project'
      ]);
    });
    it('handles start equal to end with a custom result handler', async () => {
      const captured: string[] = [];
      const handler = vi.fn(
        (res: string | string[], acc: string[], dir?: string) => {
          const values = Array.isArray(res) ? res : [res];
          captured.push(...values);
          acc.push(...values);
          expect(dir).toBe(SRC_DIR);
        }
      );

      const results = await traverseUp(
        (dir) => ({ break: false, result: dir }),
        { startDir: SRC_DIR, endAtDir: SRC_DIR, resultHandler: handler }
      );

      expect(handler).toHaveBeenCalledTimes(1);
      expect(captured).toEqual([SRC_DIR]);
      expect(results).toEqual([SRC_DIR]);
    });
    it('does not traverse endAtDir', async () => {
      const visited: string[] = [];
      const results = await traverseUp(
        (dir) => {
          visited.push(dir);
          return { break: false, result: dir };
        },
        { startDir: DEEPER_DIR, endAtDir: SRC_DIR }
      );

      expect(visited).toEqual([DEEPER_DIR, NESTED_DIR]);
      expect(results).toEqual([DEEPER_DIR, NESTED_DIR]);
    });
  });
  describe('(sync)', () => {
    it('mirrors upward traversal with break', () => {
      const visited: string[] = [];
      const results = syncTraverseUp(
        (dir) => {
          visited.push(dir);
          if (dir === PROJECT_ROOT) {
            return { break: true, result: dir.toUpperCase() };
          }
          return { break: false, result: dir };
        },
        { startDir: DEEPER_DIR, endAtDir: '/' }
      );

      expect(visited).toEqual([DEEPER_DIR, NESTED_DIR, SRC_DIR, PROJECT_ROOT]);
      expect(results).toEqual([
        DEEPER_DIR,
        NESTED_DIR,
        SRC_DIR,
        PROJECT_ROOT.toUpperCase()
      ]);
    });

    it('handles start equal to end with a custom result handler', () => {
      const captured: string[] = [];
      const handler = vi.fn(
        (res: string | string[], acc: string[], dir?: string) => {
          const values = Array.isArray(res) ? res : [res];
          captured.push(...values);
          acc.push(...values);
          expect(dir).toBe(SRC_DIR);
        }
      );

      const results = syncTraverseUp((dir) => ({ break: false, result: dir }), {
        startDir: SRC_DIR,
        endAtDir: SRC_DIR,
        resultHandler: handler
      });

      expect(handler).toHaveBeenCalledTimes(1);
      expect(captured).toEqual([SRC_DIR]);
      expect(results).toEqual([SRC_DIR]);
    });

    it('does not traverse endAtDir', () => {
      const visited: string[] = [];
      const results = syncTraverseUp(
        (dir) => {
          visited.push(dir);
          return { break: false, result: dir };
        },
        { startDir: DEEPER_DIR, endAtDir: SRC_DIR }
      );

      expect(visited).toEqual([DEEPER_DIR, NESTED_DIR]);
      expect(results).toEqual([DEEPER_DIR, NESTED_DIR]);
    });
  });
});

describe('traverseDown', () => {
  describe('(async)', () => {
    it('performs breadth-first traversal and stops on break', async () => {
      const visited: string[] = [];
      await fs.promises.mkdir(STOP_DIR, { recursive: true });
      const results = await traverseDown(
        (dir) => {
          visited.push(dir);
          return { break: false, result: dir };
        },
        { startDir: PROJECT_ROOT, endAtDir: STOP_DIR }
      );

      expect(visited[0]).toBe(PROJECT_ROOT);
      expect(results.at(-1)).not.toBe(STOP_DIR);
      expect(visited).not.toContain(DEEPER_DIR);
    });
    it('handles start equal to end with a custom result handler', async () => {
      const captured: string[] = [];
      const handler = vi.fn(
        (res: string | string[], acc: string[], dir?: string) => {
          const values = Array.isArray(res) ? res : [res];
          captured.push(...values);
          acc.push(...values);
          expect(dir).toBe(SRC_DIR);
        }
      );

      const results = await traverseDown(
        (dir) => ({ break: false, result: dir }),
        { startDir: SRC_DIR, endAtDir: SRC_DIR, resultHandler: handler }
      );

      expect(handler).toHaveBeenCalledTimes(1);
      expect(captured).toEqual([SRC_DIR]);
      expect(results).toEqual([SRC_DIR]);
    });
    it('breaks when onDir signals to break', async () => {
      const visited: string[] = [];
      const results = await traverseDown(
        (dir) => {
          visited.push(dir);
          return dir === NESTED_DIR ?
              { break: true, result: dir }
            : { break: false, result: dir };
        },
        { startDir: PROJECT_ROOT, endAtDir: STOP_DIR }
      );

      expect(visited).toEqual([PROJECT_ROOT, SRC_DIR, NESTED_DIR]);
      expect(results).toEqual([PROJECT_ROOT, SRC_DIR, NESTED_DIR]);
    });
  });
  describe('(sync)', () => {
    it('performs breadth-first traversal and stops on break', () => {
      const visited: string[] = [];
      fs.mkdirSync(STOP_DIR, { recursive: true });
      const results = syncTraverseDown(
        (dir) => {
          visited.push(dir);
          return { break: false, result: dir };
        },
        { startDir: PROJECT_ROOT, endAtDir: STOP_DIR }
      );
      expect(visited[0]).toBe(PROJECT_ROOT);
      expect(results.at(-1)).not.toBe(STOP_DIR);
      expect(visited).not.toContain(DEEPER_DIR);
    });
    it('handles start equal to end with a custom result handler', () => {
      const captured: string[] = [];
      const handler = vi.fn(
        (res: string | string[], acc: string[], dir?: string) => {
          const values = Array.isArray(res) ? res : [res];
          captured.push(...values);
          acc.push(...values);
          expect(dir).toBe(SRC_DIR);
        }
      );

      const results = syncTraverseDown(
        (dir) => ({ break: false, result: dir }),
        { startDir: SRC_DIR, endAtDir: SRC_DIR, resultHandler: handler }
      );
      expect(handler).toHaveBeenCalledTimes(1);
      expect(captured).toEqual([SRC_DIR]);
      expect(results).toEqual([SRC_DIR]);
    });
    it('breaks when onDir signals to break', () => {
      const visited: string[] = [];
      const results = syncTraverseDown(
        (dir) => {
          visited.push(dir);
          return dir === NESTED_DIR ?
              { break: true, result: dir }
            : { break: false, result: dir };
        },
        { startDir: PROJECT_ROOT, endAtDir: STOP_DIR }
      );

      expect(visited).toEqual([PROJECT_ROOT, SRC_DIR, NESTED_DIR]);
      expect(results).toEqual([PROJECT_ROOT, SRC_DIR, NESTED_DIR]);
    });
  });
});
