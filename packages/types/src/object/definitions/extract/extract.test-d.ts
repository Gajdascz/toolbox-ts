import { describe, expectTypeOf, it } from 'vitest';

import type * as Extract from './extract.ts';

describe('Extract types', () => {
  //#region> NonPrimitives
  describe('NonPrimitives<T>', () => {
    it('should extract only non-primitive properties', () => {
      interface User {
        address: { street: string };
        id: number;
        name: string;
        siblings: string[];
      }
      type Result = Extract.NonPrimitives<User>;

      expectTypeOf<Result>().toEqualTypeOf<{ address: { street: string }; siblings: string[] }>();
    });

    it('should return empty object when no non-primitives exist', () => {
      interface AllPrimitives {
        active: boolean;
        id: number;
        name: string;
      }
      type Result = Extract.NonPrimitives<AllPrimitives>;

      expectTypeOf<Result>().toEqualTypeOf<{}>();
    });

    it('should include arrays as non-primitives', () => {
      interface WithArrays {
        count: number;
        ids: number[];
        names: string[];
      }
      type Result = Extract.NonPrimitives<WithArrays>;

      expectTypeOf<Result>().toEqualTypeOf<{ ids: number[]; names: string[] }>();
    });

    it('should include Date as non-primitive', () => {
      interface WithDate {
        createdAt: Date;
        id: number;
      }
      type Result = Extract.NonPrimitives<WithDate>;

      expectTypeOf<Result>().toEqualTypeOf<{ createdAt: Date }>();
    });

    it('should include nested objects as non-primitives', () => {
      interface Complex {
        id: number;
        profile: { age: number; bio: string };
        settings: { theme: string };
      }
      type Result = Extract.NonPrimitives<Complex>;

      expectTypeOf<Result>().toEqualTypeOf<{
        profile: { age: number; bio: string };
        settings: { theme: string };
      }>();
    });

    it('should handle nullable properties correctly', () => {
      interface WithNullable {
        address: { street: string } | null;
        id: number;
        tags: string[] | undefined;
      }
      type Result = Extract.NonPrimitives<WithNullable>;

      expectTypeOf<Result>().toEqualTypeOf<{
        address: { street: string } | null;
        tags: string[] | undefined;
      }>();
    });

    it('should include functions as non-primitives', () => {
      interface WithFunction {
        getName: () => string;
        id: number;
        update: (val: number) => void;
      }
      type Result = Extract.NonPrimitives<WithFunction>;

      expectTypeOf<Result>().toEqualTypeOf<{
        getName: () => string;
        update: (val: number) => void;
      }>();
    });

    it('should handle empty object', () => {
      type Result = Extract.NonPrimitives<{}>;

      expectTypeOf<Result>().toEqualTypeOf<{}>();
    });

    it('should handle mixed primitives and non-primitives', () => {
      interface Mixed {
        arr: number[];
        bool: boolean;
        nil: null;
        num: number;
        obj: { nested: string };
        str: string;
        undef: undefined;
      }
      type Result = Extract.NonPrimitives<Mixed>;

      expectTypeOf<Result>().toEqualTypeOf<{ arr: number[]; obj: { nested: string } }>();
    });

    it('should be shallow (not recursive)', () => {
      interface Nested {
        data: { details: { info: string }; name: string };
        id: number;
      }
      type Result = Extract.NonPrimitives<Nested>;

      // Only extracts top-level non-primitives
      expectTypeOf<Result>().toEqualTypeOf<{ data: { details: { info: string }; name: string } }>();
    });

    it('should handle optional non-primitive properties', () => {
      interface WithOptional {
        id: number;
        metadata?: { key: string };
        tags?: string[];
      }
      type Result = Extract.NonPrimitives<WithOptional>;

      expectTypeOf<Result>().toEqualTypeOf<{ metadata?: { key: string }; tags?: string[] }>();
    });
  });
  //#endregion

  //#region> Optional
  describe('Optional<T>', () => {
    it('should extract only optional properties', () => {
      interface User {
        id: number;
        name?: string;
      }
      type Result = Extract.Optional<User>;

      expectTypeOf<Result>().toEqualTypeOf<{ name?: string }>();
    });

    it('should return empty object when no optional properties exist', () => {
      interface AllRequired {
        id: number;
        name: string;
      }
      type Result = Extract.Optional<AllRequired>;

      expectTypeOf<Result>().toEqualTypeOf<{}>();
    });

    it('should handle multiple optional properties', () => {
      interface User {
        age?: number;
        email?: string;
        id: number;
        name?: string;
      }
      type Result = Extract.Optional<User>;

      expectTypeOf<Result>().toEqualTypeOf<{ age?: number; email?: string; name?: string }>();
    });

    it('should handle all optional properties', () => {
      interface AllOptional {
        age?: number;
        email?: string;
        name?: string;
      }
      type Result = Extract.Optional<AllOptional>;

      expectTypeOf<Result>().toEqualTypeOf<{ age?: number; email?: string; name?: string }>();
    });

    it('should handle empty object', () => {
      type Result = Extract.Optional<{}>;

      expectTypeOf<Result>().toEqualTypeOf<{}>();
    });

    it('should preserve property types', () => {
      interface Complex {
        active: boolean;
        id: number;
        profile?: { age: number; name: string };
        tags?: string[];
      }
      type Result = Extract.Optional<Complex>;

      expectTypeOf<Result>().toEqualTypeOf<{
        profile?: { age: number; name: string };
        tags?: string[];
      }>();
    });

    it('should not include undefined union as optional', () => {
      interface WithUndefined {
        email?: string; // Actually optional
        id: number;
        name: string | undefined; // Required but can be undefined
      }
      type Result = Extract.Optional<WithUndefined>;

      expectTypeOf<Result>().toEqualTypeOf<{ email?: string }>();
    });

    it('should be shallow (not recursive)', () => {
      interface Nested {
        id: number;
        optional?: { nested?: number; required: string };
      }
      type Result = Extract.Optional<Nested>;

      // Only extracts top-level optional properties
      expectTypeOf<Result>().toEqualTypeOf<{ optional?: { nested?: number; required: string } }>();
    });
  });
  //#endregion

  //#region> Primitives
  describe('Primitives<T>', () => {
    it('should extract only primitive properties', () => {
      interface User {
        address: { street: string };
        id: number;
        name: string;
      }
      type Result = Extract.Primitives<User>;

      expectTypeOf<Result>().toEqualTypeOf<{ id: number; name: string }>();
    });

    it('should return empty object when no primitives exist', () => {
      interface AllNonPrimitives {
        address: { street: string };
        tags: string[];
      }
      type Result = Extract.Primitives<AllNonPrimitives>;

      expectTypeOf<Result>().toEqualTypeOf<{}>();
    });

    it('should include all primitive types', () => {
      interface AllPrimitives {
        bigint: bigint;
        bool: boolean;
        nil: null;
        num: number;
        str: string;
        sym: symbol;
        undef: undefined;
      }
      type Result = Extract.Primitives<AllPrimitives>;

      expectTypeOf<Result>().toEqualTypeOf<{
        bigint: bigint;
        bool: boolean;
        nil: null;
        num: number;
        str: string;
        sym: symbol;
        undef: undefined;
      }>();
    });

    it('should exclude arrays', () => {
      interface WithArrays {
        count: number;
        id: number;
        tags: string[];
      }
      type Result = Extract.Primitives<WithArrays>;

      expectTypeOf<Result>().toEqualTypeOf<{ count: number; id: number }>();
    });

    it('should exclude Date', () => {
      interface WithDate {
        createdAt: Date;
        id: number;
        name: string;
      }
      type Result = Extract.Primitives<WithDate>;

      expectTypeOf<Result>().toEqualTypeOf<{ id: number; name: string }>();
    });

    it('should exclude functions', () => {
      interface WithFunction {
        count: number;
        getName: () => string;
        id: number;
      }
      type Result = Extract.Primitives<WithFunction>;

      expectTypeOf<Result>().toEqualTypeOf<{ count: number; id: number }>();
    });

    it('should handle nullable primitives', () => {
      interface WithNullable {
        age: number | undefined;
        id: number;
        name: null | string;
      }
      type Result = Extract.Primitives<WithNullable>;

      expectTypeOf<Result>().toEqualTypeOf<{
        age: number | undefined;
        id: number;
        name: null | string;
      }>();
    });

    it('should handle empty object', () => {
      type Result = Extract.Primitives<{}>;

      expectTypeOf<Result>().toEqualTypeOf<{}>();
    });

    it('should handle mixed types', () => {
      interface Mixed {
        active: boolean;
        data: { nested: string };
        id: number;
        name: string;
        tags: string[];
      }
      type Result = Extract.Primitives<Mixed>;

      expectTypeOf<Result>().toEqualTypeOf<{ active: boolean; id: number; name: string }>();
    });

    it('should be shallow (not recursive)', () => {
      interface Nested {
        data: { count: number; name: string };
        id: number;
      }
      type Result = Extract.Primitives<Nested>;

      // Only extracts top-level primitives
      expectTypeOf<Result>().toEqualTypeOf<{ id: number }>();
    });

    it('should handle optional primitive properties', () => {
      interface WithOptional {
        data: { nested: string };
        id: number;
        name?: string;
      }
      type Result = Extract.Primitives<WithOptional>;

      expectTypeOf<Result>().toEqualTypeOf<{ id: number; name?: string }>();
    });
  });
  //#endregion

  //#region> Required
  describe('Required<T>', () => {
    it('should extract only required properties', () => {
      interface User {
        id: number;
        name?: string;
      }
      type Result = Extract.Required<User>;

      expectTypeOf<Result>().toEqualTypeOf<{ id: number }>();
    });

    it('should return all properties when none are optional', () => {
      interface AllRequired {
        email: string;
        id: number;
        name: string;
      }
      type Result = Extract.Required<AllRequired>;

      expectTypeOf<Result>().toEqualTypeOf<{ email: string; id: number; name: string }>();
    });

    it('should return empty object when all are optional', () => {
      interface AllOptional {
        age?: number;
        name?: string;
      }
      type Result = Extract.Required<AllOptional>;

      expectTypeOf<Result>().toEqualTypeOf<{}>();
    });

    it('should handle mixed required and optional properties', () => {
      interface Mixed {
        active: boolean;
        age?: number;
        email?: string;
        id: number;
        name: string;
      }
      type Result = Extract.Required<Mixed>;

      expectTypeOf<Result>().toEqualTypeOf<{ active: boolean; id: number; name: string }>();
    });

    it('should handle empty object', () => {
      type Result = Extract.Required<{}>;

      expectTypeOf<Result>().toEqualTypeOf<{}>();
    });

    it('should preserve property types', () => {
      interface Complex {
        id: number;
        metadata?: Record<string, unknown>;
        profile: { age: number; name: string };
        tags: string[];
      }
      type Result = Extract.Required<Complex>;

      expectTypeOf<Result>().toEqualTypeOf<{
        id: number;
        profile: { age: number; name: string };
        tags: string[];
      }>();
    });

    it('should include undefined union as required', () => {
      interface WithUndefined {
        email?: string; // Actually optional
        id: number;
        name: string | undefined; // Required but can be undefined
      }
      type Result = Extract.Required<WithUndefined>;

      expectTypeOf<Result>().toEqualTypeOf<{ id: number; name: string | undefined }>();
    });

    it('should be shallow (not recursive)', () => {
      interface Nested {
        data: { optional?: number; required: string };
        id: number;
        optional?: string;
      }
      type Result = Extract.Required<Nested>;

      // Only extracts top-level required properties
      expectTypeOf<Result>().toEqualTypeOf<{
        data: { optional?: number; required: string };
        id: number;
      }>();
    });

    it('should handle nullable required properties', () => {
      interface WithNullable {
        age?: number;
        id: number;
        name: null | string;
      }
      type Result = Extract.Required<WithNullable>;

      expectTypeOf<Result>().toEqualTypeOf<{ id: number; name: null | string }>();
    });
  });
  //#endregion

  //#region> Integration tests
  describe('Integration', () => {
    it('should work together - extract primitives from required properties', () => {
      interface User {
        address: { street: string };
        email?: string;
        id: number;
        name: string;
      }
      type RequiredProps = Extract.Required<User>;
      type Result = Extract.Primitives<RequiredProps>;

      expectTypeOf<Result>().toEqualTypeOf<{ id: number; name: string }>();
    });

    it('should work together - non-primitives from required', () => {
      interface Complex {
        data: { value: string };
        id: number;
        optional?: { nested: number };
        tags: string[];
      }
      type RequiredProps = Extract.Required<Complex>;
      type Result = Extract.NonPrimitives<RequiredProps>;

      expectTypeOf<Result>().toEqualTypeOf<{ data: { value: string }; tags: string[] }>();
    });
  });
  //#endregion
});
