import { describe, expectTypeOf, it } from 'vitest';

import type {
  CompilerOptions,
  ConfigWithMetaInput,
  Input
} from './tsconfig.js';

describe('TsConfig Types', () => {
  describe('Input', () => {
    it('allows compiler options not in static compiler options', () => {
      interface StaticFields {
        exclude: string[];
      }
      interface StaticCompilerOptions {
        strict: true;
      }
      type TestInput = Input<StaticFields, StaticCompilerOptions>;
      expectTypeOf<TestInput['compilerOptions']>().toEqualTypeOf<
        Omit<CompilerOptions, 'strict'> | undefined
      >();
    });

    it('omits static compiler options from compiler options', () => {
      type TestInput = Input<
        { exclude: string[] },
        { noImplicitAny: false; strict: true }
      >;

      expectTypeOf<TestInput['compilerOptions']>().toEqualTypeOf<
        Omit<CompilerOptions, 'noImplicitAny' | 'strict'> | undefined
      >();
    });

    it('omits static fields from top level', () => {
      type TestInput = Input<{ exclude: string[]; extends: string }, {}>;
      expectTypeOf<TestInput>().not.toHaveProperty('exclude');
      expectTypeOf<TestInput>().not.toHaveProperty('extends');
    });

    it('allows all other Config fields', () => {
      type TestInput = Input<{}, {}>;
      expectTypeOf<TestInput>().toHaveProperty('include');
      expectTypeOf<TestInput>().toHaveProperty('exclude');
      expectTypeOf<TestInput>().toHaveProperty('extends');
    });
  });

  describe('ConfigWithMetaInput', () => {
    it('combines Input behavior with ConfigWithMeta', () => {
      interface StaticFields {
        exclude: string[];
        name: 'test-config';
      }
      interface StaticCompilerOptions {
        strict: true;
      }
      type TestInput = ConfigWithMetaInput<
        'test-config',
        StaticFields,
        StaticCompilerOptions
      >;

      expectTypeOf<TestInput>().not.toHaveProperty('exclude');
      expectTypeOf<TestInput>().not.toHaveProperty('name');
      expectTypeOf<TestInput['compilerOptions']>().toEqualTypeOf<
        Omit<CompilerOptions, 'strict'> | undefined
      >();
    });

    it('omits static compiler options from compiler options', () => {
      interface StaticFields {
        name: 'test-config';
      }
      interface StaticCompilerOptions {
        noImplicitAny: false;
        strict: true;
      }
      type TestInput = ConfigWithMetaInput<
        'test-config',
        StaticFields,
        StaticCompilerOptions
      >;

      expectTypeOf<TestInput['compilerOptions']>().toEqualTypeOf<
        Omit<CompilerOptions, 'noImplicitAny' | 'strict'> | undefined
      >();
    });

    it('omits static fields including metadata fields', () => {
      interface StaticFields {
        description: string;
        name: 'test-config';
      }
      type TestInput = ConfigWithMetaInput<'test-config', StaticFields, {}>;

      expectTypeOf<TestInput>().not.toHaveProperty('description');
      expectTypeOf<TestInput>().not.toHaveProperty('name');
    });

    it('allows all other ConfigWithMeta fields', () => {
      interface StaticFields {
        name: 'test-config';
      }
      type TestInput = ConfigWithMetaInput<'test-config', StaticFields, {}>;

      expectTypeOf<TestInput>().toHaveProperty('$schema');
      expectTypeOf<TestInput>().toHaveProperty('description');
      expectTypeOf<TestInput>().toHaveProperty('include');
      expectTypeOf<TestInput>().not.toHaveProperty('name');
    });
  });
});
