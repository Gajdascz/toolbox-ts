import { describe, expect, it } from 'vitest';

import * as Obj from './Obj.ts';

describe('Obj', () => {
  describe('is', () => {
    it('obj', () => {
      expect(Obj.is.obj({})).toBe(true);
      expect(Obj.is.obj({ a: 1 })).toBe(true);
      expect(Obj.is.obj(42)).toBe(false);
      expect(Obj.is.obj('string')).toBe(false);
      expect(Obj.is.obj(null)).toBe(false);
      expect(Obj.is.obj(undefined)).toBe(false);
      expect(Obj.is.obj([])).toBe(false);
      expect(Obj.is.obj([1, 2, 3])).toBe(false);
    });
    it('prototypeKey', () => {
      expect(Obj.is.prototypeKey('__proto__')).toBe(true);
      expect(Obj.is.prototypeKey('constructor')).toBe(true);
      expect(Obj.is.prototypeKey('prototype')).toBe(true);
      expect(Obj.is.prototypeKey('random')).toBe(false);
    });
    it('empty', () => {
      expect(Obj.is.empty({})).toBe(true);
      expect(Obj.is.empty({ a: 1 })).toBe(false);
      expect(Obj.is.empty([])).toBe(false);
      expect(Obj.is.empty(null)).toBe(false);
      expect(Obj.is.empty(undefined)).toBe(false);
    });
    it('keyOf', () => {
      const obj = { a: 1, b: 2 };
      expect(Obj.is.keyOf('a', obj)).toBe(true);
      expect(Obj.is.keyOf('b', obj)).toBe(true);
      expect(Obj.is.keyOf('c', obj)).toBe(false);
      expect(Obj.is.keyOf(1, obj)).toBe(false);
      expect(Obj.is.keyOf(null, obj)).toBe(false);
      expect(Obj.is.keyOf(undefined, obj)).toBe(false);
    });
  });
  describe('clone', () => {
    it('clones primitives as-is', () => {
      expect(Obj.clone(1)).toBe(1);
      expect(Obj.clone('x')).toBe('x');
      expect(Obj.clone(true)).toBe(true);
      expect(Obj.clone(null)).toBe(null);
      const sym = Symbol('s');
      expect(Obj.clone(sym)).toBe(sym);
    });

    it('deep clones arrays and objects and preserves circular refs', () => {
      const a: any = { n: 1, child: { m: 2 }, arr: [1, { k: 3 }] };
      a.self = a;
      const c = Obj.clone(a);
      expect(c).not.toBe(a);
      expect(c.child).not.toBe(a.child);
      expect(c.arr).not.toBe(a.arr);
      expect(c.arr[1]).not.toBe(a.arr[1]);
      expect(c.self).toBe(c);
      expect(c.n).toBe(1);
      expect(c.child.m).toBe(2);
      expect(c.arr[1].k).toBe(3);
    });

    it('clones Map and Set with deep cloned contents', () => {
      const key = { kk: 1 };
      const map = new Map<any, any>([[key, { v: 2 }]]);
      const set = new Set<any>([{ a: 1 }, 2]);
      const cMap = Obj.clone(map);
      const cSet = Obj.clone(set);

      expect(cMap).not.toBe(map);
      const [[ck, cv]] = [...cMap.entries()];
      expect(ck).not.toBe(key);
      expect(cv).not.toBe(map.get(key));
      expect(ck.kk).toBe(1);
      expect(cv.v).toBe(2);

      expect(cSet).not.toBe(set);
      const [s0, s1] = [...cSet.values()];
      expect(typeof s1).toBe('number');
      expect(s0.a).toBe(1);
      expect(s0).not.toBe([...set.values()][0]);
    });

    it('clones Date, RegExp and ArrayBuffer', () => {
      const d = new Date('2020-01-01T00:00:00.000Z');
      const r = /ab+c/gi;
      const buf = new ArrayBuffer(4);
      new Uint8Array(buf).set([1, 2, 3, 4]);

      const cd = Obj.clone(d);
      const cr = Obj.clone(r);
      const cbuf = Obj.clone(buf);

      expect(cd).not.toBe(d);
      expect(+cd).toBe(+d);

      expect(cr).not.toBe(r);
      expect(cr.source).toBe(r.source);
      expect(cr.flags).toBe(r.flags);

      expect(cbuf).not.toBe(buf);
      expect([...new Uint8Array(cbuf)]).toEqual([1, 2, 3, 4]);
    });
    it('shallow clones when prompted', () => {
      const a: any = { n: 1, child: { m: 2 }, arr: [1, { k: 3 }] };
      a.self = a;
      const c = Obj.clone(a, { maxDepth: 1, strategy: 'shallow' });
      expect(c).not.toBe(a);
      expect(c.child).toBe(a.child);
      expect(c.arr).toBe(a.arr);
      expect(c.self).toStrictEqual(c);
      expect(c.n).toBe(1);
      const c2 = Obj.clone(1, { maxDepth: 2, strategy: 'shallow' });
      expect(c2).toBe(1);
    });
    it('calls structuredClone when prompted', () => {
      const a: any = { n: 1, child: { m: 2 }, arr: [1, { k: 3 }] };
      a.self = a;
      const c = Obj.clone(a, { strategy: 'structured' });
      expect(c).not.toBe(a);
      expect(c.child).not.toBe(a.child);
      expect(c.arr).not.toBe(a.arr);
      expect(c.self).toBe(c);
      expect(c.n).toBe(1);
      expect(c.child.m).toBe(2);
      expect(c.arr[1].k).toBe(3);
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
    it('accepts custom clone function', () => {
      const original = { key: 'value' };
      const frozen = Obj.freeze(original, {
        clone: (obj) => ({ ...obj, extra: 42 })
      });
      expect(frozen).not.toBe(original);
      expect(frozen).toEqual({ key: 'value', extra: 42 });
    });
    it('accepts custom clone options', () => {
      const original = { key: { nested: 'value' } };
      const frozen = Obj.freeze(original, { clone: { maxDepth: Infinity } });
      expect(frozen).not.toBe(original);
      expect(frozen.key).not.toBe(original.key);
      expect(frozen).toEqual(original);
    });
  });
  describe('keys', () => {
    it('returns keys of an object as a typed array', () => {
      const obj = { a: 1, b: 'string' };
      const keys = Obj.keys(obj);
      expect(keys).toEqual(['a', 'b']);
      expect(keys).toBeInstanceOf(Array);
    });
    it('throws on non object input', () => {
      expect(() => Obj.keys(42)).toThrow(TypeError);
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
    it('throws on non object input', () => {
      expect(() => Obj.entries(42)).toThrow(TypeError);
    });
  });
  describe('values', () => {
    it('returns values of an object as a typed array', () => {
      const obj = { a: 1, b: 'string' };
      const values = Obj.values(obj);
      expect(values).toEqual([1, 'string']);
      expect(values).toBeInstanceOf(Array);
    });
    it('throws on non object input', () => {
      expect(() => Obj.values(42)).toThrow(TypeError);
    });
  });
  describe('stripNullish', () => {
    it('removes null and undefined properties', () => {
      const obj = {
        a: 1,
        b: null,
        c: undefined,
        d: {
          e: 2,
          f: null,
          g: { h: 3, i: undefined, j: [1, null, 2, undefined, 3, { k: 4 }] }
        }
      };
      const stripped = Obj.stripNullish(obj, true);
      expect(stripped).toEqual({
        a: 1,
        d: { e: 2, g: { h: 3, j: [1, 2, 3, { k: 4 }] } }
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
  describe('merge', () => {
    it('handles non-object base gracefully', () => {
      const result = Obj.merge(1 as any, { a: 1 });
      expect(result).toBe(1);
    });

    it('merges two objects without stripping nullish when prompted', () => {
      const base = { a: 0 };
      const other = { a: 1, b: 2, c: null, d: undefined, e: { f: 3 } };
      const result = Obj.merge(base, other) as any;
      expect(result).toEqual({ a: 1, b: 2, c: null, e: { f: 3 } });
    });
    it('deep merges nested objects', () => {
      const base = { a: { b: 1, c: 2 }, d: 3 };
      const other = { a: { b: 10, e: 4 }, f: 5 };
      const result = Obj.merge(base, other) as any;
      expect(result).toEqual({ a: { b: 10, c: 2, e: 4 }, d: 3, f: 5 });
    });
    it('uses custom primitive handler when provided', () => {
      const base = { a: 1, b: 2 };
      const other = { a: 10, b: 20, c: 30 };
      const result = Obj.merge(base, other, {
        primitiveHandler: (a, b) =>
          typeof a === 'number' && typeof b === 'number' ? a + b : b
      }) as any;
      expect(result).toEqual({ a: 11, b: 22, c: 30 });
    });
    it('uses custom array handler when provided', () => {
      const base = { a: [1, 2], b: [3] };
      const other = { a: [4, 5], b: [6], c: [7, 8] };
      const result = Obj.merge(base, other, {
        arrayHandler: (a, b) => [...a, ...b]
      }) as any;
      expect(result).toEqual({ a: [1, 2, 4, 5], b: [3, 6], c: [7, 8] });
    });
    it('retains empty object properties when prompted', () => {
      const base = { a: 1, b: { c: 2 } };
      const other = { a: null, b: {}, d: {} };
      const result = Obj.merge(base, other, {
        retainEmptyObjectProps: true
      }) as any;
      expect(result).toEqual({ a: null, b: {}, d: {} });
    });
    it('strips nullish values from the result when prompted', () => {
      const base = { a: null, b: undefined };
      const other = { a: null, b: undefined, c: 3, d: { e: null, f: 4 } };
      const result = Obj.merge(base, other, { stripNullish: true }) as any;
      expect(result).toEqual({ c: 3, d: { f: 4 } });
    });
  });
  describe('mergeAll', () => {
    it('handles non-object base gracefully', () => {
      const result = Obj.mergeAll(
        1 as any,
        [undefined, 'x', { a: 1 }] as any[]
      );
      expect(result).toBe(1);
    });

    it('merges a series of objects', () => {
      const base = { a: 0 };
      const other = [
        { a: 1 },
        { a: undefined, b: 2 },
        { c: null },
        { d: { e: 3 } }
      ];
      const result = Obj.mergeAll(base, other) as any;
      expect(result).toEqual({ a: 1, b: 2, c: null, d: { e: 3 } });
    });
    it('removes nullish values from other array', () => {
      const base = { a: 1, b: 2 };
      const other = [
        null,
        undefined,
        { a: 10 },
        { b: null, c: 3 },
        undefined,
        { d: 4 }
      ];
      const result = Obj.mergeAll(base, other, {
        retainEmptyObjectProps: true
      }) as any;
      expect(result).toEqual({ a: 10, b: null, c: 3, d: 4 });
    });
  });
  describe('filter', () => {
    it('filters by type guard predicate', () => {
      const o = { a: 1, b: '2', c: 3 };
      const onlyNums = Obj.filter(
        o,
        (_k, v): v is number => typeof v === 'number'
      );
      expect(onlyNums).toEqual({ a: 1, c: 3 });
    });

    it('returns empty object for non-plain objects', () => {
      expect(Obj.filter(null as any, (_k, _v): _v is number => true)).toEqual(
        {}
      );
    });
  });
  describe('pick', () => {
    it('picks only existing keys', () => {
      const o = { a: 1, b: 2 };
      expect(Obj.pick(o, ['a', 'c' as any])).toEqual({ a: 1 });
    });

    it('returns empty object for non-plain objects', () => {
      expect(Obj.pick(null as any, ['a'])).toEqual({});
      expect(Obj.pick(123 as any, ['a'])).toEqual({});
      expect(Obj.pick([] as any, ['length' as any])).toEqual({});
    });
  });

  describe('omit', () => {
    it('omits specified keys', () => {
      const o = { a: 1, b: 2, c: 3 };
      expect(Obj.omit(o, ['b'])).toEqual({ a: 1, c: 3 });
      expect(Obj.omit(o, ['x' as any])).toEqual({ a: 1, b: 2, c: 3 });
    });

    it('returns empty object for non-plain objects', () => {
      expect(Obj.omit(null as any, ['a'])).toEqual({});
      expect(Obj.omit(123 as any, ['a'])).toEqual({});
      expect(Obj.omit([] as any, ['length' as any])).toEqual({});
    });
  });

  describe('map', () => {
    it('maps entries to a new StrRecord', () => {
      const o = { a: 1, b: 2 };
      const doubled = Obj.map(o, (_k, v) => v * 2);
      expect(doubled).toEqual({ a: 2, b: 4 });
    });

    it('returns empty StrRecord for non-plain objects', () => {
      expect(Obj.map(null as any, () => 1)).toEqual({});
    });
  });

  describe('reduce', () => {
    it('reduces over StrRecord entries', () => {
      const o = { a: 1, b: 2, c: 3 };
      const sum = Obj.reduce(o, (acc, v) => acc + v, 0);
      expect(sum).toBe(6);
    });

    it('returns initial value for non-plain objects', () => {
      expect(Obj.reduce(null as any, (acc) => acc + 1, 5)).toBe(5);
    });
  });

  describe('pluck', () => {
    it('plucks a property from nested dictionaries', () => {
      const dict = {
        a: { id: 1, x: 'x' },
        b: { id: 2 },
        c: { y: 3 } as any, // missing id → skipped
        d: 10 as any // not an object → skipped
      };
      const ids = Obj.pluck(dict, 'id');
      expect(ids).toEqual({ a: 1, b: 2 });
      expect('c' in ids).toBe(false);
      expect('d' in ids).toBe(false);
    });

    it('returns input as-is when not a plain object', () => {
      const notObj = null as any;
      expect(Obj.pluck(notObj, 'id' as any)).toBe(notObj);
    });
  });
});
