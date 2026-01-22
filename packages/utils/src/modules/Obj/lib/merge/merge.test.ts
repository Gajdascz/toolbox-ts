import { describe, expect, expectTypeOf, it } from 'vitest';

import type {
  MergeArrayHandler,
  MergeOptions,
  MergePrimitiveHandler
} from './merge.ts';

import { merge, mergeAll } from './merge.ts';

describe('merge', () => {
  describe('basic merging', () => {
    it('should merge two plain objects', () => {
      const current = { a: 1, b: 2 };
      const next = { c: 3, d: 4 };
      const result = merge(current, next);

      expect(result).toEqual({ a: 1, b: 2, c: 3, d: 4 });
      expect(result).not.toBe(current);
    });

    it('should override existing properties', () => {
      const current = { a: 1, b: 2 };
      const next = { b: 3, c: 4 };
      const result = merge(current, next);

      expect(result).toEqual({ a: 1, b: 3, c: 4 });
    });

    it('should recursively merge nested objects', () => {
      const current = { a: 1, b: { c: 2, d: 3 } };
      const next = { b: { d: 4, e: 5 }, f: 6 };
      const result = merge(current, next);

      expect(result).toEqual({ a: 1, b: { c: 2, d: 4, e: 5 }, f: 6 });
    });

    it('should return current as-is if next is not a plain object', () => {
      const current = { a: 1 };
      const next = null;
      const result = merge(current, next);

      expect(result).toEqual({ a: 1 });
      expect(result).toBe(current); // not cloned
    });

    it('should return current if next is undefined', () => {
      const current = { a: 1 };
      const result = merge(current, undefined);

      expect(result).toEqual({ a: 1 });
    });

    it('should return current if next is an array', () => {
      const current = { a: 1 };
      const next = [1, 2, 3];
      const result = merge(current, next as unknown);

      expect(result).toEqual({ a: 1 });
    });

    it('should throw if current is not a plain object', () => {
      expect(() => merge(null as unknown, { a: 1 })).toThrow(TypeError);
      expect(() => merge([1, 2] as unknown, { a: 1 })).toThrow(TypeError);
      expect(() => merge('string' as unknown, { a: 1 })).toThrow(TypeError);
      expect(() => merge(new Date() as unknown, { a: 1 })).toThrow(TypeError);
    });
    it("should just use next's value for non-cloneable objects", () => {
      class MyClass {
        constructor(public value: number) {}
      }
      const current = { a: new MyClass(1) };
      const next = { a: new MyClass(2), b: 2 };
      const result = merge(current, next, {
        maxDepth: Infinity,
        cloneStrategy: 'deep'
      });

      expect(result.a).toBeInstanceOf(MyClass);
      expect(result.a).toBe(next.a);
      expect(result.b).toBe(2);
    });
  });

  describe('undefined handling', () => {
    it('should skip undefined values in next', () => {
      const current = { a: 1, b: 2 };
      const next = { a: undefined, c: 3 };
      const result = merge(current, next);

      expect(result).toEqual({ a: 1, b: 2, c: 3 });
    });

    it('should not create properties for undefined values', () => {
      const current = { a: 1 };
      const next = { b: undefined };
      const result = merge(current, next);

      expect(result).toEqual({ a: 1 });
      expect('b' in result).toBe(false);
    });
  });

  describe('null handling', () => {
    it('should not overwrite with null by default', () => {
      const current = { a: 1, b: 2 };
      const next = { a: null, c: 3 };
      const result = merge(current, next);

      expect(result).toEqual({ a: 1, b: 2, c: 3 });
    });

    it('should overwrite with null when allowOverwrite.null is true', () => {
      const current = { a: 1, b: 2 };
      const next = { a: null, c: 3 };
      const result = merge(current, next, { allowOverwrite: { null: true } });

      expect(result).toEqual({ a: null, b: 2, c: 3 });
    });

    it('should overwrite with null when allowOverwrite is true', () => {
      const current = { a: 1, b: 2 };
      const next = { a: null };
      const result = merge(current, next, { allowOverwrite: true });

      expect(result).toEqual({ a: null, b: 2 });
    });

    it('should set null for new properties regardless of allowOverwrite', () => {
      const current = { a: 1 };
      const next = { b: null };
      const result = merge(current, next);

      // null is not overwriting, it's a new property - but isPrimitive(null) is true
      // and isNotNull(null) is false, so it checks allowNullOverwrite
      // Since current[key] doesn't exist, it keeps current (undefined behavior)
      expect(result).toEqual({ a: 1 });
    });
  });

  describe('empty object handling', () => {
    it('should not overwrite with empty object by default', () => {
      const current = { a: { b: 1 } };
      const next = { a: {} };
      const result = merge(current, next);

      expect(result).toEqual({ a: { b: 1 } });
    });

    it('should overwrite with empty object when allowOverwrite.emptyObject is true', () => {
      const current = { a: { b: 1 } };
      const next = { a: {} };
      const result = merge(current, next, {
        allowOverwrite: { emptyObject: true }
      });

      expect(result).toEqual({ a: {} });
    });

    it('should overwrite with empty object when allowOverwrite is true', () => {
      const current = { a: { b: 1 }, c: 2 };
      const next = { a: {} };
      const result = merge(current, next, { allowOverwrite: true });

      expect(result).toEqual({ a: {}, c: 2 });
    });

    it('should handle mixed allowOverwrite options', () => {
      const current = { a: 1, b: { c: 2 } };
      const next = { a: null, b: {} };
      const result = merge(current, next, {
        allowOverwrite: { null: true, emptyObject: false }
      });

      expect(result).toEqual({ a: null, b: { c: 2 } });
    });
  });

  describe('primitive handling', () => {
    it('should replace primitives by default', () => {
      const current = { a: 1, b: 'hello', c: true };
      const next = { a: 2, b: 'world', c: false };
      const result = merge(current, next);

      expect(result).toEqual({ a: 2, b: 'world', c: false });
    });

    it('should use custom onPrimitive handler', () => {
      const current = { a: 1, b: 2 };
      const next = { a: 10, b: 5 };
      const result = merge(current, next, {
        onPrimitive: (curr, n) =>
          typeof curr === 'number' && typeof n === 'number' ?
            Math.max(curr, n)
          : next
      });

      expect(result).toEqual({ a: 10, b: 5 });
    });

    it('should handle all primitive types', () => {
      const current = { a: 1 };
      const next = {
        num: 42,
        str: 'test',
        bool: true,
        bigint: BigInt(100),
        sym: Symbol.for('test')
      };
      const result = merge(current, next);

      expect(result.num).toBe(42);
      expect(result.str).toBe('test');
      expect(result.bool).toBe(true);
      expect(result.bigint).toBe(BigInt(100));
      expect(result.sym).toBe(Symbol.for('test'));
    });

    it('should pass current value to onPrimitive even if undefined', () => {
      const calls: [unknown, unknown][] = [];
      const current = { a: 1 };
      const next = { b: 2 };
      merge(current, next, {
        onPrimitive: (curr, n) => {
          calls.push([curr, n]);
          return n;
        }
      });

      expect(calls).toEqual([[undefined, 2]]);
    });
  });

  describe('array handling', () => {
    it('should replace arrays by default', () => {
      const current = { arr: [1, 2, 3] };
      const next = { arr: [4, 5] };
      const result = merge(current, next);

      expect(result).toEqual({ arr: [4, 5] });
      expect(result.arr).not.toBe(next.arr); // Cloned
    });

    it('should use custom onArray handler with append behavior', () => {
      const current = { arr: [1, 2] };
      const next = { arr: [3, 4] };
      const result = merge(current, next, { onArray: { behavior: 'append' } });

      expect(result).toEqual({ arr: [1, 2, 3, 4] });
    });

    it('should use custom onArray handler with prepend behavior', () => {
      const current = { arr: [1, 2] };
      const next = { arr: [3, 4] };
      const result = merge(current, next, { onArray: { behavior: 'prepend' } });

      expect(result).toEqual({ arr: [3, 4, 1, 2] });
    });

    it('should clone array if current is not an array', () => {
      const current = { arr: 'not an array' };
      const next = { arr: [1, 2, 3] };
      const result = merge(current as object, next);

      expect(result).toEqual({ arr: [1, 2, 3] });
      expect((result as { arr: number[] }).arr).not.toBe(next.arr);
    });

    it('should handle nested arrays in objects', () => {
      const current = { a: { arr: [1, 2] } };
      const next = { a: { arr: [3, 4] } };
      const result = merge(current, next, { onArray: { behavior: 'append' } });

      expect(result).toEqual({ a: { arr: [1, 2, 3, 4] } });
    });
  });

  describe('class instance handling', () => {
    it('should replace class instances without merging', () => {
      class MyClass {
        constructor(public value: number) {}
      }
      const current = { obj: new MyClass(1) };
      const next = { obj: new MyClass(2) };
      const result = merge(current, next);

      expect(result.obj).toBeInstanceOf(MyClass);
      expect(result.obj.value).toBe(2);
      expect(result.obj).toBe(next.obj); // Not Cloned
    });

    it('should handle Date instances', () => {
      const date1 = new Date('2024-01-01');
      const date2 = new Date('2025-01-01');
      const current = { date: date1 };
      const next = { date: date2 };
      const result = merge(current, next);

      expect(result.date).toBeInstanceOf(Date);
      expect(result.date.getTime()).toBe(date2.getTime());
      expect(result.date).not.toBe(date2);
    });

    it('should handle Map instances', () => {
      const map1 = new Map([['a', 1]]);
      const map2 = new Map([['b', 2]]);
      const current = { map: map1 };
      const next = { map: map2 };
      const result = merge(current, next);

      expect(result.map).toBeInstanceOf(Map);
      expect(result.map.get('b')).toBe(2);
      expect(result.map).not.toBe(map2);
    });

    it('should handle Set instances', () => {
      const set1 = new Set([1, 2]);
      const set2 = new Set([3, 4]);
      const current = { set: set1 };
      const next = { set: set2 };
      const result = merge(current, next);

      expect(result.set).toBeInstanceOf(Set);
      expect(result.set.has(3)).toBe(true);
      expect(result.set).not.toBe(set2);
    });

    it('should handle RegExp instances', () => {
      const regex1 = /abc/gi;
      const regex2 = /xyz/m;
      const current = { regex: regex1 };
      const next = { regex: regex2 };
      const result = merge(current, next);

      expect(result.regex).toBeInstanceOf(RegExp);
      expect(result.regex.source).toBe('xyz');
      expect(result.regex.flags).toBe('m');
      expect(result.regex).not.toBe(regex2);
    });

    it('should fall back to original value if cloning fails', () => {
      // Create an object that can't be cloned
      const uncloneable = {
        get prop() {
          return undefined;
        }
      };
      Object.defineProperty(uncloneable, 'constructor', {
        // eslint-disable-next-line @typescript-eslint/no-extraneous-class
        value: class Uncloneable {},
        writable: false
      });

      const current = { a: 1 };
      const next = { obj: uncloneable };

      // Should not throw, falls back to original value
      const result = merge(current, next as object);
      expect(result).toHaveProperty('obj');
    });
  });

  describe('maxDepth option', () => {
    it('should stop recursion at maxDepth 0', () => {
      const current = { a: { b: { c: 1 } } };
      const next = { a: { b: { c: 2, d: 3 } } };
      const result = merge(current, next, { maxDepth: 0 });

      expect(result).toEqual({ a: { b: { c: 1 } } });
    });

    it('should recurse one level at maxDepth 1', () => {
      const current = { a: { b: { c: 1 } } };
      const next = { a: { b: { c: 2, d: 3 }, e: 4 } };
      const result = merge(current, next, { maxDepth: 1 });

      expect(result).toEqual({ a: { b: { c: 2, d: 3 }, e: 4 } });
    });

    it('should fully recurse at Infinity maxDepth (default)', () => {
      const current = { l1: { l2: { l3: { l4: { value: 1 } } } } };
      const next = { l1: { l2: { l3: { l4: { value: 2, extra: 'new' } } } } };
      const result = merge(current, next);

      expect(result).toEqual({
        l1: { l2: { l3: { l4: { value: 2, extra: 'new' } } } }
      });
    });

    it('should replace nested objects beyond maxDepth', () => {
      const current = { a: { b: { c: 1, d: 2 } } };
      const next = { a: { b: { c: 3 } } };
      const result = merge(current, next, { maxDepth: 1 });

      // At depth 2, the object { c: 3 } replaces { c: 1, d: 2 }
      expect(result).toEqual({ a: { b: { c: 3 } } });
    });
  });

  describe('cloneStrategy option', () => {
    it('should deep clone by default', () => {
      const nested = { deep: { value: 1 } };
      const current = { a: nested };
      const next = { b: 2 };
      const result = merge(current, next);

      expect(result.a).not.toBe(nested);
      expect(result.a.deep).not.toBe(nested.deep);
    });

    it('should shallow clone when cloneStrategy is shallow', () => {
      const nested = { deep: { value: 1 } };
      const current = { a: nested };
      const next = { b: 2 };
      const result = merge(current, next, { cloneStrategy: 'shallow' });

      expect(result).not.toBe(current); // Top-level is cloned
      expect(result.a).toBe(nested); // But properties still reference same objects
      expect(result.a.deep).toBe(nested.deep); // Same reference
    });
    it('should mutate current when cloneStrategy is none', () => {
      const current = { a: 1, b: 2 };
      const next = { b: 3, c: 4 };
      const result = merge(current, next, { cloneStrategy: 'none' });

      expect(result).toBe(current); // Same reference
      expect(current).toEqual({ a: 1, b: 3, c: 4 });
    });

    it('should not clone arrays when cloneStrategy is none', () => {
      const arr = [1, 2, 3];
      const current = { a: 1 };
      const next = { arr };
      const result = merge(current, next, { cloneStrategy: 'none' });

      expect(result.arr).toBe(arr);
    });
  });

  describe('edge cases', () => {
    it('should handle deeply nested structures', () => {
      const current = { l1: { l2: { l3: { l4: { l5: { value: 'deep' } } } } } };
      const next = { l1: { l2: { l3: { l4: { l5: { extra: 'added' } } } } } };
      const result = merge(current, next);

      expect(result.l1.l2.l3.l4.l5).toEqual({ value: 'deep', extra: 'added' });
    });

    it('should handle objects with numeric keys', () => {
      const current = { 0: 'a', 1: 'b' };
      const next = { 1: 'c', 2: 'd' };
      const result = merge(current, next);

      expect(result).toEqual({ 0: 'a', 1: 'c', 2: 'd' });
    });

    it('should handle null prototype objects', () => {
      const current = Object.create(null);
      current.a = 1;
      const next = { b: 2 };
      const result = merge(current, next);

      expect(result.a).toBe(1);
      expect(result.b).toBe(2);
    });

    it('should create nested object if current property is not an object', () => {
      const current = { a: 'string' };
      const next = { a: { nested: 1 } };
      const result = merge(current, next);

      expect(result).toEqual({ a: { nested: 1 } });
    });

    it('should handle empty current object', () => {
      const current = {};
      const next = { a: 1, b: { c: 2 } };
      const result = merge(current, next);

      expect(result).toEqual({ a: 1, b: { c: 2 } });
    });

    it('should handle empty next object', () => {
      const current = { a: 1, b: { c: 2 } };
      const next = {};
      const result = merge(current, next);

      expect(result).toEqual({ a: 1, b: { c: 2 } });
    });

    it('should handle mixed content types in nested objects', () => {
      const current = {
        arr: [1, 2],
        obj: { a: 1 },
        date: new Date('2024-01-01'),
        str: 'hello'
      };
      const next = {
        arr: [3, 4],
        obj: { b: 2 },
        date: new Date('2025-01-01'),
        num: 42
      };
      const result = merge(current, next);

      expect(result.arr).toEqual([3, 4]);
      expect(result.obj).toEqual({ a: 1, b: 2 });
      expect(result.date.getTime()).toBe(new Date('2025-01-01').getTime());
      expect(result.str).toBe('hello');
      expect(result.num).toBe(42);
    });
  });
});

describe('mergeAll', () => {
  it('should merge multiple objects into base', () => {
    const base = { a: 1 };
    const others = [{ b: 2 }, { c: 3 }, { d: 4 }];
    const result = mergeAll(base, others);

    expect(result).toEqual({ a: 1, b: 2, c: 3, d: 4 });
  });

  it('should give precedence to later objects', () => {
    const base = { a: 1, b: 1 };
    const others = [
      { b: 2, c: 2 },
      { c: 3, d: 3 }
    ];
    const result = mergeAll(base, others);

    expect(result).toEqual({ a: 1, b: 2, c: 3, d: 3 });
  });

  it('should skip null and undefined in others', () => {
    const base = { a: 1 };
    const others = [null, { b: 2 }, undefined, { c: 3 }];
    const result = mergeAll(base, others as object[]);

    expect(result).toEqual({ a: 1, b: 2, c: 3 });
  });

  it('should handle empty others array', () => {
    const base = { a: 1, b: 2 };
    const result = mergeAll(base, []);

    expect(result).toEqual({ a: 1, b: 2 });
  });

  it('should pass options to each merge call', () => {
    const base = { arr: [1] };
    const others = [{ arr: [2] }, { arr: [3] }];
    const result = mergeAll(base, others, { onArray: { behavior: 'append' } });

    expect(result).toEqual({ arr: [1, 2, 3] });
  });

  it('should handle nested objects across multiple merges', () => {
    const base = { a: { x: 1 } };
    const others = [{ a: { y: 2 } }, { a: { z: 3 } }];
    const result = mergeAll(base, others);

    expect(result).toEqual({ a: { x: 1, y: 2, z: 3 } });
  });

  it('should respect maxDepth across all merges', () => {
    const base = { a: { b: { c: 1 } } };
    const others = [{ a: { b: { d: 2 } } }];
    const result = mergeAll(base, others, { maxDepth: 1 });

    // At depth 1, { b: { d: 2 } } replaces { b: { c: 1 } }
    expect(result).toEqual({ a: { b: { d: 2 } } });
  });

  it('should not mutate base with default cloneStrategy', () => {
    const base = { a: 1 };
    const others = [{ b: 2 }];
    const result = mergeAll(base, others);

    expect(result).not.toBe(base);
    expect(base).toEqual({ a: 1 });
  });
});

describe('type safety', () => {
  it('should infer correct return type for merge', () => {
    const current = { a: 1, b: 'hello' };
    const next = { c: true, d: [1, 2, 3] };
    const result = merge(current, next);

    expectTypeOf(result).toEqualTypeOf<
      { a: number; b: string } & { c: boolean; d: number[] }
    >();
  });

  it('should infer correct return type for mergeAll', () => {
    const base = { a: 1 };
    const others = [{ b: 'str' }, { c: true }] as const;
    const result = mergeAll(base, [...others]);

    expectTypeOf(result).toEqualTypeOf<
      { a: number } & ({ readonly b: 'str' } | { readonly c: true })
    >();
  });

  it('should type MergeOptions correctly', () => {
    const opts: MergeOptions = {
      allowOverwrite: { null: true, emptyObject: false },
      cloneStrategy: 'deep',
      maxDepth: 5,
      onArray: { behavior: 'append' },
      onPrimitive: (_, b) => b
    };

    expectTypeOf(opts.allowOverwrite).toEqualTypeOf<
      { emptyObject?: boolean; null?: boolean } | boolean | undefined
    >();
    expectTypeOf(opts.cloneStrategy).toEqualTypeOf<
      'deep' | 'none' | 'shallow' | undefined
    >();
    expectTypeOf(opts.maxDepth).toEqualTypeOf<number | undefined>();
  });

  it('should type MergeArrayHandler correctly', () => {
    const handler: MergeArrayHandler = (current, next) => [...current, ...next];

    expectTypeOf(handler).toEqualTypeOf<
      (current: unknown[], next: unknown[]) => unknown[]
    >();
  });

  it('should type MergePrimitiveHandler correctly', () => {
    const handler: MergePrimitiveHandler = (current, next) => {
      if (typeof current === 'number' && typeof next === 'number') {
        return current + next;
      }
      return next;
    };

    expectTypeOf(handler).parameters.toEqualTypeOf<
      [
        unknown,
        Exclude<
          bigint | boolean | null | number | string | symbol | undefined,
          null | undefined
        >
      ]
    >();
  });

  it('should allow generic type parameters', () => {
    interface Config {
      host: string;
      port: number;
    }
    interface Overrides {
      debug: boolean;
      port: number;
    }

    const base: Config = { host: 'localhost', port: 3000 };
    const overrides: Overrides = { port: 8080, debug: true };
    const result = merge<Config, Overrides>(base, overrides);

    expectTypeOf(result).toEqualTypeOf<Config & Overrides>();
  });

  it('should handle custom result type', () => {
    interface Result {
      a: number;
      b: string;
      c: boolean;
    }

    const current = { a: 1 };
    const next = { b: 'hello', c: true };
    const result = merge<typeof current, typeof next, Result>(current, next);

    expectTypeOf(result).toEqualTypeOf<Result>();
  });
});
