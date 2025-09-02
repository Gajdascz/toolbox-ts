import { describe, expect, it } from 'vitest';

import * as Obj from './Obj.ts';

describe('Obj', () => {
  describe('is', () => {
    describe('obj', () => {
      it('returns true for objects', () => {
        expect(Obj.is.obj({})).toBe(true);
        expect(Obj.is.obj({ a: 1 })).toBe(true);
      });
      it('returns false for non-objects', () => {
        expect(Obj.is.obj(42)).toBe(false);
        expect(Obj.is.obj('string')).toBe(false);
        expect(Obj.is.obj(null)).toBe(false);
        expect(Obj.is.obj(undefined)).toBe(false);
      });
    });
    describe('strKeyOf', () => {
      it('returns true for string properties', () => {
        const obj = { age: 30, name: 'test' };
        expect(Obj.is.strKeyOf('name', obj)).toBe(true);
        expect(Obj.is.strKeyOf('age', obj)).toBe(true);
      });
      it('returns false for non-string properties', () => {
        const obj = { age: 30, name: 'test' };
        expect(Obj.is.strKeyOf('nonExistent', obj)).toBe(false);
      });
    });
    describe('symbolKeyOf', () => {
      it('returns true for symbol properties', () => {
        const sym = Symbol('test');
        const obj = { [sym]: 'value' };
        expect(Obj.is.symbolKeyOf(sym, obj)).toBe(true);
      });
      it('returns false for non-symbol properties', () => {
        const sym = Symbol('test');
        const obj = { [sym]: 'value' };
        expect(Obj.is.symbolKeyOf(Symbol('other'), obj)).toBe(false);
      });
    });
    describe('empty', () => {
      it('returns true for empty objects', () => {
        expect(Obj.is.empty({})).toBe(true);
      });
      it('returns false for non-empty objects', () => {
        expect(Obj.is.empty({ a: 1 })).toBe(false);
        expect(Obj.is.empty({ a: 1, b: 2 })).toBe(false);
        // not a real object
        expect(Obj.is.empty([])).toBe(false);
      });
    });
    describe('partialOf', () => {
      it('should return true when partial is a subset of established', () => {
        const established = { age: 30, details: { level: 5 }, name: 'test' };
        const partial = { name: 'test' };
        expect(Obj.is.partialOf(partial, established)).toBe(true);
      });

      it('should return true for empty object as partial', () => {
        const established = { age: 30, name: 'test' };
        const partial = {};
        expect(Obj.is.partialOf(partial, established)).toBe(true);
      });

      it('should return false when types are different', () => {
        const established = { age: 30, name: 'test' };
        const partial = { name: 42 }; // Different type
        expect(Obj.is.partialOf(partial, established)).toBe(false);
      });

      it('should return false when partial is not an object', () => {
        const established = { name: 'test' };
        expect(Obj.is.partialOf(null, established)).toBe(false);
        expect(Obj.is.partialOf(undefined, established)).toBe(false);
        expect(Obj.is.partialOf('string' as any, established)).toBe(false);
        expect(Obj.is.partialOf(42 as any, established)).toBe(false);
      });

      it('should return false when established is not an object', () => {
        const partial = { name: 'test' };
        expect(Obj.is.partialOf(partial, null)).toBe(false);
        expect(Obj.is.partialOf(partial, undefined)).toBe(false);
        expect(Obj.is.partialOf(partial, 'string' as any)).toBe(false);
        expect(Obj.is.partialOf(partial, 42 as any)).toBe(false);
      });

      it('should return false when partial has properties not in established', () => {
        const established = { age: 30, name: 'test' };
        const partial = { email: 'test@example.com', name: 'test' };
        expect(Obj.is.partialOf(partial, established)).toBe(false);
      });
      it('should handle arrays correctly', () => {
        const established = { items: [1, 2, 3] };
        const partial = { items: [1] };
        expect(Obj.is.partialOf(partial, established)).toBe(true);
      });
      it('should check types in nested objects', () => {
        const established = { user: { age: 30, name: 'test' } };
        const goodPartial = { user: { name: 'other' } };
        const badPartial = { user: { name: 42 } }; // Wrong type
        expect(Obj.is.partialOf(goodPartial, established)).toBe(true);
        expect(Obj.is.partialOf(badPartial, established)).toBe(false);
      });
      it('should handle inconsistent array types', () => {
        const established = { items: [1, 'two', 3] };
        const badPartial = { items: 1 };
        expect(Obj.is.partialOf(badPartial, established)).toBe(false);
        const badPartial2 = { items: ['one', 2, '', 5] };
        expect(Obj.is.partialOf(badPartial2, established)).toBe(false);
      });
      it('returns false when partial array is longer than established array', () => {
        const established = { items: [1, 2] };
        const partial = { items: [1, 2, 3] };
        expect(Obj.is.partialOf(partial, established)).toBe(false);
      });
      it('returns false when partial array has extra index even if earlier elements match', () => {
        const established = { items: [1, 'two'] };
        const partial = { items: [1, 'two', 'extra'] };
        expect(Obj.is.partialOf(partial, established)).toBe(false);
      });
      it('handles established null (typeof val === "object") by treating val ?? {}', () => {
        const established = { nested: null };
        const partialObj = { nested: {} };
        const partialPrimitive = { nested: 'x' };
        expect(Obj.is.partialOf(partialObj, established)).toBe(true);
        expect(Obj.is.partialOf(partialPrimitive, established)).toBe(false);
      });
    });
    describe('prototypeKey', () => {
      it('returns true for prototype keys', () => {
        expect(Obj.is.prototypeKey('__proto__')).toBe(true);
        expect(Obj.is.prototypeKey('constructor')).toBe(true);
        expect(Obj.is.prototypeKey('prototype')).toBe(true);
      });
      it('returns false for non-prototype keys', () => {
        expect(Obj.is.prototypeKey('toString')).toBe(false);
        expect(Obj.is.prototypeKey('hasOwnProperty')).toBe(false);
        expect(Obj.is.prototypeKey('customKey')).toBe(false);
      });
    });
  });
  describe('clone', () => {
    it('returns non object input', () => {
      expect(Obj.clone(42)).toBe(42);
    });
    it('clones primitive values', () => {
      const input = { a: 1, b: 'string', c: true };
      const result = Obj.clone(input);
      expect(result).toEqual(input);
      expect(result).not.toBe(input);
    });
    it('clones nested objects', () => {
      const input = { a: { b: { c: 1 } } };
      const result = Obj.clone(input);
      expect(result).toEqual(input);
      expect(result.a).not.toBe(input.a);
      expect(result.a.b).not.toBe(input.a.b);
    });
    it('clones arrays', () => {
      const input = [1, 2, [3, 4]];
      const result = Obj.clone(input);
      expect(result).toEqual(input);
      expect(result).not.toBe(input);
      expect(result[2]).not.toBe(input[2]);
    });
    it('clones objects with arrays', () => {
      const input = { arr: [{ a: 1 }, { b: 2 }] };
      const result = Obj.clone(input);
      expect(result).toEqual(input);
      expect(result.arr).not.toBe(input.arr);
      expect(result.arr[0]).not.toBe(input.arr[0]);
    });
  });
  describe('freeze', () => {
    it('freezes nested objects', () => {
      const testObj = { level1: { level2: { value: 'test' } } };
      const frozen = Obj.freeze(testObj, { maxDepth: Infinity });
      expect(Object.isFrozen(frozen)).toBe(true);
      expect(Object.isFrozen(frozen.level1)).toBe(true);
      expect(Object.isFrozen(frozen.level1.level2)).toBe(true);
    });
    it('handles non-object values', () => {
      const values = [42, 'string', null, undefined];
      for (const value of values) {
        expect(Obj.freeze(value)).toBe(value);
      }
    });
    it('preserves object structure', () => {
      const original = {
        nested: { key: 'value' },
        number: 42,
        string: 'value'
      };
      const frozen = Obj.freeze(original);
      expect(frozen).toEqual(original);
    });
    it('prevents modifications', () => {
      const frozen = Obj.freeze(
        { key: { nested: 'value' } },
        { maxDepth: Infinity }
      );
      expect(() => {
        frozen.key.nested = 'new value';
      }).toThrowError();
    });
    it('handles already frozen objects', () => {
      const frozen1 = Object.freeze({ key: 'value' });
      const frozen2 = Obj.freeze(frozen1);
      expect(frozen2).toBe(frozen1);
    });
    it('clones when prompted', () => {
      const original = { key: 'value' };
      const frozen = Obj.freeze(original, { clone: true });
      expect(frozen).not.toBe(original);
      expect(frozen).toEqual(original);
    });
  });
  describe('pick', () => {
    it('picks specified keys from object', () => {
      const obj = { a: 1, b: 'string', c: true };
      const picked = Obj.pick(obj, ['a', 'c']);
      expect(picked).toEqual({ a: 1, c: true });
    });
    it('returns empty object when no keys match', () => {
      const obj = { a: 1, b: 'string' };
      const picked = Obj.pick(obj, ['c', 'd'] as any);
      expect(picked).toEqual({});
    });
    it('returns empty object for non-object input', () => {
      const picked = Obj.pick(42, ['a'] as any);
      expect(picked).toEqual({});
    });
  });
  describe('omit', () => {
    it('omits specified keys from object', () => {
      const obj = { a: 1, b: 'string', c: true };
      const omitted = Obj.omit(obj, ['b']);
      expect(omitted).toEqual({ a: 1, c: true });
    });
    it('returns original object when no keys match', () => {
      const obj = { a: 1, b: 'string' };
      const omitted = Obj.omit(obj, ['c', 'd'] as any);
      expect(omitted).toEqual(obj);
    });
    it('returns empty object when all keys are omitted', () => {
      const obj = { a: 1, b: 'string' };
      const omitted = Obj.omit(obj, ['a', 'b']);
      expect(omitted).toEqual({});
    });
    it('returns empty object for non-object input', () => {
      const omitted = Obj.omit(42, ['a'] as any);
      expect(omitted).toEqual({});
    });
  });
  describe('pluck', () => {
    it('plucks specified key from nested objects', () => {
      const obj = {
        item1: { name: 'Item 1', value: 10 },
        item2: { name: 'Item 2', value: 20 },
        item3: { name: 'Item 3', value: 30 }
      };
      const plucked = Obj.pluck(obj, 'value');
      expect(plucked).toEqual({ item1: 10, item2: 20, item3: 30 });
    });
    it('returns empty object when no nested objects have the key', () => {
      const obj = { item1: { name: 'Item 1' }, item2: { name: 'Item 2' } };
      const plucked = Obj.pluck(obj, 'value' as any);
      expect(plucked).toEqual({});
    });
    it('Throws for non-object input', () => {
      expect(() => Obj.pluck(42, 'value' as never)).toThrowError();
    });
  });
  describe('filter', () => {
    it('filters properties based on predicate', () => {
      const obj = { a: 1, b: 'string', c: 2, d: true };
      const filtered = Obj.filter(
        obj,
        (v): v is number => typeof v === 'number'
      );
      expect(filtered).toEqual({ a: 1, c: 2 });
    });
    it('returns empty object when no properties match', () => {
      const obj = { a: 'string', b: true };
      const filtered = Obj.filter(
        obj,
        ((v): v is number => typeof v === 'number') as any
      );
      expect(filtered).toEqual({});
    });
    it('returns empty object for non-object input', () => {
      const filtered = Obj.filter(
        42,
        ((v): v is number => typeof v === 'number') as any
      );
      expect(filtered).toEqual({});
    });
  });
  describe('keys', () => {
    it('returns keys of an object as a typed array', () => {
      const obj = { a: 1, b: 'string' };
      const keys = Obj.keys(obj);
      expect(keys).toEqual(['a', 'b']);
      expect(keys).toBeInstanceOf(Array);
    });
    it('returns empty array for non-object input', () => {
      const keys = Obj.keys(42);
      expect(keys).toEqual([]);
    });
  });
  describe('entries', () => {
    it('returns entries of an object as a typed array', () => {
      const obj = { a: 1, b: 'string' };
      const entries = Obj.entries(obj);
      expect(entries).toEqual([
        ['a', 1],
        ['b', 'string']
      ]);
      expect(entries).toBeInstanceOf(Array);
    });
    it('returns empty array for non-object input', () => {
      const entries = Obj.entries(42);
      expect(entries).toEqual([]);
    });
  });
  describe('stripNullish', () => {
    it('removes null and undefined properties', () => {
      const obj = {
        a: 1,
        b: null,
        c: undefined,
        d: { e: 2, f: null, g: { h: 3, i: undefined } },
        j: [1, null, 2, undefined, 3]
      };
      const stripped = Obj.stripNullish(obj);
      expect(stripped).toEqual({
        a: 1,
        d: { e: 2, g: { h: 3 } },
        j: [1, null, 2, undefined, 3] // arrays are not altered
      });
    });
    it('handles non-object input', () => {
      expect(Obj.stripNullish(42)).toBe(42);
      expect(Obj.stripNullish(null)).toBe(null);
      expect(Obj.stripNullish(undefined)).toBe(undefined);
    });
    it('returns empty object when all properties are nullish', () => {
      const obj = { a: null, b: undefined, c: { d: null } };
      const stripped = Obj.stripNullish(obj);
      expect(stripped).toEqual({ c: {} });
    });
  });
});
