import { describe, expectTypeOf, it } from 'vitest';

import type * as Descriptors from './descriptor.ts';

describe('PropertyDescriptors types', () => {
  //#region> Enumerable
  describe('Enumerable<P>', () => {
    it('should filter enumerable property descriptors', () => {
      interface Props {
        age: { enumerable: true; value: 30 };
        id: { enumerable: false; value: 123 };
        name: { enumerable: true; value: 'Alice' };
      }
      type Result = Descriptors.Enumerable<Props>;

      expectTypeOf<Result>().toEqualTypeOf<{
        age: { enumerable: true; value: 30 };
        name: { enumerable: true; value: 'Alice' };
      }>();
    });

    it('should return empty when no enumerable properties', () => {
      interface Props {
        id: { enumerable: false; value: 123 };
        secret: { enumerable: false; value: 'hidden' };
      }
      type Result = Descriptors.Enumerable<Props>;

      expectTypeOf<Result>().toEqualTypeOf<{}>();
    });

    it('should handle all enumerable properties', () => {
      interface Props {
        a: { enumerable: true; value: 1 };
        b: { enumerable: true; value: 2 };
      }
      type Result = Descriptors.Enumerable<Props>;

      expectTypeOf<Result>().toEqualTypeOf<Props>();
    });

    it('should handle accessor descriptors', () => {
      interface Props {
        getter: { enumerable: true; get: () => string };
        setter: { enumerable: false; set: (v: number) => void };
      }
      type Result = Descriptors.Enumerable<Props>;

      expectTypeOf<Result>().toEqualTypeOf<{ getter: { enumerable: true; get: () => string } }>();
    });

    it('should handle mixed descriptors', () => {
      interface Props {
        data: { enumerable: true; value: 'test' };
        getter: { enumerable: true; get: () => number };
        hidden: { enumerable: false; value: 'secret' };
        privateSetter: { enumerable: false; set: (v: string) => void };
      }
      type Result = Descriptors.Enumerable<Props>;

      expectTypeOf<Result>().toEqualTypeOf<{
        data: { enumerable: true; value: 'test' };
        getter: { enumerable: true; get: () => number };
      }>();
    });
  });
  //#endregion

  //#region> EnumerableKeys
  describe('EnumerableKeys<P>', () => {
    it('should extract keys of enumerable descriptors', () => {
      interface Props {
        age: { enumerable: true; value: 30 };
        id: { enumerable: false; value: 123 };
        name: { enumerable: true; value: 'Alice' };
      }
      type Result = Descriptors.EnumerableKeys<Props>;

      expectTypeOf<Result>().toEqualTypeOf<'age' | 'name'>();
    });

    it('should return never when no enumerable properties', () => {
      interface Props {
        id: { enumerable: false; value: 123 };
      }
      type Result = Descriptors.EnumerableKeys<Props>;

      expectTypeOf<Result>().toEqualTypeOf<never>();
    });

    it('should handle all enumerable properties', () => {
      interface Props {
        a: { enumerable: true; value: 1 };
        b: { enumerable: true; value: 2 };
        c: { enumerable: true; value: 3 };
      }
      type Result = Descriptors.EnumerableKeys<Props>;

      expectTypeOf<Result>().toEqualTypeOf<'a' | 'b' | 'c'>();
    });
  });
  //#endregion

  //#region> EnumerableValues
  describe('EnumerableValues<P>', () => {
    it('should extract values from enumerable descriptors', () => {
      interface Props {
        age: { enumerable: true; value: 30 };
        id: { enumerable: false; value: 123 };
        name: { enumerable: true; value: 'Alice' };
      }
      type Result = Descriptors.EnumerableValues<Props>;

      expectTypeOf<Result>().toEqualTypeOf<{ age: 30; name: 'Alice' }>();
    });

    it('should return {} when no enumerable properties', () => {
      interface Props {
        id: { enumerable: false; value: 123 };
      }
      type Result = Descriptors.EnumerableValues<Props>;

      expectTypeOf<Result>().toEqualTypeOf<{}>();
    });

    it('should handle different value types', () => {
      interface Props {
        bool: { enumerable: true; value: true };
        num: { enumerable: true; value: 42 };
        obj: { enumerable: true; value: { nested: string } };
        str: { enumerable: true; value: 'text' };
      }
      type Result = Descriptors.EnumerableValues<Props>;

      expectTypeOf<Result>().toEqualTypeOf<{
        bool: true;
        num: 42;
        obj: { nested: string };
        str: 'text';
      }>();
    });

    it('should handle accessor descriptors', () => {
      interface Props {
        getter: { enumerable: true; get: () => string };
        setter: { enumerable: false; set: (v: number) => void };
      }
      type Result = Descriptors.EnumerableValues<Props>;

      expectTypeOf<Result>().toEqualTypeOf<{ getter: string }>();
    });

    it('should handle mixed descriptors', () => {
      interface Props {
        data: { enumerable: true; value: 'test' };
        getter: { enumerable: true; get: () => number };
        hidden: { enumerable: false; value: 'secret' };
        privateSetter: { enumerable: false; set: (v: string) => void };
        setter: { enumerable: true; set: (v: boolean) => void };
      }
      type Result = Descriptors.EnumerableValues<Props>;

      expectTypeOf<Result>().toEqualTypeOf<{ data: 'test'; getter: number }>();
    });
  });
  //#endregion

  //#region> EnumerableEntries
  describe('EnumerableEntries<P>', () => {
    it('should create entries type from enumerable value descriptors', () => {
      interface Props {
        age: { enumerable: true; value: 30 };
        id: { enumerable: false; value: 123 };
        name: { enumerable: true; value: 'Alice' };
      }
      type Result = Descriptors.EnumerableEntries<Props>;

      expectTypeOf<Result>().toEqualTypeOf<{ age: ['age', 30]; name: ['name', 'Alice'] }>();
    });

    it('should exclude non-value descriptors', () => {
      interface Props {
        getter: { enumerable: true; get: () => string };
        setter: { enumerable: true; set: (v: number) => void };
        value: { enumerable: true; value: 'test' };
      }
      type Result = Descriptors.EnumerableEntries<Props>;

      expectTypeOf<Result>().toEqualTypeOf<{ value: ['value', 'test'] }>();
    });

    it('should return empty when no enumerable value descriptors', () => {
      interface Props {
        getter: { enumerable: true; get: () => string };
        hidden: { enumerable: false; value: 'secret' };
      }
      type Result = Descriptors.EnumerableEntries<Props>;

      expectTypeOf<Result>().toEqualTypeOf<{}>();
    });
  });
  //#endregion

  //#region> InferValue
  describe('InferValue<T>', () => {
    it('should infer value from data descriptor', () => {
      interface Desc {
        value: 42;
      }
      type Result = Descriptors.InferValue<Desc>;

      expectTypeOf<Result>().toEqualTypeOf<42>();
    });

    it('should infer value from getter', () => {
      interface Desc {
        get: () => string;
      }
      type Result = Descriptors.InferValue<Desc>;

      expectTypeOf<Result>().toEqualTypeOf<string>();
    });

    it('should return unknown for empty descriptor', () => {
      interface Desc {
        enumerable: true;
      }
      type Result = Descriptors.InferValue<Desc>;

      expectTypeOf<Result>().toEqualTypeOf<unknown>();
    });

    it('should handle complex value types', () => {
      interface ObjDesc {
        value: { nested: string };
      }
      interface ArrDesc {
        value: number[];
      }
      interface FuncDesc {
        value: () => void;
      }

      expectTypeOf<Descriptors.InferValue<ObjDesc>>().toEqualTypeOf<{ nested: string }>();
      expectTypeOf<Descriptors.InferValue<ArrDesc>>().toEqualTypeOf<number[]>();
      expectTypeOf<Descriptors.InferValue<FuncDesc>>().toEqualTypeOf<() => void>();
    });

    it('should handle union types in value', () => {
      interface Desc {
        value: null | number | string;
      }
      type Result = Descriptors.InferValue<Desc>;

      expectTypeOf<Result>().toEqualTypeOf<null | number | string>();
    });

    it('should prioritize value over getter/setter', () => {
      interface Desc {
        get: () => number;
        set: (v: boolean) => void;
        value: string;
      }
      type Result = Descriptors.InferValue<Desc>;

      expectTypeOf<Result>().toEqualTypeOf<string>();
    });
  });
  //#endregion

  //#region> InferValueMap
  describe('InferValueMap<P, Narrow>', () => {
    it('should infer wide value map by default', () => {
      interface Props {
        count: { value: 42 };
        handler: { value: () => void };
        id: { value: 'user-123' };
      }
      type Result = Descriptors.InferValueMap<Props>;

      expectTypeOf<Result>().toEqualTypeOf<{ count: 42; handler: () => void; id: 'user-123' }>();
    });

    it('should use narrow when Narrow=true', () => {
      interface Props {
        count: { value: 42 };
        handler: { value: () => void };
        id: { value: 'user-123' };
      }
      type Result = Descriptors.InferValueMap<Props, true>;

      expectTypeOf<Result>().toEqualTypeOf<{ count: 42; handler: () => void; id: 'user-123' }>();
    });

    it('should handle getters and setters', () => {
      interface Props {
        age: { set: (v: number) => void };
        name: { get: () => string };
        value: { value: boolean };
      }
      type Result = Descriptors.InferValueMap<Props>;

      expectTypeOf<Result>().toEqualTypeOf<{ age: number; name: string; value: boolean }>();
    });

    it('should handle empty descriptor map', () => {
      interface Props {}
      type Result = Descriptors.InferValueMap<Props>;

      expectTypeOf<Result>().toEqualTypeOf<{}>();
    });
  });
  describe('InferEnumerableValueMap<P, Narrow>', () => {
    it('should infer wide enumerable value map by default', () => {
      interface Props {
        name: { enumerable: true; value: 'Alice' };
        count: { enumerable: true; value: 42 };
        getData: { enumerable: true; value: () => string };
        [Symbol.iterator]: { enumerable: true; value: () => Iterator<any> };
        hidden: { enumerable: false; value: 'secret' };
      }
      type Result = Descriptors.InferEnumerableValueMap<Props>;

      expectTypeOf<Result>().toEqualTypeOf<{
        name: 'Alice';
        count: 42;
        getData: () => string;
        [Symbol.iterator]: () => Iterator<any>;
      }>();
    });

    it('should use narrow when Narrow=true', () => {
      interface Props {
        id: { enumerable: true; value: 'user-123' };
        count: { enumerable: true; value: 42 };
        handler: { enumerable: true; value: () => void };
        sym: { enumerable: true; value: symbol };
        hidden: { enumerable: false; value: 'secret' };
      }
      type Result = Descriptors.InferEnumerableValueMap<Props, true>;
      expectTypeOf<Result>().toEqualTypeOf<{
        id: 'user-123';
        count: 42;
        handler: () => void;
        sym: symbol;
      }>();
    });
  });
  //#endregion

  //#region> InferValueMapWide
  describe('InferValueMapWide<P>', () => {
    it('should include all properties including functions', () => {
      interface Props {
        count: { value: 42 };
        getData: { value: () => string };
        name: { value: 'Alice' };
      }
      type Result = Descriptors.InferValueMapWide<Props>;

      expectTypeOf<Result>().toEqualTypeOf<{ count: 42; getData: () => string; name: 'Alice' }>();
    });

    it('should handle symbol keys', () => {
      const sym = Symbol('test');
      interface Props {
        str: { value: 'text' };
        [sym]: { value: number };
      }
      type Result = Descriptors.InferValueMapWide<Props>;

      expectTypeOf<Result>().toEqualTypeOf<{ str: 'text'; [sym]: number }>();
    });

    it('should preserve index signatures', () => {
      interface Props {
        [key: string]: { value: unknown };
        specific: { value: string };
      }
      type Result = Descriptors.InferValueMapWide<Props>;

      expectTypeOf<Result>().toEqualTypeOf<{ [key: string]: unknown; specific: string }>();
    });

    it('should handle complex nested value types', () => {
      interface Props {
        tags: { value: string[] };
        user: { value: { profile: { age: number; name: string }; settings: { theme: string } } };
      }
      type Result = Descriptors.InferValueMapWide<Props>;

      expectTypeOf<Result>().toEqualTypeOf<{
        tags: string[];
        user: { profile: { age: number; name: string }; settings: { theme: string } };
      }>();
    });
  });
  describe('InferEnumerableValueMapWide<P>', () => {
    it('should include only enumerable properties', () => {
      interface Props {
        name: { value: 'Alice'; enumerable: true };
        count: { value: 42; enumerable: true };
        getData: { value: () => string; enumerable: true };
        [Symbol.iterator]: { value: () => Iterator<any>; enumerable: true };
        hidden: { value: 'secret'; enumerable: false };
        alsoHidden: { get(): number; enumerable: false };
      }
      type Result = Descriptors.InferEnumerableValueMapWide<Props>;

      expectTypeOf<Result>().toEqualTypeOf<{
        name: 'Alice';
        count: 42;
        getData: () => string;
        [Symbol.iterator]: () => Iterator<any>;
      }>();
    });
  });
  //#endregion

  //#region> InferValueMapNarrow
  describe('InferValueMapNarrow<P>', () => {
    it('should remove index signatures', () => {
      interface Props {
        count: { value: 42 };
        id: { value: 'user-123' };
      }
      type Result = Descriptors.InferValueMapNarrow<Props>;

      expectTypeOf<Result>().toEqualTypeOf<{ count: 42; id: 'user-123' }>();
    });

    it('should handle mixed property types', () => {
      interface Props {
        bool: { value: true };
        num: { value: 42 };
        obj: { value: { nested: string } };
        str: { value: 'text' };
      }
      type Result = Descriptors.InferValueMapNarrow<Props>;

      expectTypeOf<Result>().toEqualTypeOf<{
        bool: true;
        num: 42;
        obj: { nested: string };
        str: 'text';
      }>();
    });

    it('should handle getters and setters', () => {
      interface Props {
        getter: { get: () => string };
        setter: { set: (v: number) => void };
        value: { value: boolean };
      }
      type Result = Descriptors.InferValueMapNarrow<Props>;

      expectTypeOf<Result>().toEqualTypeOf<{ getter: string; setter: number; value: boolean }>();
    });

    it('should preserve symbol keys', () => {
      const sym = Symbol('key');
      interface Props {
        str: { value: 'text' };
        [sym]: { value: number };
      }
      type Result = Descriptors.InferValueMapNarrow<Props>;

      expectTypeOf<Result>().toEqualTypeOf<{ str: 'text'; [sym]: number }>();
    });
  });
  describe('InferEnumerableValueMapNarrow<P>', () => {
    it('should include only enumerable properties', () => {
      interface Props {
        id: { enumerable: true; value: 'user-123' };
        count: { enumerable: true; value: 42 };
        handler: { enumerable: true; value: () => void };
        sym: { enumerable: true; value: symbol };
        hidden: { enumerable: false; value: 'secret' };
        alsoHidden: { get: () => 'secret'; enumerable: false };
      }
      type Result = Descriptors.InferEnumerableValueMapNarrow<Props>;

      expectTypeOf<Result>().toEqualTypeOf<{
        id: 'user-123';
        count: 42;
        handler: () => void;
        sym: symbol;
      }>();
    });
  });
  //#endregion

  //#region> ExtractEnumerable
  describe('ExtractEnumerable<P>', () => {
    it('should extract enumerable property', () => {
      interface Desc1 {
        enumerable: true;
        value: 10;
      }
      interface Desc2 {
        enumerable: false;
        value: 20;
      }
      interface Desc3 {
        value: 30;
      }
      type Result1 = Descriptors.ExtractEnumerable<Desc1>;
      type Result2 = Descriptors.ExtractEnumerable<Desc2>;
      type Result3 = Descriptors.ExtractEnumerable<Desc3>;

      expectTypeOf<Result1>().toEqualTypeOf<true>();
      expectTypeOf<Result2>().toEqualTypeOf<false>();
      expectTypeOf<Result3>().toEqualTypeOf<true>();
    });
  });

  //#region> Integration
  describe('Integration', () => {
    it('should work together - get enumerable values from inferred map', () => {
      interface Props {
        age: { enumerable: true; value: 30 };
        id: { enumerable: false; value: 123 };
        name: { enumerable: true; value: 'Alice' };
      }
      type Inferred = Descriptors.InferValueMap<Props>;
      type EnumKeys = Descriptors.EnumerableKeys<Props>;

      expectTypeOf<Inferred>().toEqualTypeOf<{ age: 30; id: 123; name: 'Alice' }>();
      expectTypeOf<EnumKeys>().toEqualTypeOf<'age' | 'name'>();
    });

    it('should work with Object.defineProperties pattern', () => {
      interface Desc {
        id: { enumerable: true; value: 'user-123'; writable: false };
        name: { enumerable: true; get: () => string; set: (v: string) => void };
        secret: { enumerable: false; value: 'hidden' };
      }
      type Result = Descriptors.InferValueMap<Desc>;
      type EnumKeys = Descriptors.EnumerableKeys<Desc>;

      expectTypeOf<Result>().toEqualTypeOf<{ id: 'user-123'; name: string; secret: 'hidden' }>();
      expectTypeOf<EnumKeys>().toEqualTypeOf<'id' | 'name'>();
    });
  });
  //#endregion
});
