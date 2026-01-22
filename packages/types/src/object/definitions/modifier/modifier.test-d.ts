import { describe, expectTypeOf, it } from 'vitest';

import type * as Modifiers from './modifier.ts';

describe('PropertyModifiers types', () => {
  //#region> Mutable
  describe('Mutable<T>', () => {
    it('should remove readonly from top-level properties', () => {
      interface ReadonlyUser {
        readonly id: number;
        readonly name: string;
      }
      type Result = Modifiers.Mutable<ReadonlyUser>;

      expectTypeOf<Result>().toEqualTypeOf<{ id: number; name: string }>();
    });

    it('should not affect non-readonly properties', () => {
      interface Mixed {
        readonly id: number;
        name: string;
      }
      type Result = Modifiers.Mutable<Mixed>;

      expectTypeOf<Result>().toEqualTypeOf<{ id: number; name: string }>();
    });

    it('should be shallow - not affect nested readonly', () => {
      interface User {
        readonly address: { readonly street: string };
        readonly id: number;
      }
      type Result = Modifiers.Mutable<User>;

      expectTypeOf<Result>().toEqualTypeOf<{
        address: { readonly street: string };
        id: number;
      }>();
    });

    it('should preserve optional properties', () => {
      interface User {
        readonly id: number;
        readonly name?: string;
      }
      type Result = Modifiers.Mutable<User>;

      expectTypeOf<Result>().toEqualTypeOf<{ id: number; name?: string }>();
    });

    it('should handle empty object', () => {
      type Result = Modifiers.Mutable<{}>;

      expectTypeOf<Result>().toEqualTypeOf<{}>();
    });
  });
  //#endregion

  //#region> RequiredProps
  describe('RequiredProps<T, K>', () => {
    it('should make specified keys required', () => {
      interface User {
        email?: string;
        id: number;
        name?: string;
      }
      type Result = Modifiers.RequiredProps<User, 'name'>;

      expectTypeOf<Result>().branded.toEqualTypeOf<{
        email?: string;
        id: number;
        name: string;
      }>();
    });

    it('should handle multiple keys', () => {
      interface User {
        email?: string;
        id: number;
        name?: string;
      }
      type Result = Modifiers.RequiredProps<User, 'email' | 'name'>;

      expectTypeOf<Result>().branded.toEqualTypeOf<{
        email: string;
        id: number;
        name: string;
      }>();
    });

    it('should not affect already required properties', () => {
      interface User {
        id: number;
        name: string;
      }
      type Result = Modifiers.RequiredProps<User, 'id'>;

      expectTypeOf<Result>().branded.toEqualTypeOf<{
        id: number;
        name: string;
      }>();
    });

    it('should be shallow', () => {
      interface User {
        address?: { street?: string };
        id: number;
      }
      type Result = Modifiers.RequiredProps<User, 'address'>;

      expectTypeOf<Result>().branded.toEqualTypeOf<{
        address: { street?: string };
        id: number;
      }>();
    });
  });
  //#endregion

  //#region> DeepMutable
  describe('DeepMutable<T>', () => {
    it('should remove readonly from all levels', () => {
      interface User {
        readonly address: { readonly street: string };
        readonly name: string;
      }
      type Result = Modifiers.DeepMutable<User>;

      expectTypeOf<Result>().toEqualTypeOf<{
        address: { street: string };
        name: string;
      }>();
    });

    it('should handle deeply nested structures', () => {
      interface Data {
        readonly a: { readonly b: { readonly c: number } };
      }
      type Result = Modifiers.DeepMutable<Data>;

      expectTypeOf<Result>().toEqualTypeOf<{ a: { b: { c: number } } }>();
    });

    it('should not affect primitives', () => {
      type Result = Modifiers.DeepMutable<string>;

      expectTypeOf<Result>().toEqualTypeOf<string>();
    });

    it('should handle arrays', () => {
      interface Data {
        readonly items: readonly number[];
      }
      type Result = Modifiers.DeepMutable<Data>;

      expectTypeOf<Result>().toEqualTypeOf<{ items: number[] }>();
    });
  });
  //#endregion

  //#region> DeepPartial
  describe('DeepPartial<T>', () => {
    it('should make all properties optional at all levels', () => {
      interface User {
        address: { street: string };
        name: string;
      }
      type Result = Modifiers.DeepPartial<User>;

      expectTypeOf<Result>().toEqualTypeOf<{
        address?: { street?: string };
        name?: string;
      }>();
    });

    it('should handle deeply nested structures', () => {
      interface Data {
        a: { b: { c: number } };
      }
      type Result = Modifiers.DeepPartial<Data>;

      expectTypeOf<Result>().toEqualTypeOf<{ a?: { b?: { c?: number } } }>();
    });

    it('should not affect primitives', () => {
      type Result = Modifiers.DeepPartial<string>;

      expectTypeOf<Result>().toEqualTypeOf<string>();
    });

    it('should handle arrays', () => {
      interface Data {
        items: number[];
      }
      type Result = Modifiers.DeepPartial<Data>;

      expectTypeOf<Result>().toEqualTypeOf<{ items?: number[] }>();
    });

    it('should preserve already optional properties', () => {
      interface User {
        address?: { street: string };
        id: number;
        name?: string;
      }
      type Result = Modifiers.DeepPartial<User>;

      expectTypeOf<Result>().toEqualTypeOf<{
        address?: { street?: string };
        id?: number;
        name?: string;
      }>();
    });
  });
  //#endregion

  //#region> DeepPartiallyOptional
  describe('DeepPartiallyOptional<T, K>', () => {
    it('should make specified keys deeply optional', () => {
      interface User {
        address: { street: string };
        id: number;
        name?: string;
      }
      type Result = Modifiers.DeepPartiallyOptional<User, 'address'>;

      expectTypeOf<Result>().branded.toEqualTypeOf<{
        address?: { street?: string };
        id: number;
        name?: string;
      }>();
    });

    it('should handle multiple keys', () => {
      interface User {
        id: number;
        profile: { name: string };
        settings: { theme: string };
      }
      type Result = Modifiers.DeepPartiallyOptional<
        User,
        'profile' | 'settings'
      >;

      expectTypeOf<Result>().branded.toEqualTypeOf<{
        id: number;
        profile?: { name?: string };
        settings?: { theme?: string };
      }>();
    });

    it('should not affect unspecified keys', () => {
      interface User {
        address: { street: string };
        id: number;
        name: string;
      }
      type Result = Modifiers.DeepPartiallyOptional<User, 'address'>;

      expectTypeOf<Result>().branded.toEqualTypeOf<{
        address?: { street?: string };
        id: number;
        name: string;
      }>();
    });
  });
  //#endregion

  //#region> DeepReadonly
  describe('DeepReadonly<T>', () => {
    it('should make all properties readonly at all levels', () => {
      interface User {
        address: { street: string };
        name: string;
      }
      type Result = Modifiers.DeepReadonly<User>;

      expectTypeOf<Result>().toEqualTypeOf<{
        readonly address: { readonly street: string };
        readonly name: string;
      }>();
    });

    it('should handle deeply nested structures', () => {
      interface Data {
        a: { b: { c: number } };
      }
      type Result = Modifiers.DeepReadonly<Data>;

      expectTypeOf<Result>().toEqualTypeOf<{
        readonly a: { readonly b: { readonly c: number } };
      }>();
    });

    it('should not affect primitives', () => {
      type Result = Modifiers.DeepReadonly<string>;

      expectTypeOf<Result>().toEqualTypeOf<string>();
    });

    it('should handle arrays', () => {
      interface Data {
        items: number[];
      }
      type Result = Modifiers.DeepReadonly<Data>;

      expectTypeOf<Result>().toEqualTypeOf<{
        readonly items: readonly number[];
      }>();
    });
  });
  //#endregion

  //#region> DeepRequired
  describe('DeepRequired<T>', () => {
    it('should make all properties required at all levels', () => {
      interface User {
        address?: { street?: string };
        name?: string;
      }
      type Result = Modifiers.DeepRequired<User>;

      expectTypeOf<Result>().toEqualTypeOf<{
        address: { street: string };
        name: string;
      }>();
    });

    it('should handle deeply nested structures', () => {
      interface Data {
        a?: { b?: { c?: number } };
      }
      type Result = Modifiers.DeepRequired<Data>;

      expectTypeOf<Result>().toEqualTypeOf<{ a: { b: { c: number } } }>();
    });

    it('should not affect primitives', () => {
      type Result = Modifiers.DeepRequired<string>;

      expectTypeOf<Result>().toEqualTypeOf<string>();
    });

    it('should handle arrays', () => {
      interface Data {
        items?: number[];
      }
      type Result = Modifiers.DeepRequired<Data>;

      expectTypeOf<Result>().toEqualTypeOf<{ items: number[] }>();
    });
  });
  //#endregion

  //#region> DeepRequiredProps
  describe('DeepRequiredProps<T, K>', () => {
    it('should make specified keys deeply required', () => {
      interface User {
        address?: { street?: string };
        id: number;
        name?: string;
      }
      type Result = Modifiers.DeepRequiredProps<User, 'address'>;

      expectTypeOf<Result>().branded.toEqualTypeOf<{
        address: { street: string };
        id: number;
        name?: string;
      }>();
    });

    it('should handle multiple keys', () => {
      interface User {
        id: number;
        profile?: { name?: string };
        settings?: { theme?: string };
      }
      type Result = Modifiers.DeepRequiredProps<User, 'profile' | 'settings'>;

      expectTypeOf<Result>().branded.toEqualTypeOf<{
        id: number;
        profile: { name: string };
        settings: { theme: string };
      }>();
    });

    it('should not affect unspecified keys', () => {
      interface User {
        address?: { street?: string };
        id: number;
        name?: string;
      }
      type Result = Modifiers.DeepRequiredProps<User, 'address'>;

      expectTypeOf<Result>().branded.toEqualTypeOf<{
        address: { street: string };
        id: number;
        name?: string;
      }>();
    });
  });
  //#endregion

  //#region> DepthReadonly
  describe('DepthReadonly<T, D>', () => {
    it('should make properties readonly at depth 0', () => {
      interface User {
        id: number;
        nested: { deeper: { value: number }; prop: string };
      }
      type Result = Modifiers.DepthReadonly<User, 0>;

      expectTypeOf<Result>().toEqualTypeOf<{
        readonly id: number;
        readonly nested: { deeper: { value: number }; prop: string };
      }>();
    });

    it('should make properties readonly at depth 1', () => {
      interface User {
        id: number;
        nested: { deeper: { value: number }; prop: string };
      }
      type Result = Modifiers.DepthReadonly<User, 1>;

      expectTypeOf<Result>().toEqualTypeOf<{
        readonly id: number;
        readonly nested: {
          readonly deeper: { value: number };
          readonly prop: string;
        };
      }>();
    });

    it('should make properties readonly at depth 2', () => {
      interface User {
        id: number;
        nested: { deeper: { value: number }; prop: string };
      }
      type Result = Modifiers.DepthReadonly<User, 2>;

      expectTypeOf<Result>().toEqualTypeOf<{
        readonly id: number;
        readonly nested: {
          readonly deeper: { readonly value: number };
          readonly prop: string;
        };
      }>();
    });

    it('should handle shallow structures with high depth', () => {
      interface Flat {
        a: number;
        b: string;
      }
      type Result = Modifiers.DepthReadonly<Flat, 5>;

      expectTypeOf<Result>().toEqualTypeOf<{
        readonly a: number;
        readonly b: string;
      }>();
    });

    it('should stop at specified depth', () => {
      interface Deep {
        a: { b: { c: { d: number } } };
      }
      type Result = Modifiers.DepthReadonly<Deep, 2>;

      expectTypeOf<Result>().toEqualTypeOf<{
        readonly a: { readonly b: { readonly c: { d: number } } };
      }>();
    });
  });
  //#endregion

  //#region> Frozen
  describe('Frozen<T, Depth>', () => {
    it('should create frozen type with __frozen__ marker', () => {
      interface User {
        id: number;
        name: string;
      }
      type Result = Modifiers.Frozen<User>;

      expectTypeOf<Result>().toEqualTypeOf<{
        readonly __frozen__: true;
        readonly id: number;
        readonly name: string;
      }>();
    });

    it('should handle depth 0 (shallow freeze)', () => {
      interface User {
        address: { street: string };
        id: number;
      }
      type Result = Modifiers.Frozen<User>;

      expectTypeOf<Result>().toEqualTypeOf<{
        readonly __frozen__: true;
        readonly address: { street: string };
        readonly id: number;
      }>();
    });

    it('should handle depth 1 (one level deep)', () => {
      interface User {
        address: { street: string };
        id: number;
      }
      type Result = Modifiers.Frozen<User, 1>;

      expectTypeOf<Result>().toEqualTypeOf<{
        readonly __frozen__: true;
        readonly address: { readonly street: string };
        readonly id: number;
      }>();
    });

    it('should include __frozen__ marker at all depths', () => {
      interface Simple {
        value: number;
        x: { value: string };
      }
      type Shallow = Modifiers.Frozen<Simple>;
      type Deep = Modifiers.Frozen<Simple, 5>;

      expectTypeOf<Shallow>().toEqualTypeOf<{
        readonly __frozen__: true;
        readonly value: number;
        readonly x: { value: string };
      }>();
      expectTypeOf<Deep>().toEqualTypeOf<{
        readonly __frozen__: true;
        readonly value: number;
        readonly x: { readonly value: string };
      }>();
    });

    it('should work with complex nested structures', () => {
      interface Complex {
        user: { profile: { name: string } };
      }
      type Result = Modifiers.Frozen<Complex, 2>;

      expectTypeOf<Result>().toEqualTypeOf<{
        readonly __frozen__: true;
        readonly user: { readonly profile: { readonly name: string } };
      }>();
    });
  });
  //#endregion

  //#region> Integration
  describe('Integration', () => {
    it('should combine modifiers - make required then readonly', () => {
      interface User {
        email?: string;
        id: number;
        name?: string;
      }
      type Required = Modifiers.RequiredProps<User, 'name'>;
      type Result = Modifiers.DeepReadonly<Required>;

      expectTypeOf<Result>().toEqualTypeOf<{
        readonly email?: string;
        readonly id: number;
        readonly name: string;
      }>();
    });

    it('should combine deep modifiers', () => {
      interface User {
        profile?: { age: number; name?: string };
      }
      type Required = Modifiers.DeepRequired<User>;
      type Result = Modifiers.DeepReadonly<Required>;

      expectTypeOf<Result>().toEqualTypeOf<{
        readonly profile: { readonly age: number; readonly name: string };
      }>();
    });

    it('should handle partial then frozen', () => {
      interface User {
        id: number;
        name: string;
      }
      type Partial = Modifiers.DeepPartial<User>;
      type Result = Modifiers.Frozen<Partial, 1>;

      expectTypeOf<Result>().toEqualTypeOf<{
        readonly __frozen__: true;
        readonly id?: number;
        readonly name?: string;
      }>();
    });
  });
  //#endregion
  //#region> StripNullish
  describe('StripNullish<T>', () => {
    it('should strip properties of nullish union from shallow object', () => {
      interface Data {
        age: number;
        email: string | undefined;
        id: number;
        name: null | string;
      }
      type Result = Modifiers.StripNullish<Data>;

      expectTypeOf<Result>().toEqualTypeOf<{
        age: number;
        email: string;
        id: number;
        name: string;
      }>();
    });

    it('should handle deeply nested objects', () => {
      interface Data {
        details: {
          address: { city: string; street: null | string } | null;
          age: null | number;
        };
        id: null | number;
        name: string | undefined;
      }
      type Result = Modifiers.StripNullish<Data>;

      expectTypeOf<Result>().toEqualTypeOf<{
        details: { address: { city: string; street: string }; age: number };
        id: number;
        name: string;
      }>();
    });

    it('should strip nullish from arrays', () => {
      interface Data {
        ids: (number | undefined)[];
        tags: (null | string)[];
      }
      type Result = Modifiers.StripNullish<Data>;

      expectTypeOf<Result>().toEqualTypeOf<{ ids: number[]; tags: string[] }>();
    });

    it('should preserve functions as-is', () => {
      interface Data {
        getInfo: () => null | string;
        id: null | number;
        setData: (v: null | number) => void;
      }
      type Result = Modifiers.StripNullish<Data>;

      expectTypeOf<Result>().toEqualTypeOf<{
        getInfo: () => null | string;
        id: number;
        setData: (v: null | number) => void;
      }>();
    });

    it('should handle optional properties with nullish values', () => {
      interface Data {
        nullable: null | number;
        optional?: null | string;
        required: string;
      }
      type Result = Modifiers.StripNullish<Data>;

      expectTypeOf<Result>().toEqualTypeOf<{
        nullable: number;
        optional?: string;
        required: string;
      }>();
    });

    it('should handle readonly arrays', () => {
      interface Data {
        tags: readonly (null | string)[];
      }
      type Result = Modifiers.StripNullish<Data>;

      expectTypeOf<Result>().toEqualTypeOf<{ tags: readonly string[] }>();
    });

    it('should handle completely nullish object', () => {
      interface Data {
        a: null;
        b: undefined;
        c: null | undefined;
      }
      type Result = Modifiers.StripNullish<Data>;

      expectTypeOf<Result>().toEqualTypeOf<{ a: never; b: never; c: never }>();
    });

    it('should handle primitives directly', () => {
      type Str = Modifiers.StripNullish<string>;
      type Num = Modifiers.StripNullish<number>;
      type Bool = Modifiers.StripNullish<boolean>;

      expectTypeOf<Str>().toEqualTypeOf<string>();
      expectTypeOf<Num>().toEqualTypeOf<number>();
      expectTypeOf<Bool>().toEqualTypeOf<boolean>();
    });

    it('should handle complex nested scenarios', () => {
      interface Complex {
        legacy: null;
        metadata: { count: null | number; tags: (null | string)[] };

        user:
          | {
              profile: {
                age: number;
                bio: string | undefined;
                name: null | string;
              } | null;
              settings: { theme: string };
            }
          | undefined;
      }
      type Result = Modifiers.StripNullish<Complex>;

      expectTypeOf<Result>().toEqualTypeOf<{
        legacy: never;
        metadata: { count: number; tags: string[] };
        user: {
          profile: { age: number; bio: string; name: string };
          settings: { theme: string };
        };
      }>();
    });
  });
  //#endregion

  //#region> RemoveIndexSignature
  describe('RemoveIndexSignature', () => {
    it('should remove index signatures from an object type', () => {
      interface T {
        [index: number]: boolean;
        [key: string]: unknown;
        a: number;
        b: string;
      }
      type Result = Modifiers.RemoveIndexSignature<T>;
      expectTypeOf<Result>().toEqualTypeOf<{ a: number; b: string }>();
    });
  });
  //#endregion
});
