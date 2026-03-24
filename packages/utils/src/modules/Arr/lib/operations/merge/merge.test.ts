import { describe, it, expect, expectTypeOf } from 'vitest';
import { mergeConcat, mergeUnique, mergePrepend, mergeCombine } from './merge.js';

describe('Array merge', () => {
  it('mergeConcat', () => {
    const r1 = mergeConcat([1, 2], [[3], [4]]);
    expect(r1).toEqual([1, 2, 3, 4]);
    expectTypeOf(r1).toEqualTypeOf<number[]>();
    const r2 = mergeConcat([1, 2], [3, 4]);
    expect(mergeConcat([1, 2], [3, 4])).toEqual([1, 2, 3, 4]);
    expectTypeOf(r2).toEqualTypeOf<number[]>();
  });
  describe('mergeUnique', () => {
    it('concats unique values by default', () => {
      const r1 = mergeUnique([1, 2, 1], [[2], [3]]);
      expect(r1).toEqual([1, 2, 3]);
      expectTypeOf(r1).toEqualTypeOf<number[]>();
      const r2 = mergeUnique([1, 2, 1], [2, 3]);
      expect(r2).toEqual([1, 2, 3]);
      expectTypeOf(r2).toEqualTypeOf<number[]>();
    });
    it('prepends unique values when end is set to prepend', () => {
      const r1 = mergeUnique([1, 2, 1], [[2], [3]], { end: 'prepend' });
      expect(r1).toEqual([2, 3, 1]);
      expectTypeOf(r1).toEqualTypeOf<number[]>();
      const r2 = mergeUnique([1, 2, 1], [2, 3], { end: 'prepend' });
      expect(r2).toEqual([2, 3, 1]);
      expectTypeOf(r2).toEqualTypeOf<number[]>();
    });
  });
  it('mergePrepend', () => {
    const r1 = mergePrepend([1, 2], [[3], ['4']]);
    expect(r1).toEqual([3, '4', 1, 2]);
    expectTypeOf(r1).toEqualTypeOf<(number | string)[]>();
    const r2 = mergePrepend([1, 2], [3, '4']);
    expect(r2).toEqual([3, '4', 1, 2]);
    expectTypeOf(r2).toEqualTypeOf<(number | string)[]>();
  });
  describe('mergeCombine', () => {
    describe('handlers', () => {
      it('uses replace behavior', () => {
        const res = mergeCombine(
          [1, { a: 'old' }, new Map([['old', 'value']]), ['old']],
          [2, { b: 'new' }, new Map([['new', 'value']]), ['new']],
          { handlers: { primitive: 'replace' } }
        );
        expect(res[0]).toBe(2);
        expect(res[1]).toEqual({ b: 'new' });
        expect(res[2]).toEqual(new Map([['new', 'value']]));
        expect(res[3]).toEqual(['new']);
      });
      it('uses custom primitive', () => {
        const sum = mergeCombine([1], [2], {
          handlers: { primitive: (c, n) => Number(c || 0) + Number(n) }
        });
        expect(sum).toEqual([3]);
      });
      it('uses custom object', () => {
        const res = mergeCombine([1], [{ x: 2 }], {
          handlers: { object: (c, n) => ({ ...c, ...n }) }
        });
        expect(res[0]).toEqual({ x: 2 });

        const merged = mergeCombine([{ a: 1 }], [{ b: 2 }], {
          handlers: { object: (c, n) => ({ ...c, ...n }) }
        });
        expect(merged[0]).toEqual({ a: 1, b: 2 });
      });
      it('uses custom objectType', () => {
        const res = mergeCombine([1], [() => 5], {
          handlers: { objectType: (c, n) => ({ prev: c, next: n }) }
        });
        expect(res[0]).toEqual({ prev: 1, next: expect.any(Function) });
        expect((res[0] as any).next()).toBe(5);
      });
      describe('array', () => {
        it('custom', () => {
          const res = mergeCombine([[1]], [[2]], {
            handlers: { array: (c, n) => c.concat(n).concat('handled') }
          });
          expect(res[0]).toEqual([1, 2, 'handled']);
        });
        it('supports behaviors: concat, unique and prepend', () => {
          expect(mergeCombine([[1]], [[2]], { handlers: { array: 'concat' } })[0]).toEqual([1, 2]);
          expect(mergeCombine([[1]], [[1]], { handlers: { array: 'unique' } })[0]).toEqual([1]);
          expect(mergeCombine([[1]], [[2]], { handlers: { array: 'prepend' } })[0]).toEqual([2, 1]);
        });
        describe('recursive', () => {
          it('supports recursive array merging when array handler is recurse', () => {
            const a = [[1, 2]];
            const b = [[4]];
            // recursion merges inner arrays using primitive handler (replace)
            const res = mergeCombine(a as any, b as any, { handlers: { array: 'recurse' } });
            expect(res[0]).toEqual([4, 2]);
          });
          it('honors maxDepth and behaviorAtMaxDepth', () => {
            const a = [[1]];
            const b = [[2]];
            // With maxDepth 0 the internal logic uses the behaviorAtMaxDepth instead of recursing
            const resConcat = mergeCombine(a as any, b as any, {
              handlers: {
                array: 'recurse',
                recursiveArrayOptions: { maxDepth: 0, behaviorAtMaxDepth: 'concat' }
              }
            });
            expect(resConcat[0]).toEqual([1, 2]);

            // default behaviorAtMaxDepth is 'replace' so result should be next array
            const resReplace = mergeCombine(a as any, b as any, {
              handlers: { array: 'recurse', recursiveArrayOptions: { maxDepth: 0 } }
            });
            expect(resReplace[0]).toEqual([2]);
          });
        });
      });
    });

    it('clone option affects whether returned nested arrays reference originals', () => {
      const a = [[1]];
      const b = [[2]];

      const resNone = mergeCombine(a as any, b as any, { clone: 'none' });
      const resDeep = mergeCombine(a as any, b as any, { clone: 'structured' });

      // mutate original b nested array
      (b[0] as number[])[0] = 999;

      // when clone === 'none' the result references the original nested array, so change is visible
      expect((resNone[0] as number[])[0]).toBe(999);

      // when clone === 'deep' the result was structured-cloned and does not reflect later changes
      expect((resDeep[0] as number[])[0]).toBe(2);
    });

    it('works with a mix of types and preserves curr when next is undefined', () => {
      const a = [1, [2], { a: 3 }];
      const b = [undefined, [[4]]];
      const res = mergeCombine(a as any, b as any, {
        handlers: { array: 'concat', object: (c, n) => ({ ...c, ...n }) }
      });
      // index 0: next is undefined -> keep curr
      expect(res[0]).toBe(1);
      // index 1: merges arrays with concat
      expect(res[1]).toEqual([2, [4]]);
      // index 2: next missing -> keep object
      expect(res[2]).toEqual({ a: 3 });
    });
    it('uses custom clone function', () => {
      const customClone = (arr: unknown[]) => arr.map(() => 'cloned');
      const res = mergeCombine([1, 2], [3, 4], { clone: customClone });
      expect(res).toEqual(['cloned', 'cloned']);
    });
    it('sets value to next when current is undefined', () => {
      const res = mergeCombine([1, undefined], [1, 2]);
      expect(res).toEqual([1, 2]);
    });
  });
});
