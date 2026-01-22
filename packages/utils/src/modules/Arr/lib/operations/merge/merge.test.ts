import { describe, expect, it } from 'vitest';

import { merge, type MergeItemHandler } from './merge.ts';

describe('merge', () => {
  describe('append behavior', () => {
    it('should append arrays in order', () => {
      const result = merge({ behavior: 'append' }, [1, 2], [3, 4], [5, 6]);
      expect(result).toEqual([1, 2, 3, 4, 5, 6]);
    });

    it('should handle empty arrays', () => {
      const result = merge({ behavior: 'append' }, [], [1, 2], []);
      expect(result).toEqual([1, 2]);
    });

    it('should handle single array', () => {
      const result = merge({ behavior: 'append' }, [1, 2, 3]);
      expect(result).toEqual([1, 2, 3]);
    });

    it('should handle arrays with different types', () => {
      const result = merge({ behavior: 'append' }, ['a', 'b'], ['c', 'd']);
      expect(result).toEqual(['a', 'b', 'c', 'd']);
    });
  });

  describe('prepend behavior', () => {
    it('should prepend arrays in reverse order', () => {
      const result = merge({ behavior: 'prepend' }, [1, 2], [3, 4], [5, 6]);
      expect(result).toEqual([5, 6, 3, 4, 1, 2]);
    });

    it('should handle empty arrays', () => {
      const result = merge({ behavior: 'prepend' }, [], [1, 2], []);
      expect(result).toEqual([1, 2]);
    });

    it('should handle single array', () => {
      const result = merge({ behavior: 'prepend' }, [1, 2, 3]);
      expect(result).toEqual([1, 2, 3]);
    });

    it('should handle arrays with different types', () => {
      const result = merge({ behavior: 'prepend' }, ['a', 'b'], ['c', 'd']);
      expect(result).toEqual(['c', 'd', 'a', 'b']);
    });
  });
  describe('overwrite behavior', () => {
    it('should return last defined array', () => {
      const result = merge({ behavior: 'overwrite' }, [1, 2], [3, 4], [5, 6]);
      expect(result).toEqual([5, 6]);
    });

    it('should skip undefined arrays', () => {
      const result = merge(
        { behavior: 'overwrite' },
        [1, 2],
        undefined as unknown as number[],
        [5, 6]
      );
      expect(result).toEqual([5, 6]);
    });

    it('should return first array if others are undefined', () => {
      const result = merge(
        { behavior: 'overwrite' },
        [1, 2],
        undefined as unknown as number[],
        undefined as unknown as number[]
      );
      expect(result).toEqual([1, 2]);
    });

    it('should return empty array if all arrays are undefined', () => {
      const result = merge(
        { behavior: 'overwrite' },
        undefined as unknown as number[],
        undefined as unknown as number[],
        undefined as unknown as number[]
      );
      expect(result).toEqual([]);
    });

    it('should handle single array', () => {
      const result = merge({ behavior: 'overwrite' }, [1, 2, 3]);
      expect(result).toEqual([1, 2, 3]);
    });
  });
  describe('unique behavior', () => {
    it('should remove duplicate values', () => {
      const result = merge({ behavior: 'unique' }, [1, 2, 2, 3], [3, 4, 4, 5]);
      expect(result).toEqual([1, 2, 3, 4, 5]);
    });
    it('should use comparator function if provided', () => {
      const comparator = (a: number, b: number) => a === b;
      const result = merge(
        { behavior: 'unique', comparator },
        [1, 2, 2, 3],
        [3, 4, 4, 5]
      );
      expect(result).toEqual([1, 2, 3, 4, 5]);
    });
  });
  describe('per-item merge function behavior', () => {
    it('should merge items using custom function', () => {
      const mergeFn: MergeItemHandler<number[]> = (current, incoming) =>
        current + incoming;
      const result = merge(
        { behavior: 'per-item', handler: mergeFn },
        [1, 2, 3],
        [10, 20, 30]
      );
      expect(result).toEqual([11, 22, 33]);
    });

    it('should handle arrays of different lengths', () => {
      const mergeFn: MergeItemHandler<number[]> = (current, incoming) =>
        current + incoming;
      const result = merge(
        { behavior: 'per-item', handler: mergeFn },
        [1, 2],
        [10, 20, 30, 40]
      );
      expect(result).toEqual([11, 22, 30, 40]);
    });

    it('should handle first array longer than others', () => {
      const mergeFn: MergeItemHandler<number[]> = (current, incoming) =>
        current + incoming;
      const result = merge(
        { behavior: 'per-item', handler: mergeFn },
        [1, 2, 3, 4],
        [10, 20]
      );
      expect(result).toEqual([11, 22, 3, 4]);
    });

    it('should provide index to merge function', () => {
      const indices: number[] = [];
      const mergeFn: MergeItemHandler<number[]> = (
        current,
        incoming,
        index
      ) => {
        indices.push(index);
        return current + incoming;
      };
      merge(
        { behavior: 'per-item', handler: mergeFn },
        [1, 2, 3],
        [10, 20, 30]
      );
      expect(indices).toEqual([0, 1, 2]);
    });

    it('should handle multiple arrays with custom function', () => {
      const mergeFn: MergeItemHandler<number[]> = (current, incoming) =>
        current + incoming;
      const result = merge(
        { behavior: 'per-item', handler: mergeFn },
        [1, 2],
        [10, 20],
        [100, 200]
      );
      expect(result).toEqual([111, 222]);
    });

    it('should handle undefined values in arrays', () => {
      const mergeFn: MergeItemHandler<(number | undefined)[]> = (
        current,
        incoming
      ) => (current ?? 0) + (incoming ?? 0);
      const result = merge(
        { behavior: 'per-item', handler: mergeFn },
        [1, undefined, 3],
        [10, 20, undefined],
        [undefined, 200, 300]
      );
      expect(result).toEqual([11, 220, 303]);
    });

    it('should use incoming value when current is undefined', () => {
      const mergeFn: MergeItemHandler<number[]> = (current, incoming) =>
        current + incoming;
      const arr1: number[] = [];
      arr1[2] = 3;
      const result = merge(
        { behavior: 'per-item', handler: mergeFn },
        arr1,
        [10, 20, 30]
      );
      expect(result).toEqual([10, 20, 33]);
    });

    it('should keep current value when incoming is undefined', () => {
      const mergeFn: MergeItemHandler<number[]> = (current, incoming) =>
        current + incoming;
      const arr2: number[] = [];
      arr2[1] = 20;
      const result = merge(
        { behavior: 'per-item', handler: mergeFn },
        [1, 2, 3],
        arr2
      );
      expect(result).toEqual([1, 22, 3]);
    });

    it('should handle string concatenation', () => {
      const mergeFn: MergeItemHandler<string[]> = (current, incoming) =>
        current + incoming;
      const result = merge(
        { behavior: 'per-item', handler: mergeFn },
        ['a', 'b'],
        ['x', 'y']
      );
      expect(result).toEqual(['ax', 'by']);
    });

    it('should handle object merging', () => {
      interface Obj {
        value: number;
      }
      const mergeFn: MergeItemHandler<Obj[]> = (current, incoming) => ({
        value: current.value + incoming.value
      });
      const result = merge(
        { behavior: 'per-item', handler: mergeFn },
        [{ value: 1 }, { value: 2 }],
        [{ value: 10 }, { value: 20 }]
      );
      expect(result).toEqual([{ value: 11 }, { value: 22 }]);
    });
  });

  describe('error handling', () => {
    it('should throw error for unknown behavior', () => {
      expect(() =>
        merge({ behavior: 'unknown' } as any, [1, 2], [3, 4])
      ).toThrow();
    });
    it('should throw error when custom handler is not provided for per-item behavior', () => {
      expect(() =>
        merge({ behavior: 'per-item' } as any, [1, 2], [3, 4])
      ).toThrow();
    });
  });

  describe('edge cases', () => {
    it('should handle empty input arrays for append', () => {
      const result = merge({ behavior: 'append' });
      expect(result).toEqual([]);
    });

    it('should handle empty input arrays for prepend', () => {
      const result = merge({ behavior: 'prepend' });
      expect(result).toEqual([]);
    });

    it('should handle empty input arrays for overwrite', () => {
      const result = merge({ behavior: 'overwrite' });
      expect(result).toEqual([]);
    });

    it('should handle empty input arrays for custom function', () => {
      const mergeFn: MergeItemHandler<number[]> = (current, incoming) =>
        current + incoming;
      const result = merge({ behavior: 'per-item', handler: mergeFn });
      expect(result).toEqual([]);
    });

    it('should handle arrays with mixed types using custom function', () => {
      const mergeFn: MergeItemHandler<(number | string)[]> = (
        current,
        incoming
      ) => `${current}-${incoming}`;
      const result = merge(
        { behavior: 'per-item', handler: mergeFn },
        [1, 'a', 3],
        ['x', 2, 'z']
      );
      expect(result).toEqual(['1-x', 'a-2', '3-z']);
    });
  });
});
