import { describe, expectTypeOf, it } from 'vitest';

import type {
  Entries,
  ExtractNonPrimitives,
  ExtractOptional,
  ExtractPrimitives,
  ExtractRecordValues,
  ExtractRequired,
  Filter,
  Keys,
  Mutable,
  NestedMutable,
  NestedPartial,
  NestedPartiallyOptional,
  NestedReadonly,
  NestedRequired,
  NestedRequiredProps,
  RequiredProps,
  SharedKeys,
  StripNullish,
  StrKey,
  UniqueKeys,
  Values
} from './object.js';

interface User {
  address: { street: string; zip?: number } | null;
  email: null | string;
  id: number;
  name?: string;
  readonly role: string;
  tags: string[];
}

describe('Object Types', () => {
  describe('Extract', () => {
    it('extracts non-primitive key-values', () => {
      type NonPrimitives = ExtractNonPrimitives<User>;
      expectTypeOf<NonPrimitives>().toEqualTypeOf<{
        address: { street: string; zip?: number } | null;
        tags: string[];
      }>();
    });
    it('extracts optional key-values', () => {
      type Optional = ExtractOptional<User>;
      expectTypeOf<Optional>().toEqualTypeOf<{ name?: string }>();
    });
    it('extracts primitive key-values', () => {
      type Primitives = ExtractPrimitives<User>;
      expectTypeOf<Primitives>().toEqualTypeOf<{
        email: null | string;
        id: number;
        name?: string;
        readonly role: string;
      }>();
    });
    it('extracts required key-values', () => {
      type RequiredUser = ExtractRequired<User>;
      expectTypeOf<RequiredUser>().toEqualTypeOf<{
        address: { street: string; zip?: number } | null;
        email: null | string;
        id: number;
        readonly role: string;
        tags: string[];
      }>();
    });
    it('extracts record values', () => {
      type RecordValues = ExtractRecordValues<{ a: number; b: string }>;
      expectTypeOf<RecordValues>().toEqualTypeOf<number | string>();
    });
  });
  it('filters by value type', () => {
    type FilteredUser = Filter<User, null | string | undefined>;
    expectTypeOf<FilteredUser>().toEqualTypeOf<{
      email: null | string;
      name?: string;
      readonly role: string;
    }>();
  });
  it('strips nullish values', () => {
    type StrippedUser = StripNullish<User>;
    expectTypeOf<StrippedUser>().toEqualTypeOf<{
      id: number;
      readonly role: string;
      tags: string[];
    }>();
  });
  describe('keys', () => {
    it('gets shared keys', () => {
      type Shared = SharedKeys<
        { id: number; name: string },
        { email: string; id: string }
      >;
      expectTypeOf<Shared>().toEqualTypeOf<'id'>();
    });
    it('gets string keys', () => {
      type StringKeys = StrKey<{ 0: boolean; id: number; name: string }>;
      expectTypeOf<StringKeys>().toEqualTypeOf<'id' | 'name'>();
    });
    it('gets unique keys', () => {
      type Unique = UniqueKeys<
        { age: number; id: number; name: string },
        { email: string; id: string }
      >;
      expectTypeOf<Unique>().toEqualTypeOf<'age' | 'email' | 'name'>();
    });
  });
  describe('property modifiers', () => {
    it('makes properties mutable', () => {
      type MutableUser = Mutable<{ readonly id: number; name: string }>;
      expectTypeOf<MutableUser>().toEqualTypeOf<{ id: number; name: string }>();
    });
    it('makes specified properties required', () => {
      type UserWithRequiredId = RequiredProps<
        { id?: number; name?: string },
        'id'
      >;
      expectTypeOf<UserWithRequiredId>().branded.toEqualTypeOf<{
        id: number;
        name?: string | undefined;
      }>();
    });
    describe('nested', () => {
      it('makes properties mutable', () => {
        type NestedMutableUser = NestedMutable<{
          readonly id: number;
          nested: { readonly prop: string };
        }>;
        expectTypeOf<NestedMutableUser>().toEqualTypeOf<{
          id: number;
          nested: { prop: string };
        }>();
      });
      it('makes all properties partial', () => {
        type NestedPartialUser = NestedPartial<{
          id: number;
          nested: { prop: string };
        }>;
        expectTypeOf<NestedPartialUser>().toEqualTypeOf<{
          id?: number | undefined;
          nested?: { prop?: string | undefined } | undefined;
        }>();
      });
      it('makes specified properties partially optional', () => {
        type NestedPartiallyOptionalUser = NestedPartiallyOptional<
          { id: number; nested: { prop: string } },
          'nested'
        >;
        expectTypeOf<NestedPartiallyOptionalUser>().branded.toEqualTypeOf<{
          id: number;
          nested?: { prop?: string | undefined } | undefined;
        }>();
      });
      it('makes all properties readonly', () => {
        type NestedReadonlyUser = NestedReadonly<{
          id: number;
          nested: { prop: string };
        }>;
        expectTypeOf<NestedReadonlyUser>().toEqualTypeOf<{
          readonly id: number;
          readonly nested: { readonly prop: string };
        }>();
      });
      it('makes all properties required', () => {
        type NestedRequiredUser = NestedRequired<{
          id?: number;
          nested?: { prop?: string };
        }>;
        expectTypeOf<NestedRequiredUser>().toEqualTypeOf<{
          id: number;
          nested: { prop: string };
        }>();
      });
      it('makes specified properties required', () => {
        type NestedRequiredPropsUser = NestedRequiredProps<
          { id?: number; nested?: { prop?: string } },
          'nested'
        >;
        expectTypeOf<NestedRequiredPropsUser>().branded.toEqualTypeOf<{
          id?: number | undefined;
          nested: { prop: string };
        }>();
      });
    });
  });
  it('entries', () => {
    type UserEntries = Entries<User>;
    expectTypeOf<UserEntries>().toEqualTypeOf<
      | ['address', { street: string; zip?: number } | null]
      | ['email', null | string]
      | ['id', number]
      | ['name', string | undefined]
      | ['role', string]
      | ['tags', string[]]
    >();
  });
  it('keys', () => {
    type UserKeys = Keys<User>;
    expectTypeOf<UserKeys>().toEqualTypeOf<
      ('address' | 'email' | 'id' | 'name' | 'role' | 'tags')[]
    >();
  });
  it('values', () => {
    type UserValues = Values<User>;
    expectTypeOf<UserValues>().toEqualTypeOf<
      (
        | { street: string; zip?: number | undefined }
        | null
        | number
        | string
        | string[]
        | undefined
      )[]
    >();
  });
});
