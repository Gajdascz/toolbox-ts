import { describe, it, expect } from 'vitest';
import { initMerge, initMergeAll } from './core.js';

const date = new Date('2024-01-01');
const map = new Map([['a', 1]]);
const set = new Set([1, 2]);

//#region> initMerge
describe('initMerge', () => {
  describe('nullish current', () => {
    it('returns next when current is null and next is a value', () => {
      expect(initMerge(null, { a: 1 })).toEqual({ a: 1 });
    });
    it('returns next when current is undefined and next is a value', () => {
      expect(initMerge(undefined, { a: 1 })).toEqual({ a: 1 });
    });
    it('returns {} when both current and next are null', () => {
      expect(initMerge(null, null)).toEqual({});
    });
    it('returns {} when current is null and next is undefined', () => {
      expect(initMerge(null, undefined)).toEqual({});
    });
  });

  describe('non-object current', () => {
    it('throws when current is a primitive (number)', () => {
      expect(() => initMerge(42 as unknown, { a: 1 })).toThrow();
    });
    it('throws when current is a string', () => {
      expect(() => initMerge('str' as unknown, { a: 1 })).toThrow();
    });
  });

  describe('non-object or maxDepth < 0 next', () => {
    it('returns current when next is not a plain object', () => {
      const current = { a: 1 };
      expect(initMerge(current, 'not-an-object' as unknown)).toEqual({ a: 1 });
    });
    it('returns current when maxDepth < 0', () => {
      const current = { a: 1 };
      expect(initMerge(current, { a: 2 }, -1)).toEqual({ a: 1 });
    });
  });

  describe('null value behavior', () => {
    it('overwrites with null by default (nullBehavior: overwrite)', () => {
      expect(initMerge({ a: 1 }, { a: null })).toEqual({ a: null });
    });
    it('skips null when nullBehavior is skip', () => {
      expect(initMerge({ a: 1 }, { a: null }, Infinity, { on: { null: 'skip' } })).toEqual({
        a: 1
      });
    });
    it('deletes key when nullBehavior is omit', () => {
      const result = initMerge({ a: 1 }, { a: null }, Infinity, { on: { null: 'omit' } });
      expect(result).toEqual({});
      expect('a' in result).toBe(false);
    });
  });

  describe('undefined next values', () => {
    it('skips undefined values from next, preserving current', () => {
      expect(initMerge({ a: 1 }, { a: undefined })).toEqual({ a: 1 });
    });
  });

  describe('null/undefined current value — handleReplace path', () => {
    it('sets primitive value when current key is undefined', () => {
      expect(initMerge({}, { a: 42 })).toEqual({ a: 42 });
    });
    it('sets primitive value when current key is null (via overwrite)', () => {
      const step1 = initMerge({ a: 1 }, { a: null }) as { a: null };
      expect(initMerge(step1, { a: 99 })).toEqual({ a: 99 });
    });
    it('sets array value when current key is undefined', () => {
      expect(initMerge({}, { a: [1, 2, 3] })).toEqual({ a: [1, 2, 3] });
    });
    it('sets empty array when current key is undefined and next is []', () => {
      expect(initMerge({}, { a: [] })).toEqual({ a: [] });
    });
    it('sets plain object when current key is undefined', () => {
      expect(initMerge({}, { a: { b: 1 } })).toEqual({ a: { b: 1 } });
    });
    it('sets non-plain object (Date) when current key is undefined', () => {
      const result = initMerge({} as { a?: Date }, { a: date }) as { a: Date };
      expect(result.a).toBeInstanceOf(Date);
    });
  });

  describe('key handlers', () => {
    it('invokes key handler for specified key', () => {
      const result = initMerge({ a: 1, b: 2 }, { a: 10, b: 20 }, Infinity, {
        on: { key: { a: (curr, next) => (curr as number) + next } }
      });
      expect(result).toEqual({ a: 11, b: 20 });
    });
    it('uses replace strategy for key handler when set to replace', () => {
      const result = initMerge({ a: { x: 1, y: 2 } }, { a: { x: 99 } }, Infinity, {
        on: { key: { a: 'replace' } }
      });
      // 'replace' handler calls handleReplace which clones next
      expect(result).toEqual({ a: { x: 99 } });
    });
  });

  describe('primitive merging', () => {
    it('replaces primitive values by default', () => {
      expect(initMerge({ a: 1, b: 'old', c: true }, { a: 2, b: 'new', c: false })).toEqual({
        a: 2,
        b: 'new',
        c: false
      });
    });
    it('uses custom primitive handler', () => {
      const result = initMerge({ a: 10, b: 5 }, { a: 3, b: 2 }, Infinity, {
        on: { primitive: (curr, next) => (curr as number) * (next as number) }
      });
      expect(result).toEqual({ a: 30, b: 10 });
    });
  });

  describe('array merging', () => {
    it('replaces arrays by default', () => {
      expect(initMerge({ a: [1, 2, 3] }, { a: [4, 5] })).toEqual({ a: [4, 5] });
    });
    it('skips empty arrays by default', () => {
      expect(initMerge({ a: [1, 2] }, { a: [] })).toEqual({ a: [1, 2] });
    });
    it('overwrites with empty arrays when emptyArray is overwrite', () => {
      expect(
        initMerge({ a: [1, 2] }, { a: [] }, Infinity, { on: { emptyArray: 'overwrite' } })
      ).toEqual({ a: [] });
    });
    it('concatenates arrays with concat strategy', () => {
      expect(
        initMerge({ a: [1, 2] }, { a: [3, 4] }, Infinity, { on: { array: 'concat' } })
      ).toEqual({ a: [1, 2, 3, 4] });
    });
    it('prepends arrays with prepend strategy', () => {
      expect(
        initMerge({ a: [1, 2] }, { a: [3, 4] }, Infinity, { on: { array: 'prepend' } })
      ).toEqual({ a: [3, 4, 1, 2] });
    });
    it('deduplicates with unique strategy', () => {
      expect(
        initMerge({ a: [1, 2, 3] }, { a: [2, 3, 4] }, Infinity, { on: { array: 'unique' } })
      ).toEqual({ a: [1, 2, 3, 4] });
    });
    it('uses custom array handler', () => {
      const result = initMerge({ a: [1, 2] }, { a: [3, 4] }, Infinity, {
        on: { array: (_curr, next) => next.map((n: number) => n * 10) }
      });
      expect(result).toEqual({ a: [30, 40] });
    });
  });

  describe('non-plain object merging', () => {
    it('replaces non-plain objects (Date) by default', () => {
      const d1 = new Date('2023-01-01');
      const d2 = new Date('2024-06-15');
      const result = initMerge({ a: d1 }, { a: d2 }) as { a: Date };
      expect(result.a.toISOString()).toBe(d2.toISOString());
    });
    it('replaces Map by default', () => {
      const result = initMerge({ a: new Map([['x', 1]]) }, { a: map }) as {
        a: Map<string, number>;
      };
      expect(result.a).toBeInstanceOf(Map);
      expect(result.a.get('a')).toBe(1);
    });
    it('replaces Set by default', () => {
      const result = initMerge({ a: new Set([99]) }, { a: set }) as { a: Set<number> };
      expect(result.a).toBeInstanceOf(Set);
      expect(result.a.has(1)).toBe(true);
    });
  });

  describe('empty plain object merging', () => {
    it('skips empty plain objects by default', () => {
      expect(initMerge({ a: { x: 1 } }, { a: {} })).toEqual({ a: { x: 1 } });
    });
    it('overwrites with empty plain objects when emptyObject is overwrite', () => {
      expect(
        initMerge({ a: { x: 1 } }, { a: {} }, Infinity, { on: { emptyObject: 'overwrite' } })
      ).toEqual({ a: {} });
    });
  });

  describe('depth limiting', () => {
    const deep = { a: { b: { c: { d: 1 } } } };
    const next = { a: { b: { c: { d: 99, e: 2 } } } };

    it('replaces the plain object at maxDepth (depth = 0)', () => {
      expect(initMerge({ a: { x: 1 } }, { a: { y: 2 } }, 0)).toEqual({ a: { y: 2 } });
    });
    it('merges 1 level deep at depth = 1 but replaces at level 2', () => {
      const result = initMerge(deep, next, 1) as typeof deep;
      // depth=1: a is merged, b is replaced
      expect(result.a.b).toEqual({ c: { d: 99, e: 2 } });
    });
    it('merges fully at Infinity (default)', () => {
      expect(initMerge(deep, next)).toEqual({ a: { b: { c: { d: 99, e: 2 } } } });
    });
  });

  describe('deep recursive merging', () => {
    it('deep merges nested objects', () => {
      expect(initMerge({ a: { b: 1, c: 2 }, d: 3 }, { a: { b: 10, e: 5 }, f: 6 })).toEqual({
        a: { b: 10, c: 2, e: 5 },
        d: 3,
        f: 6
      });
    });
    it('recurses when current key is not a plain object (initialises to {})', () => {
      // current.a is a string, next.a is a plain object → current.a becomes {}
      // then merges next.a into it
      expect(initMerge({ a: 'primitive' }, { a: { x: 1 } })).toEqual({ a: { x: 1 } });
    });
    it('correctly increments and uses depth counter across recursion', () => {
      const base = { a: { b: { c: { d: 0 } } } };
      const patch = { a: { b: { c: { d: 1 }, e: 2 } } };
      expect(initMerge(base, patch, 2)).toEqual({ a: { b: { c: { d: 1 }, e: 2 } } });
    });
  });

  describe('clone strategies', () => {
    it('does not mutate original base with default cloning', () => {
      const base = { a: { b: 1 } };
      initMerge(base, { a: { b: 99 } });
      expect(base.a.b).toBe(1);
    });
    it('mutates original base when clone is none', () => {
      const base = { a: 1 };
      initMerge(base, { a: 99 }, Infinity, { clone: 'none' });
      expect(base.a).toBe(99);
    });
    it('works with structured clone strategy', () => {
      const base = { a: { b: 1 } };
      const result = initMerge(base, { a: { c: 2 } }, Infinity, { clone: 'structured' });
      expect(result).toEqual({ a: { b: 1, c: 2 } });
      expect(base.a).toEqual({ b: 1 });
    });
    it('works with deep clone strategy', () => {
      const base = { a: { b: 1 } };
      const result = initMerge(base, { a: { c: 2 } }, Infinity, { clone: 'deep' });
      expect(result).toEqual({ a: { b: 1, c: 2 } });
    });
    it('works with clone: false', () => {
      const base = { a: 1 };
      initMerge(base, { a: 99 }, Infinity, { clone: false });
      expect(base.a).toBe(99);
    });
  });

  describe('new key addition', () => {
    it('adds keys present in next but not in current', () => {
      expect(initMerge({ a: 1 }, { b: 2 })).toEqual({ a: 1, b: 2 });
    });
  });
});
//#endregion

//#region> initMergeAll
describe('initMergeAll', () => {
  describe('nullish base', () => {
    it('treats null base as {}', () => {
      expect(initMergeAll(null, [{ a: 1 }])).toEqual({ a: 1 });
    });
    it('treats undefined base as {}', () => {
      expect(initMergeAll(undefined, [{ a: 1 }])).toEqual({ a: 1 });
    });
  });

  describe('non-object base', () => {
    it('throws when base is a primitive', () => {
      expect(() => initMergeAll(42 as unknown, [{ a: 1 }])).toThrow();
    });
  });

  describe('maxDepth < 0', () => {
    it('returns base immediately when maxDepth < 0', () => {
      expect(initMergeAll({ a: 1 }, [{ a: 99 }], -1)).toEqual({ a: 1 });
    });
  });

  describe('nullish items in next', () => {
    it('skips null items in the next array', () => {
      expect(initMergeAll({ a: 1 }, [null, { b: 2 }, null])).toEqual({ a: 1, b: 2 });
    });
    it('skips undefined items in the next array', () => {
      expect(initMergeAll({ a: 1 }, [undefined, { b: 3 }])).toEqual({ a: 1, b: 3 });
    });
    it('returns cloned base when all next items are nullish', () => {
      const base = { a: 1 };
      const result = initMergeAll(base, [null, undefined]);
      expect(result).toEqual({ a: 1 });
    });
  });

  describe('merge precedence', () => {
    it('last object has highest precedence', () => {
      expect(initMergeAll({ a: 1 }, [{ a: 2 }, { a: 3 }])).toEqual({ a: 3 });
    });
    it('accumulates all non-conflicting keys across objects', () => {
      expect(initMergeAll({ a: 1 }, [{ b: 2 }, { c: 3 }])).toEqual({ a: 1, b: 2, c: 3 });
    });
  });

  describe('deep merging', () => {
    it('deep merges multiple objects', () => {
      expect(initMergeAll({ a: { x: 1, y: 2 } }, [{ a: { x: 10 } }, { a: { z: 3 } }])).toEqual({
        a: { x: 10, y: 2, z: 3 }
      });
    });
  });

  describe('options passthrough', () => {
    it('respects nullBehavior omit across all items', () => {
      const result = initMergeAll({ a: 1, b: 2 }, [{ a: null }, { b: null }], Infinity, {
        on: { null: 'omit' }
      });
      expect(result).toEqual({});
      expect('a' in result).toBe(false);
      expect('b' in result).toBe(false);
    });
    it('respects array concat strategy across all items', () => {
      expect(
        initMergeAll({ a: [1] }, [{ a: [2] }, { a: [3] }], Infinity, { on: { array: 'concat' } })
      ).toEqual({ a: [1, 2, 3] });
    });
    it('does not mutate original base with default cloning', () => {
      const base = { a: { b: 1 } };
      initMergeAll(base, [{ a: { b: 99 } }]);
      expect(base.a.b).toBe(1);
    });
    it('respects maxDepth', () => {
      expect(initMergeAll({ a: { b: { c: 1 } } }, [{ a: { b: { c: 2, d: 3 } } }], 1)).toEqual({
        a: { b: { c: 2, d: 3 } }
      });
    });
  });

  describe('empty next array', () => {
    it('returns cloned base when next is empty', () => {
      const base = { a: 1 };
      expect(initMergeAll(base, [])).toEqual({ a: 1 });
    });
  });
});
//#endregion
