import type { ConfigWithExtends } from '@eslint/config-helpers';
export const unicorn: ConfigWithExtends['rules'] = {
  /** Can be overly restrictive */
  'unicorn/consistent-function-scoping': 'off',
  /** Causes problems when joining string arrays that are declared not empty */
  'unicorn/error-message': 'off',

  'unicorn/filename-case': [
    'error',
    {
      cases: {
        /** kebab-case for most files and directories */
        kebabCase: true,
        /**
         * PascalCase for component/class files, and directories containing
         * a single component/class
         *
         * @example
         * ```
         * MyComponent/
         *   index.ts
         *   MyComponent.tsx
         *   MyComponent.test.tsx
         *
         * ```
         *
         */
        pascalCase: true
      }
    }
  ],
  /** Using function references is concise and avoids unnecessary arrow wrappers. */
  'unicorn/no-array-callback-reference': 'off',

  /**
   * Flags error on my Obj.filter method
   * @example
   * ```ts
   * it('filters properties based on predicate', () => {
   * const obj = { a: 1, b: 'string', c: 2, d: true };
   * const filtered = Obj.filter(
   *    obj,
   *    (v): v is number => typeof v === 'number' // flagged as error
   * );
   * ```
   */
  'unicorn/no-array-method-this-argument': 'off',
  /** With TypeScript and explicit generics reduce does not hurt readability. */
  'unicorn/no-array-reduce': 'off',

  /** This often adds verbosity with negligible clarity gain. As long as promise-returning expressions are controlled, the inlining is fine. */
  'unicorn/no-await-expression-member': 'off',

  /**
   * Negation can sometimes be the most readable option
   * @example
   * ```ts
   * const recurse = (condition: boolean): void => {
   *   if (!condition) return;
   *    ...
   *    complex nested logic
   *    ...
   *   recurse(condition);
   * }
   * ```
   */
  'unicorn/no-negated-condition': 'off',

  /** null has valid use-cases and is semantically meaningful in TypeScript. */
  'unicorn/no-null': 'off',

  /** Sometimes thenable reduces verbosity and improves clarity. */
  'unicorn/no-thenable': 'off',
  /** typeof can be safer in some interop/edge cases, especially when dealing with dynamic/arbitrary data.  */
  'unicorn/no-typeof-undefined': 'off',

  /** Spreads can be required when casting readonly/tuple types to their generic counterpart. */
  'unicorn/no-useless-spread': 'off',
  /** In strict typing contexts, explicit undefined can be required and also communicate intent clearly.  */
  'unicorn/no-useless-undefined': 'off',

  /** Abbreviations are often used and improve conciseness. */
  'unicorn/prevent-abbreviations': 'off',
  /** excluding braces can be cleaner */
  'unicorn/switch-case-braces': 'off'
} as const;
export const typescriptEslint: ConfigWithExtends['rules'] = {
  /**
   * Using Record and indexed object types
   * interchangeably does not personally impact readability.
   * @example
   * ```ts
   * Record<string,string>
   * { [string:string]: string }
   * ```
   */
  '@typescript-eslint/consistent-indexed-object-style': 'off',
  '@typescript-eslint/consistent-type-exports': [
    'error',
    { fixMixedExportsWithInlineTypeSpecifier: true }
  ],
  '@typescript-eslint/consistent-type-imports': [
    'error',
    { fixStyle: 'inline-type-imports', prefer: 'type-imports' }
  ],
  /**
   * Align TSEslint's expectations with TypeScript's
   * strictFunctionTypes
   */
  '@typescript-eslint/method-signature-style': ['error', 'property'],
  /**
   * Shorthand syntax just feels and looks better to me and
   * TypeScript does a good job of resolving the ambiguity around this rule.
   *
   * ```ts
   * ():void => fn()
   * ```
   */
  '@typescript-eslint/no-confusing-void-expression': 'off',
  '@typescript-eslint/no-explicit-any': [
    'error',
    { fixToUnknown: true, ignoreRestArgs: true }
  ],
  /**
   * Ensures tsCompiler --verbatimModuleSyntax
   * can effectively transpile import declarations
   * and easily remove all imports with a top-level
   * type qualifier and any import specifiers
   * with an inline type qualifier
   * @example
   * ```ts
   * Valid:
   *  import type { A } from 'mod';
   *  import type { A as AA } from 'mod';
   *  import type { A, B } from 'mod';
   *  import type { A as AA, B as BB } from 'mod';
   *  import T from 'mod';
   *  import type T from 'mod';
   *  import * as T from 'mod';
   *  import type * as T from 'mod';
   *  import { T } from 'mod';
   *  import type { T } from 'mod';
   *
   * Invalid:
   *  import { type T } from 'mod';
   *  import { type T as TT } from 'mod';
   *  import { type T, type X } from 'mod';
   *  import { type T as TT, type X as XX } from 'mod';
   * ```
   */
  '@typescript-eslint/no-import-type-side-effects': 'error',
  /**
   * Sometimes mixing void with other types is
   * the more straightforward option.
   */
  '@typescript-eslint/no-invalid-void-type': 'off',
  /**
   * I prefer the ability to improve clarity/documentation when dealing
   * with dynamic/unreliable data using TypeScript when possible.
   * @example
   * ```ts
   * interface Person{
   *   name: string | unknown; // should be string but could be unknown at runtime
   *   method: () => void;
   * };
   * ```
   */
  '@typescript-eslint/no-redundant-type-constituents': 'off',

  '@typescript-eslint/no-shadow': 'error',
  /**
   * This rule can be trouble in some niche cases.
   * @example Creating a JSON.stringify utility with fully type parameters
   * ```ts
   * export default function stringify<T>(value: T) {
   *   return JSON.stringify(value);
   * }
   * ```
   */
  '@typescript-eslint/no-unnecessary-type-parameters': 'off',
  /**
   * Prevents the use of spreading objects for omission.
   * @example
   * ```ts
   * const { unwanted, ...rest } = obj;
   * return rest; // Error: no-unused-vars
   * ```
   */
  '@typescript-eslint/no-unused-vars': 'off',
  /** Simplifies debugging and general logging. */
  '@typescript-eslint/restrict-template-expressions': [
    'error',
    { allowBoolean: true, allowNever: true, allowNumber: true }
  ],

  /**
   * Disable ESLint's no-shadow to enable
   * TSESlint's extended version `@typescript-eslint/no-shadow`
   */
  'no-shadow': 'off'
} as const;
export const docs: ConfigWithExtends['rules'] = {
  /** tsdoc syntax errors are not significant and/or mature enough to require immediate attention */
  'jsdoc/lines-before-block': 'off',
  'jsdoc/require-hyphen-before-param-description': 'off',
  'jsdoc/tag-lines': 'off',
  'tsdoc/syntax': 'warn'
} as const;
export const imports: ConfigWithExtends['rules'] = {
  'import/no-duplicates': 'error',
  /**
   * ESLint's no-duplicate-imports is less reliable
   * then eslint-plugin-import's import/
   * no-duplicates.
   */
  'no-duplicate-imports': 'off'
} as const;

const REGION_PARTITION = {
  partitionByComment: {
    line: [{ pattern: '^#region' }, { pattern: '^#endregion' }]
  }
} as const;
export const perfectionist: ConfigWithExtends['rules'] = {
  'perfectionist/sort-imports': ['error', { ...REGION_PARTITION }],
  'perfectionist/sort-interfaces': ['error', { ...REGION_PARTITION }],
  'perfectionist/sort-modules': ['error', { ...REGION_PARTITION }],
  'perfectionist/sort-classes': ['error', { ...REGION_PARTITION }],
  'perfectionist/sort-objects': 'off',
  'perfectionist/sort-switch-case': 'off'
} as const;
