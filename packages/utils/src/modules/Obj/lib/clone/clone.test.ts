import { describe, expect, expectTypeOf, it, vi } from 'vitest';

import { clone, cloneDeep, cloneShallow } from './clone.ts';

describe('clone', () => {
  describe('cloneShallow', () => {
    it('should create copy of a simple object', () => {
      const original = { a: 1, b: 2, c: 3 };
      const result = cloneShallow(original);

      expect(result).toEqual(original);
      expect(result).not.toBe(original);
    });
    it('should preserve object structure', () => {
      const original = Object.create(null, {
        a: { value: 1, writable: false }
      });
      const result = cloneShallow(original, {
        preservePlainObjectStructure: true
      });
      expect(Object.getPrototypeOf(result)).toBe(null);
      expect(Object.getOwnPropertyDescriptor(result, 'a')?.writable).toBe(
        false
      );
    });

    it('should handle objects with various value types', () => {
      const original = {
        num: 42,
        str: 'hello',
        bool: true,
        nil: null,
        undef: undefined,
        date: new Date('2024-01-01'),
        regex: /test/gi
      };
      const result = cloneShallow(original);

      expect(result).toEqual(original);
      expect(result).not.toBe(original);
      expect(result.date).toBe(original.date); // Same reference (shallow)
      expect(result.regex).toBe(original.regex); // Same reference (shallow)
    });

    it('should handle numeric keys', () => {
      const original = { 0: 'zero', 1: 'one', name: 'test' };
      const result = cloneShallow(original);

      expect(result).toEqual(original);
      expect(result).not.toBe(original);
    });

    it('should handle empty objects', () => {
      const original = {};
      const result = cloneShallow(original);
      expect(result).toEqual({});
      expect(result).not.toBe(original);
    });

    it('should type result correctly', () => {
      const original = { a: 1, b: 'test' };
      const result = cloneShallow(original);
      expectTypeOf(result).toEqualTypeOf<{ a: number; b: string }>();
    });
    it('should return the original value when cloning non-cloneable values', () => {
      const original = Symbol('test');
      const result = cloneShallow(original);
      expect(result).toBe(original);
    });

    it('should handle array', () => {
      const original = [1, 2, 3];
      const result = cloneShallow(original);
      expect(result).toEqual(original);
      expect(result).not.toBe(original);
    });
    describe('built-in types', () => {
      it('should handle Date', () => {
        const date = new Date('2024-01-01');
        const clonedDate = cloneShallow(date);
        expect(clonedDate).toEqual(date);
        expect(clonedDate).not.toBe(date);
      });
      it('should handle RegExp', () => {
        const regex = /test/gi;
        const clonedRegex = cloneShallow(regex);
        expect(clonedRegex).toEqual(regex);
        expect(clonedRegex).not.toBe(regex);
      });
      it('should handle Map', () => {
        const map = new Map([
          ['key1', 'value1'],
          ['key2', 'value2']
        ]);
        const clonedMap = cloneShallow(map);
        expect(clonedMap).toEqual(map);
        expect(clonedMap).not.toBe(map);
      });
      it('should handle Set', () => {
        const set = new Set([1, 2, 3]);
        const clonedSet = cloneShallow(set);
        expect(clonedSet).toEqual(set);
        expect(clonedSet).not.toBe(set);
      });
      it('should handle ArrayBuffer', () => {
        const arrayBuffer = new ArrayBuffer(8);
        const clonedArrayBuffer = cloneShallow(arrayBuffer);
        expect(clonedArrayBuffer).toEqual(arrayBuffer);
        expect(clonedArrayBuffer).not.toBe(arrayBuffer);
      });
      it('should handle DataView', () => {
        const arrayBuffer = new ArrayBuffer(8);
        const dataView = new DataView(arrayBuffer);
        const clonedDataView = cloneShallow(dataView);
        expect(clonedDataView).toEqual(dataView);
        expect(clonedDataView).not.toBe(dataView);
      });
      it('should handle TypedArray', () => {
        const arrayBuffer = new ArrayBuffer(8);
        const typedArray = new Uint8Array(arrayBuffer);
        const clonedTypedArray = cloneShallow(typedArray);
        expect(clonedTypedArray).toEqual(typedArray);
        expect(clonedTypedArray).not.toBe(typedArray);
      });
      it('should handle URL', () => {
        const url = new URL('https://example.com');
        const clonedUrl = cloneShallow(url);
        expect(clonedUrl).toEqual(url);
        expect(clonedUrl).not.toBe(url);
        vi.stubGlobal('URL', undefined);
        expect(() => cloneShallow(url)).toThrow();
        vi.unstubAllGlobals();
      });
      it('should handle Error', () => {
        const error = new Error('Test error');
        error.name = 'CustomError';
        const clonedError = cloneShallow(error);
        expect(clonedError).toEqual(error);
        expect(clonedError).not.toBe(error);
      });
    });
  });

  describe('cloneDeep', () => {
    describe('depth', () => {
      it('should deep clone with maxDepth: 0 (top-level only)', () => {
        const original = { a: 1, nested: { b: 2, c: 3 } };
        const result = cloneDeep(original, { maxDepth: 0 });

        expect(result).toEqual(original);
        expect(result).not.toBe(original);
        expect(result.nested).toBe(original.nested);
      });

      it('should deep clone with maxDepth: 1 (one level from the top)', () => {
        const original = { a: 1, level1: { b: 2, level2: { c: 3, d: 4 } } };
        const result = cloneDeep(original, { maxDepth: 1 });
        expect(result).toEqual(original);
        expect(result).not.toBe(original);
        expect(result.level1).not.toBe(original.level1);
        expect(result.level1.level2).toBe(original.level1.level2);
      });

      it('should stop cloning at specified depth', () => {
        const deepObj = { val: 'deep' };
        const original = { a: 1, level1: { b: 2, level2: deepObj } };
        const result = cloneDeep(original, { maxDepth: 1 });

        expect(result).toEqual(original);
        expect(result).not.toBe(original);
        expect(result.level1).not.toBe(original.level1);
        expect(result.level1.level2).toBe(original.level1.level2); // Same ref (depth exceeded)
      });
    });
    describe('built-in types', () => {
      it('should handle arrays', () => {
        const original = { arr: [1, 2, [3, 4]] };
        const result = cloneDeep(original);

        expect(result).toEqual(original);
        expect(result.arr).not.toBe(original.arr);
        expect(result.arr[2]).not.toBe(original.arr[2]);
      });
      it('should handle Date', () => {
        const date = new Date('2024-01-01');
        const result = cloneDeep(date);

        expect(result).toEqual(date);
        expect(result).not.toBe(date);
        expect(result.getTime()).toBe(date.getTime());
      });
      it('should handle RegExp', () => {
        const regex = /test/gi;
        const original = { nested: { regex } };
        const result = cloneDeep(original);

        expect(result.nested.regex).toEqual(regex);
        expect(result.nested.regex).not.toBe(regex);
        expect(result.nested.regex.source).toBe(regex.source);
        expect(result.nested.regex.flags).toBe(regex.flags);
      });
      it('should handle Map', () => {
        const map = new Map<string, { nested: boolean } | string>([
          ['key1', 'value1'],
          ['key2', { nested: true }]
        ]);
        const original = { nested: { map } };
        const result = cloneDeep(original);

        expect(result.nested.map).toEqual(map);
        expect(result.nested.map).not.toBe(map);
        expect(result.nested.map.get('key1')).toBe('value1');
      });
      it('should handle Set', () => {
        const set = new Set([{ nested: true }, 1, 2, 3]);
        const original = { nested: { set } };
        const result = cloneDeep(original);

        expect(result.nested.set).toEqual(set);
        expect(result.nested.set).not.toBe(set);
        expect(result.nested.set.has(1)).toBe(true);
      });
      it('should handle ArrayBuffer', () => {
        const buffer = new ArrayBuffer(8);
        const original = { nested: { buffer } };
        const result = cloneDeep(original);
        expect(result.nested.buffer).toEqual(buffer);
        expect(result.nested.buffer).not.toBe(buffer);
      });
      it('should handle DataView', () => {
        const buffer = new ArrayBuffer(8);
        const dataView = new DataView(buffer);
        const original = { nested: { dataView } };
        const result = cloneDeep(original);
        expect(result.nested.dataView).toEqual(dataView);
        expect(result.nested.dataView).not.toBe(dataView);
      });
      it('should handle Error', () => {
        const error = new Error('Test error');
        const original = { nested: { error } };
        const result = cloneDeep(original);
        expect(result.nested.error).not.toBe(error);
        expect(result.nested.error.message).toBe(error.message);
        expect(result.nested.error.name).toBe(error.name);
        expect(result.nested.error.stack).toBe(error.stack);
      });
      it('should handle URL', () => {
        const url = new URL('https://example.com');
        const original = { nested: { url } };
        const result = cloneDeep(original);
        expect(result.nested.url).toEqual(url);
        expect(result.nested.url).not.toBe(url);
        expect(result.nested.url.href).toBe(url.href);
      });
      it('should handle TypedArray', () => {
        const typedArray = new Uint8Array([1, 2, 3]);
        const original = { nested: { typedArray } };
        const result = cloneDeep(original);
        expect(result.nested.typedArray).toEqual(typedArray);
        expect(result.nested.typedArray).not.toBe(typedArray);
      });
    });

    it('should handle circular references', () => {
      const original: any = { a: 1 };
      original.self = original;

      const result = cloneDeep(original);

      expect(result.a).toBe(1);
      expect(result.self).toBe(result); // Circular reference preserved
    });

    it('should type result correctly for deep clone', () => {
      const original = { a: 1, nested: { b: 'test' } };
      const result = cloneDeep(original);

      expectTypeOf(result).toEqualTypeOf<{
        a: number;
        nested: { b: string };
      }>();
    });
    it('should return the original value as-is if it is not a plain object', () => {
      // eslint-disable-next-line @typescript-eslint/no-extraneous-class
      const original = new (class Test {})();
      const result = cloneDeep(original);
      expect(result).toBe(original);
    });
  });
  describe('structured', () => {
    it('should clone using structuredClone', () => {
      vi.spyOn(globalThis, 'structuredClone');
      const original = { a: 1, nested: { b: 'test' } };
      clone(original, {
        strategy: 'structured',
        structuredSerializeOptions: { transfer: [] }
      });
      expect(globalThis.structuredClone).toHaveBeenCalledWith(original, {
        transfer: []
      });
    });
  });
  describe('clone', () => {
    it('should deep clone by default', () => {
      const original = { a: 1, nested: { b: 'test' } };
      const result = clone(original);
      expect(result).toEqual(original);
      expect(result).not.toBe(original);
      expect(result.nested).not.toBe(original.nested);
    });
    it('should shallow clone when strategy is shallow', () => {
      const original = { a: 1, nested: { b: 'test' } };
      const result = clone(original, { strategy: 'shallow' });
      expect(result).toEqual(original);
      expect(result).not.toBe(original);
      expect(result.nested).toBe(original.nested);
    });
    it('should use structured clone when strategy is structured', () => {
      const original = { a: 1, nested: { b: 'test' } };
      vi.spyOn(globalThis, 'structuredClone');
      const result = clone(original, {
        strategy: 'structured',
        structuredSerializeOptions: { transfer: [] }
      });
      expect(globalThis.structuredClone).toHaveBeenCalledWith(original, {
        transfer: []
      });
    });
    it('should throw when an unknown strategy is provided', () => {
      const original = { a: 1, nested: { b: 'test' } };
      expect(() => clone(original, { strategy: 'unknown' as any })).toThrow();
    });
    it('should use custom clone function when available', () => {
      class MyClass {
        public clone() {
          return new MyClass();
        }
      }
      vi.spyOn(MyClass.prototype, 'clone');
      const original = new MyClass();
      expect(clone(original)).toBeInstanceOf(MyClass);
      expect(MyClass.prototype.clone).toHaveBeenCalled();
    });
  });

  describe('edge cases', () => {
    it('should accept objects with null prototype', () => {
      const original = Object.create(null);
      const result = clone(original);
      expect(result).toEqual(original);
      expect(Object.getPrototypeOf(result)).toBe(
        Object.getPrototypeOf(original)
      );
    });

    it('should preserve property descriptors in shallow clone', () => {
      const original = {};
      Object.defineProperty(original, 'hidden', {
        value: 'secret',
        enumerable: false,
        writable: true
      });
      Object.defineProperty(original, 'visible', {
        value: 'shown',
        enumerable: true,
        writable: false
      });

      const result = cloneShallow(original, {
        preservePlainObjectStructure: true
      });

      const hiddenDesc = Object.getOwnPropertyDescriptor(result, 'hidden');
      const visibleDesc = Object.getOwnPropertyDescriptor(result, 'visible');

      expect(hiddenDesc?.value).toBe('secret');
      expect(hiddenDesc?.enumerable).toBe(false);
      expect(visibleDesc?.value).toBe('shown');
      expect(visibleDesc?.writable).toBe(false);
    });

    it('should handle objects with symbol keys', () => {
      const sym = Symbol('test');
      const original = { a: 1, [sym]: 'symbol value' };

      const result = clone(original);

      expect(result.a).toBe(1);
      expect(result[sym]).toBe('symbol value');
      expect(Object.getOwnPropertySymbols(result)).toContain(sym);
    });

    it('should handle functions (preserved as-is)', () => {
      const fn = () => 'test';
      const original = { a: 1, fn };
      const result = clone(original);

      expect(result.fn).toBe(fn); // Functions are not cloned
    });

    it('should handle deeply nested structures at depth limit', () => {
      const original = {
        l1: { l2: { l3: { l4: { l5: { value: 'deep' } } } } }
      };

      const result = cloneDeep(original, { maxDepth: 3 });

      expect(result.l1).not.toBe(original.l1);
      expect(result.l1.l2).not.toBe(original.l1.l2);
      expect(result.l1.l2.l3).not.toBe(original.l1.l2.l3);
      expect(result.l1.l2.l3.l4).toBe(original.l1.l2.l3.l4); // Depth exceeded
    });

    it('should handle mixed object and array nesting', () => {
      const original = {
        arr: [{ obj: { val: 1 } }, [1, 2, { nested: true }]] as const
      };

      const result = cloneDeep(original, { maxDepth: 3 });

      expect(result.arr).not.toBe(original.arr);
      expect(result.arr[0]).not.toBe(original.arr[0]);
      expect(result.arr[0].obj).not.toBe(original.arr[0].obj);
      expect(result.arr[1]).not.toBe(original.arr[1]);
      expect(result.arr[1][2]).not.toBe((original.arr[1] as any)[2]);
    });

    it('should preserve getters and setters in shallow clone', () => {
      const original = {
        _value: 42,
        get value() {
          return this._value;
        },
        set value(v: number) {
          this._value = v;
        }
      };

      const result = cloneDeep(original);

      expect(result.value).toBe(42);
      result.value = 100;
      expect(result.value).toBe(100);
      expect(original.value).toBe(42); // Original unchanged
    });
    it('should use clone method', () => {
      const original = {
        a: 1,
        clone() {
          return { a: this.a };
        }
      };

      const result = cloneDeep(original);

      expect(result).not.toBe(original);
      expect(result.a).toBe(1);
    });
  });

  describe('performance and large objects', () => {
    it('should handle objects with many properties', () => {
      const original: Record<string, number> = {};
      for (let i = 0; i < 1000; i++) {
        original[`key${i}`] = i;
      }

      const result = clone(original);

      expect(Object.keys(result).length).toBe(1000);
      expect(result.key500).toBe(500);
      expect(result).not.toBe(original);
    });

    it('should handle deeply nested objects efficiently', () => {
      let current: any = { value: 'end' };
      for (let i = 0; i < 10; i++) {
        current = { nested: current };
      }

      const result = clone(current, { maxDepth: 10 });

      let depth = 0;
      let node = result;
      while (node.nested) {
        depth++;
        node = node.nested;
      }

      expect(depth).toBe(10);
      expect(node.value).toBe('end');
    });
  });
});
