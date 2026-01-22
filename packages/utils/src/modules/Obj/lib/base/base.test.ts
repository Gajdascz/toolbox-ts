import type { DepthReadonly, Values } from '@toolbox-ts/types/defs/object';

import { describe, expect, expectTypeOf, it } from 'vitest';

import {
  allEntries,
  create,
  createWithPrototypeOf,
  defineProperties,
  defineProperty,
  entries,
  freeze,
  getPrototypeOf,
  keys,
  symbolEntries,
  values
} from './base.ts';

describe('base', () => {
  //#region> keys
  describe('keys', () => {
    it('should return typed array of object keys', () => {
      const obj = { a: 1, b: 2, 0: 3 } as const;
      const result = keys(obj);
      expect(result).toEqual(['0', 'a', 'b']);
      expectTypeOf(result).toEqualTypeOf<('0' | 'a' | 'b')[]>();
    });
    it('should work with empty objects', () => {
      const obj = {};
      const result = keys(obj);

      expect(result).toEqual([]);
      expectTypeOf(result).toEqualTypeOf<(keyof typeof obj & string)[]>();
    });
    it('should only return enumerable keys', () => {
      const obj = defineProperty({}, 'hidden', {
        value: 'secret',
        enumerable: false
      });
      const updatedObj = defineProperty(obj, 'visible', {
        value: 'shown',
        enumerable: true
      });

      const result = keys(updatedObj);

      expect(result).toEqual(['visible']);
      expect(result).not.toContain('hidden');
    });

    it('should throw TypeError for null', () => {
      expect(() => keys(null as any)).toThrow(TypeError);
    });

    it('should throw TypeError for undefined', () => {
      expect(() => keys(undefined as any)).toThrow(TypeError);
    });

    it('should throw TypeError for primitives', () => {
      expect(() => keys(42 as any)).toThrow();
      expect(() => keys('string' as any)).toThrow();
      expect(() => keys(true as any)).toThrow();
    });
  });
  //#endregion

  //#region> entries
  describe('entries', () => {
    it('should return typed array of object entries', () => {
      const obj = { a: 1, b: 'two', 0: 3 } as const;
      const result = entries(obj);
      expect(result).toEqual([
        ['0', 3],
        ['a', 1],
        ['b', 'two']
      ]);
      expectTypeOf(result).toEqualTypeOf<
        (['0', 3] | ['a', 1] | ['b', 'two'])[]
      >();
    });

    it('should work with empty objects', () => {
      const obj = {};
      const result = entries(obj);

      expect(result).toEqual([]);
      expectTypeOf(result).toEqualTypeOf<never[]>();
    });

    it('should only return enumerable entries', () => {
      const obj = defineProperty({}, 'hidden', {
        value: 'secret',
        enumerable: false
      });
      const updatedObj = defineProperty(obj, 'visible', {
        value: 'shown',
        enumerable: true
      });

      interface O {
        hidden: string;
        visible: string;
      }
      const result = entries<O>(updatedObj);

      expect(result).toEqual([['visible', 'shown']]);
      expect(result.some(([key]) => key === 'hidden')).toBe(false);
    });

    it('should throw TypeError for null', () => {
      expect(() => entries(null as any)).toThrow(TypeError);
    });

    it('should throw TypeError for undefined', () => {
      expect(() => entries(undefined as any)).toThrow(TypeError);
    });

    it('should throw TypeError for non-plain objects', () => {
      expect(() => entries([1, 2, 3])).toThrow();
      expect(() => entries(new Date())).toThrow();
      expect(() => entries(new Map())).toThrow();
    });
  });
  //#endregion

  //#region> values
  describe('values', () => {
    it('should return typed array of object values', () => {
      const obj = { a: 1, b: 'two', c: true } as const;
      const result = values(obj);

      expect(result).toEqual([1, 'two', true]);
      expectTypeOf(result).toEqualTypeOf<Values<typeof obj>>();
      expectTypeOf(result).toEqualTypeOf<('two' | 1 | true)[]>();
    });

    it('should work with empty objects', () => {
      const obj = {};
      const result = values(obj);

      expect(result).toEqual([]);
      expectTypeOf(result).toEqualTypeOf<Values<typeof obj>>();
    });

    it('should only return enumerable values', () => {
      const obj = Object.defineProperty({}, 'hidden', {
        value: 'secret',
        enumerable: false
      });
      Object.defineProperty(obj, 'visible', {
        value: 'shown',
        enumerable: true
      });

      const result = values(obj);

      expect(result).toEqual(['shown']);
      expect(result).not.toContain('secret');
    });

    it('should fail for arrays', () => {
      const arr = ['a', 'b', 'c'];
      expect(() => values(arr)).toThrow(TypeError);
    });

    it('should throw TypeError for null', () => {
      expect(() => values(null as any)).toThrow(TypeError);
    });

    it('should throw TypeError for undefined', () => {
      expect(() => values(undefined as any)).toThrow(TypeError);
    });
  });
  //#endregion

  //#region> symbolEntries
  describe('symbolEntries', () => {
    it('should return typed array of symbol entries', () => {
      const sym1 = Symbol('sym1');
      const sym2 = Symbol('sym2');
      const obj = { [sym1]: 'value1', [sym2]: 'value2' };
      const result = symbolEntries(obj);
      expect(result).toEqual([
        [sym1, 'value1'],
        [sym2, 'value2']
      ]);
      expectTypeOf(result).toEqualTypeOf<
        (
          | [typeof sym1, (typeof obj)[typeof sym1]]
          | [typeof sym2, (typeof obj)[typeof sym2]]
        )[]
      >();
    });
  });
  //#endregion
  //#region> createWithPrototypeOf
  describe('createWithPrototypeOf', () => {
    it('should create an object with the given prototype', () => {
      const proto = { greet: () => 'hello' };
      const obj = create(proto, { hello: { value: true } });
      const obj2 = createWithPrototypeOf(obj);
      expect(getPrototypeOf(obj2)).toBe(proto);
      expect(obj2.greet()).toBe('hello');
    });
  });
  //#endregion

  //#region> allEntries
  describe('allEntries', () => {
    it('should return all enumerable entries and symbol entries', () => {
      const sym1 = Symbol('sym1');
      const sym2 = Symbol('sym2');
      const obj = { a: 1, b: 2, [sym1]: 'value1', [sym2]: 'value2' };
      const result = allEntries(obj);
      expect(result).toEqual([
        ['a', 1],
        ['b', 2],
        [sym1, 'value1'],
        [sym2, 'value2']
      ]);
    });
  });
  //#endregion
  //#region> getPrototypeOf
  describe('getPrototypeOf', () => {
    it('should return the prototype of an object', () => {
      const proto = {
        __prototype: true,
        greet() {
          return 'hello';
        }
      };
      const obj = create(proto);
      const result = getPrototypeOf(obj);

      expect(result).toBe(proto);
      expect(result?.greet()).toBe('hello');
    });

    it('should return null for objects with no prototype', () => {
      const obj = Object.create(null);
      const result = getPrototypeOf(obj);

      expect(result).toBeNull();
      expectTypeOf(result).toEqualTypeOf<null | unknown>();
    });

    it('should return typed prototype', () => {
      interface Proto {
        method: () => string;
      }
      const proto: Proto = { method: () => 'test' };
      const obj = create(proto);
      const result = getPrototypeOf(obj);

      expectTypeOf(result).toEqualTypeOf<Proto>();
      expect(result?.method()).toBe('test');
    });

    it('should work with class instances', () => {
      class MyClass {
        method() {
          return 'class method';
        }
      }
      const instance = new MyClass();
      const result = getPrototypeOf(instance);

      expect(result).toBe(MyClass.prototype);
      expect((result as any).method).toBeDefined();
    });
  });
  //#endregion

  //#region> defineProperties
  describe('defineProperties', () => {
    it('should add multiple properties to an object', () => {
      const obj = { a: 1 };
      const result = defineProperties(obj, {
        b: { value: 2, writable: true, enumerable: true },
        c: { value: 3, writable: false, enumerable: true }
      });

      expect(result.a).toBe(1);
      expect(result.b).toBe(2);
      expect(result.c).toBe(3);
      expect(result).toBe(obj); // mutates original
    });

    it('should infer property types correctly', () => {
      const obj = { a: 1 };
      const result = defineProperties(obj, {
        b: { value: 'string', writable: true },
        c: { value: true, enumerable: true }
      });

      expectTypeOf(result).branded.toEqualTypeOf<{
        a: number;
        b: string;
        c: boolean;
      }>();
    });

    it('should handle accessor properties', () => {
      const obj = { _value: 0 };
      const result = defineProperties(obj, {
        value: {
          get() {
            return this._value;
          },
          set(v: number) {
            this._value = v;
          },
          enumerable: true
        }
      });

      expect(result.value).toBe(0);
      result.value = 42;
      expect(result.value).toBe(42);
      expect(result._value).toBe(42);
    });

    it('should handle non-enumerable properties', () => {
      const obj = {};
      const result = defineProperties(obj, {
        hidden: { value: 'secret', enumerable: false },
        visible: { value: 'shown', enumerable: true }
      });

      expect(Object.keys(result)).toEqual(['visible']);
      expect(result.hidden).toBe('secret');
    });

    it('should handle non-writable properties', () => {
      const obj = {};
      const result = defineProperties(obj, {
        readonly: { value: 42, writable: false }
      });

      expect(result.readonly).toBe(42);
      expect(() => {
        (result as any).readonly = 100;
      }).toThrow();
    });

    it('should handle configurable properties', () => {
      const obj = {};
      const result = defineProperties(obj, {
        deletable: { value: 1, configurable: true },
        permanent: { value: 2, configurable: false }
      });

      delete (result as any).deletable;
      expect(result.deletable).toBeUndefined();

      expect(() => {
        delete (result as any).permanent;
      }).toThrow();
    });
  });
  //#endregion

  //#region> defineProperty
  describe('defineProperty', () => {
    it('should add a single property to an object', () => {
      const obj = { a: 1 };
      const result = defineProperty(obj, 'b', {
        value: 2,
        writable: true,
        enumerable: true
      });

      expect(result.a).toBe(1);
      expect(result.b).toBe(2);
      expect(result).toBe(obj); // mutates original
    });

    it('should infer property type correctly', () => {
      const obj = { a: 1 };
      const result = defineProperty(obj, 'b', {
        value: 'string',
        writable: true
      });

      expectTypeOf(result).branded.toEqualTypeOf<{ a: number; b: string }>();
    });

    it('should handle accessor property', () => {
      const obj = { _value: 0 };
      const result = defineProperty(obj, 'value', {
        get() {
          return this._value;
        },
        set(v: number) {
          this._value = v;
        },
        enumerable: true
      });

      expect(result.value).toBe(0);
      result.value = 42;
      expect(result.value).toBe(42);
    });

    it('should handle non-enumerable property', () => {
      const obj = { a: 1 };
      const result = defineProperty(obj, 'hidden', {
        value: 'secret',
        enumerable: false
      });

      expect(Object.keys(result)).toEqual(['a']);
      expect(result.hidden).toBe('secret');
    });

    it('should handle non-writable property', () => {
      const obj = {};
      const result = defineProperty(obj, 'readonly', {
        value: 42,
        writable: false
      });

      expect(result.readonly).toBe(42);
      expect(() => {
        (result as any).readonly = 100;
      }).toThrow();
    });

    it('should handle symbol keys', () => {
      const sym = Symbol('key');
      const obj = {};
      const result = defineProperty(obj, sym, {
        value: 'symbol value',
        enumerable: true
      });

      expect(result[sym]).toBe('symbol value');
    });
  });
  //#endregion

  //#region> create
  describe('create', () => {
    it('should create object with specified prototype', () => {
      const proto = {
        greet() {
          return 'hello';
        }
      };
      const result = create(proto);

      expect(Object.getPrototypeOf(result)).toBe(proto);
      expect(result.greet()).toBe('hello');
    });

    it('should create object with null prototype', () => {
      const result = create(null);

      expect(Object.getPrototypeOf(result)).toBeNull();
      expect(result.toString).toBeUndefined();
    });

    it('should create object with prototype and properties', () => {
      const proto = {
        protoMethod() {
          return 'proto';
        }
      };
      const result = create(proto, {
        name: { value: 'Alice', writable: true, enumerable: true },
        age: { value: 30, writable: true, enumerable: true }
      });

      expect(getPrototypeOf(result)).toBe(proto);
      expect(result.protoMethod()).toBe('proto');
      expect(result.name).toBe('Alice');
      expect(result.age).toBe(30);
    });

    it('should infer types correctly with prototype only', () => {
      const proto = {
        method(): string {
          return 'test';
        }
      };
      const result = create(proto);

      expectTypeOf(result).toEqualTypeOf<typeof proto>();
      expectTypeOf(result.method).toEqualTypeOf<() => string>();
    });

    it('should infer types correctly with properties', () => {
      const proto = {
        method(): string {
          return 'test';
        }
      };
      const result = create(proto, {
        name: { value: 'Alice' as const },
        age: { value: 30 as const }
      });

      expectTypeOf(result).toEqualTypeOf<
        { age: 30; name: 'Alice' } & typeof proto
      >();
    });

    it('should handle non-enumerable properties', () => {
      const result = create(null, {
        visible: { value: 'shown', enumerable: true },
        hidden: { value: 'secret', enumerable: false }
      });

      expect(Object.keys(result)).toEqual(['visible']);
      expect(result.visible).toBe('shown');
      expect(result.hidden).toBe('secret');
    });
  });
  //#endregion

  //#region> freeze
  describe('freeze', () => {
    describe('shallow freeze (default)', () => {
      it('should freeze object at depth 0', () => {
        const obj = { a: 1, b: { c: 2 } };
        const result = freeze(obj);

        expect(Object.isFrozen(result)).toBe(true);
        expect(Object.isFrozen(result.b)).toBe(false);
        expect(result).toBe(obj); // mutates original by default
      });

      it('should prevent property modification', () => {
        const obj = { a: 1 };
        const result = freeze(obj);

        expect(() => {
          (result as any).a = 2;
        }).toThrow();
        expect(result.a).toBe(1);
      });

      it('should prevent property addition', () => {
        const obj = { a: 1 };
        const result = freeze(obj);

        expect(() => {
          (result as any).b = 2;
        }).toThrow();
      });

      it('should prevent property deletion', () => {
        const obj = { a: 1 };
        const result = freeze(obj);

        expect(() => {
          delete (result as any).a;
        }).toThrow();
      });

      it('should type as readonly at depth 0', () => {
        const obj = { a: 1, b: { c: 2 } };
        const result = freeze(obj, { maxDepth: 0 });

        expectTypeOf(result).toEqualTypeOf<DepthReadonly<typeof obj, 0>>();
        expectTypeOf(result).toEqualTypeOf<Readonly<typeof obj>>();
      });
    });

    describe('deep freeze', () => {
      it('should freeze object at depth 1', () => {
        const obj = { a: 1, b: { c: 2 } };
        const result = freeze(obj, { maxDepth: 1 });

        expect(Object.isFrozen(result)).toBe(true);
        expect(Object.isFrozen(result.b)).toBe(true);
      });

      it('should freeze nested objects at specified depth', () => {
        const obj = { a: { b: { c: { d: 1 } } } };
        const result = freeze(obj, { maxDepth: 2 });

        expect(Object.isFrozen(result)).toBe(true);
        expect(Object.isFrozen(result.a)).toBe(true);
        expect(Object.isFrozen(result.a.b)).toBe(true);
        expect(Object.isFrozen(result.a.b.c)).toBe(false);
      });

      it('should handle arrays within objects', () => {
        const obj = { items: [1, 2, 3] };
        const result = freeze(obj, { maxDepth: 1 });

        expect(Object.isFrozen(result)).toBe(true);
        expect(Object.isFrozen(result.items)).toBe(true);
        expect(() => {
          (result.items as any).push(4);
        }).toThrow();
      });

      it('should type as deeply readonly', () => {
        const obj = { a: 1, b: { c: 2 } };
        const result = freeze(obj, { maxDepth: 1 });

        expectTypeOf(result).toEqualTypeOf<DepthReadonly<typeof obj, 1>>();
        // Verify nested property is readonly
        expectTypeOf(result.b).toEqualTypeOf<Readonly<{ c: number }>>();
      });

      it('should handle complex nested structures', () => {
        const obj = {
          user: {
            name: 'Alice',
            profile: { age: 30, address: { city: 'NYC' } }
          }
        };
        const result = freeze(obj, { maxDepth: 3 });

        expect(Object.isFrozen(result)).toBe(true);
        expect(Object.isFrozen(result.user)).toBe(true);
        expect(Object.isFrozen(result.user.profile)).toBe(true);
        expect(Object.isFrozen(result.user.profile.address)).toBe(true);
      });
      it('should freeze Map keys and values', () => {
        const map = new Map([
          [{ a: 1 }, { x: 1 }],
          [{ b: 2 }, { y: 2 }],
          [{ c: 3 }, { z: 3 }]
        ]);
        const result = freeze({ map }, { maxDepth: Infinity });
        expect(Object.isFrozen(result)).toBe(true);
        for (const [key, value] of result.map.entries()) {
          expect(Object.isFrozen(key)).toBe(true);
          expect(Object.isFrozen(value)).toBe(true);
        }
      });
      it('should freeze Set values', () => {
        const set = new Set([{ a: 1 }, { b: 2 }, { c: 3 }]);
        const result = freeze({ set }, { maxDepth: Infinity });
        expect(Object.isFrozen(result)).toBe(true);
        for (const value of result.set.values())
          expect(Object.isFrozen(value)).toBe(true);
      });
    });

    describe('clone option', () => {
      it('should clone with structuredClone when clone=true', () => {
        const obj = { a: 1, b: { c: 2 } };
        const result = freeze(obj, { clone: true });

        expect(result).not.toBe(obj);
        expect(result).toEqual(obj);
        expect(Object.isFrozen(result)).toBe(true);
        expect(Object.isFrozen(obj)).toBe(false);
      });

      it('should use custom clone function when provided', () => {
        const obj = { a: 1, b: 2 };
        const customClone = <T>(o: T): T => ({ ...o });
        const result = freeze(obj, { clone: customClone });

        expect(result).not.toBe(obj);
        expect(result).toEqual(obj);
        expect(Object.isFrozen(result)).toBe(true);
        expect(Object.isFrozen(obj)).toBe(false);
      });

      it('should mutate original when clone=false', () => {
        const obj = { a: 1 };
        const result = freeze(obj, { clone: false });

        expect(result).toBe(obj);
        expect(Object.isFrozen(obj)).toBe(true);
      });

      it('should combine clone and deep freeze', () => {
        const obj = { a: { b: 1 } };
        const result = freeze(obj, { clone: true, maxDepth: 1 });

        expect(result).not.toBe(obj);
        expect(Object.isFrozen(result)).toBe(true);
        expect(Object.isFrozen(result.a)).toBe(true);
        expect(Object.isFrozen(obj)).toBe(false);
      });
    });

    describe('edge cases', () => {
      it('should skip already frozen objects', () => {
        const obj = Object.freeze({ a: 1 });
        const result = freeze(obj, { maxDepth: 1 });

        expect(result).toBe(obj);
        expect(Object.isFrozen(result)).toBe(true);
      });

      it('should handle empty objects', () => {
        const obj = {};
        const result = freeze(obj);

        expect(Object.isFrozen(result)).toBe(true);
        expect(result).toEqual({});
      });

      it('should handle objects with null values', () => {
        const obj = { a: null, b: 1 };
        const result = freeze(obj, { maxDepth: 1 });

        expect(Object.isFrozen(result)).toBe(true);
        expect(result.a).toBeNull();
      });

      it('should handle objects with undefined values', () => {
        const obj = { a: undefined, b: 1 };
        const result = freeze(obj, { maxDepth: 1 });

        expect(Object.isFrozen(result)).toBe(true);
        expect(result.a).toBeUndefined();
      });

      it('should handle circular references with clone=false', () => {
        const obj: any = { a: 1 };
        obj.self = obj;
        const result = freeze(obj, { maxDepth: 1 });

        expect(Object.isFrozen(result)).toBe(true);
        expect(result.self).toBe(result);
      });

      it('should stop at primitives in nested structures', () => {
        const obj = {
          str: 'text',
          num: 42,
          bool: true,
          nil: null,
          undef: undefined
        };
        const result = freeze(obj, { maxDepth: 2 });

        expect(Object.isFrozen(result)).toBe(true);
        expect(result.str).toBe('text');
        expect(result.num).toBe(42);
        expect(result.bool).toBe(true);
      });

      it('should handle Date objects', () => {
        const date = new Date();
        const obj = { createdAt: date };
        const result = freeze(obj, { clone: true, maxDepth: 1 });

        expect(Object.isFrozen(result)).toBe(true);
        expect(result.createdAt).toEqual(date);
        expect(result.createdAt).not.toBe(date);
      });

      it('should handle arrays', () => {
        const obj = { items: [1, 2, { nested: 3 }] };
        const result = freeze(obj, { maxDepth: 2 });

        expect(Object.isFrozen(result)).toBe(true);
        expect(Object.isFrozen(result.items)).toBe(true);
        expect(Object.isFrozen(result.items[2])).toBe(true);
      });
    });

    describe('default options', () => {
      it('should use default options when none provided', () => {
        const obj = { a: 1, b: { c: 2 } };
        const result = freeze(obj);

        expect(Object.isFrozen(result)).toBe(true);
        expect(Object.isFrozen(result.b)).toBe(false);
        expect(result).toBe(obj);
      });

      it('should allow partial options', () => {
        const obj = { a: { b: 1 } };
        const result1 = freeze(obj, { maxDepth: 1 });
        const obj2 = { a: { b: 1 } };
        const result2 = freeze(obj2, { clone: true });

        expect(Object.isFrozen(result1.a)).toBe(true);
        expect(result2).not.toBe(obj2);
      });
    });
  });
  //#endregion
});
