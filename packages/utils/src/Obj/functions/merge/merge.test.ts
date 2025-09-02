import { describe, expect, it } from 'vitest';

import { merge, mergeArr } from './merge.ts';

describe('mergeArr', () => {
  it('behavior: (default) overwrite returns a deep clone of next', () => {
    const curr = [{ a: 1 }];
    const next = [{ b: 2 }];
    const out = mergeArr(curr, next, { array: { behavior: 'overwrite' } });
    expect(out).toEqual(next);
    expect(out).not.toBe(next);
    expect(out[0]).not.toBe(next[0]);
    (out[0] as any).b = 3;
    expect((next[0] as any).b).toBe(2);
  });

  it('behavior: append concatenates arrays', () => {
    const curr = [1, 2];
    const next = [2, 3];
    const out = mergeArr(curr, next, { array: { behavior: 'append' } });
    expect(out).toEqual([1, 2, 2, 3]);
    expect(out).not.toBe(curr);
    expect(out).not.toBe(next);
  });

  it('behavior: prepend concatenates with next first', () => {
    const curr = [1, 2];
    const next = [3, 4];
    const out = mergeArr(curr, next, { array: { behavior: 'prepend' } });
    expect(out).toEqual([3, 4, 1, 2]);
  });

  it('throws on unknown array behavior', () => {
    expect(() => mergeArr([1], [2], { array: 'bogus' as any })).toThrow();
  });
  it('filters result when filter function provided', () => {
    const curr = [1, 2, 3, 4];
    const next = [3, 4, 5, 6];
    const out = mergeArr(curr, next, {
      array: {
        behavior: 'append',
        filter: (item) => (item as number) % 2 === 0
      }
    });
    expect(out).toEqual([2, 4, 4, 6]);
  });
  it('dedupes result when dedupe is true', () => {
    const curr = [1, 2, 3, 4];
    const next = [3, 4, 5, 6];
    const out = mergeArr(curr, next, {
      array: { behavior: 'append', dedupe: true }
    });
    expect(out).toEqual([1, 2, 3, 4, 5, 6]);
  });
});

describe('merge', () => {
  it('returns current as-is when next is not an object', () => {
    const current = { a: 1 };
    const out = merge(current, 42 as any);
    expect(out).toBe(current);
  });
  it('returns current as-is when current is not an object', () => {
    const out = merge(42 as any, { a: 1 });
    expect(out).toBe(42);
  });

  it('handles arrays: merges when current has array, clones when current is not array', () => {
    const current = { arr: [1, 2], arr2: 'not-array' };
    const next = { arr: [2, 3], arr2: [{ x: 1 }] };
    const out = merge(current, next, {
      array: { behavior: 'append', dedupe: false }
    });
    // arr uses mergeArr with default "append"
    expect(out.arr).toEqual([1, 2, 2, 3]);
    // arr2 is cloned from next
    expect(out.arr2).toEqual([{ x: 1 }]);
    expect(out.arr2).not.toBe(next.arr2);
    // deep clone check (assuming clone does deep clone)
    (next.arr2 as any)[0].x = 999;
    expect((out.arr2 as any)[0].x).toBe(1);
  });

  it('overwrites primitives', () => {
    const current = { n: 1, s: 'old', b: false };
    const next = { n: 2, s: 'new', b: true };
    const out = merge(current, next);
    expect(out).toEqual({ n: 2, s: 'new', b: true });
  });

  it('retainEmptyObjectProps: keeps empty objects from next even if current has data', () => {
    const current = { keep: { filled: true }, keep2: { x: 1 } };
    const next = { keep: {}, keep2: {} };
    const out = merge(current, next, { retainEmptyObjectProps: true });
    expect(out.keep).toEqual({});
    expect(out.keep2).toEqual({});
  });

  it('without retainEmptyObjectProps: merging {} leaves current object intact', () => {
    const current = { keep: { a: 1 } };
    const next = { keep: {} };
    const out = merge(current, next, { retainEmptyObjectProps: false });
    expect(out.keep).toEqual({ a: 1 });
  });

  it('merges nested objects and clones new object props', () => {
    const current = { nested: { a: 1, inner: { x: 1 } } };
    const next = {
      nested: { b: 2, inner: { y: 2 } },
      added: { deep: { v: 1 } }
    };
    const out = merge(current, next);

    // nested merged
    expect(out.nested).toEqual({ a: 1, b: 2, inner: { x: 1, y: 2 } });

    // "added" was cloned, not referenced
    expect(out.added).toEqual({ deep: { v: 1 } });
    expect(out.added).not.toBe(next.added);
    expect((out.added as any).deep).not.toBe((next.added as any).deep);

    // mutate next to verify cloning
    (next.added as any).deep.v = 999;
    expect((out.added as any).deep.v).toBe(1);
  });

  it('ignores prototype-polluting keys from next', () => {
    const current = { safe: true };

    // create a "next" with own "__proto__" and "constructor" keys as data properties
    const next = Object.create(null) as Record<string, unknown>;
    next.__proto__ = { polluted: true };
    //@ts-expect-error - testing prototype pollution protection
    next.constructor = { evil: true };

    const out = merge(current, next);

    // should not gain own "constructor" or "__proto__" props
    expect(Object.prototype.hasOwnProperty.call(out, 'constructor')).toBe(
      false
    );
    expect(Object.prototype.hasOwnProperty.call(out, '__proto__')).toBe(false);

    // Object.prototype must not be polluted
    expect({}).not.toHaveProperty('polluted');

    // existing props remain
    expect(out.safe).toBe(true);
  });
});
