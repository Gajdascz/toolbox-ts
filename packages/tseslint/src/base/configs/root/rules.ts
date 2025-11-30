import type { ConfigWithExtends, RuleConfig } from '@eslint/config-helpers';

/* c8 ignore start */
const mkRules = (
  p: string,
  defs: [rule: string, val: 'error' | 'off' | 'warn' | 0 | 1 | 2 | RuleConfig][]
) => Object.fromEntries(defs.map(([r, v]) => [`${p}/${r}`, v]));

export const unicorn: ConfigWithExtends['rules'] = mkRules('unicorn', [
  /** Can be overly restrictive */
  ['consistent-function-scoping', 'off'],
  /** Causes problems when joining string arrays that are declared not empty */
  ['error-message', 'off'],
  [
    'filename-case',
    [
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
    ]
  ],
  [
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
    'no-array-method-this-argument',
    'off'
  ],
  /** With TypeScript and explicit generics reduce does not hurt readability. */
  ['no-array-reduce', 'off'],
  /** This often adds verbosity with negligible clarity gain. As long as promise-returning expressions are controlled, the inlining is fine. */
  ['no-await-expression-member', 'off'],
  [
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
    'no-negated-condition',
    'off'
  ],
  /** null has valid use-cases and is semantically meaningful in TypeScript. */
  ['no-null', 'off'],
  /** Sometimes thenable reduces verbosity and improves clarity. */
  ['no-thenable', 'off'],
  /** typeof can be safer in some interop/edge cases, especially when dealing with dynamic/arbitrary data.  */
  ['no-typeof-undefined', 'off'],
  /** Spreads can be required when casting readonly/tuple types to their generic counterpart. */
  ['no-useless-spread', 'off'],
  /** In strict typing contexts, explicit undefined can be required and also communicate intent clearly.  */
  ['no-useless-undefined', 'off'],
  /** Abbreviations are often used and improve conciseness. */
  ['prevent-abbreviations', 'off'],
  /** excluding braces can be cleaner */
  ['switch-case-braces', 'off'],
  /**
   * Causes errors when methods on data-structures other than
   * array mirror signatures.
   */
  ['no-array-callback-reference', 'off']
]);

export const typescriptEslint: ConfigWithExtends['rules'] = mkRules(
  '@typescript-eslint',
  [
    /**
     * Using Record and indexed object types
     * interchangeably does not personally impact readability.
     * @example
     * ```ts
     * Record<string,string>
     * { [string:string]: string }
     * ```
     */
    ['consistent-indexed-object-style', 'off'],
    [
      'consistent-type-exports',
      ['error', { fixMixedExportsWithInlineTypeSpecifier: true }]
    ],
    [
      'consistent-type-imports',
      ['error', { fixStyle: 'inline-type-imports', prefer: 'type-imports' }]
    ],
    /**
     * Align TSEslint's expectations with TypeScript's
     * strictFunctionTypes
     */
    ['method-signature-style', ['error', 'property']],
    /**
     * Shorthand syntax just feels and looks better to me and
     * TypeScript does a good job of resolving the ambiguity around this rule.
     *
     * ```ts
     * ():void => fn()
     * ```
     */
    ['no-confusing-void-expression', 'off'],
    [
      'no-explicit-any',
      ['error', { fixToUnknown: true, ignoreRestArgs: true }]
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
    ['no-import-type-side-effects', 'error'],
    /**
     * Sometimes mixing void with other types is
     * the more straightforward option.
     */
    ['no-invalid-void-type', 'off'],
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
    ['no-redundant-type-constituents', 'off'],
    ['no-shadow', 'error'],
    /**
     * This rule can be trouble in some niche cases.
     * @example Creating a JSON.stringify utility with fully type parameters
     * ```ts
     * export default function stringify<T>(value: T) {
     *   return JSON.stringify(value);
     * }
     * ```
     */
    ['no-unnecessary-type-parameters', 'off'],
    /**
     * Prevents the use of spreading objects for omission.
     * @example
     * ```ts
     * const { unwanted, ...rest } = obj;
     * return rest; // Error: no-unused-vars
     * ```
     */
    ['no-unused-vars', 'off'],
    /** Simplifies debugging and general logging. */
    [
      'restrict-template-expressions',
      ['error', { allowBoolean: true, allowNever: true, allowNumber: true }]
    ],
    ['no-non-null-assertion', 'off']
  ]
);

export const eslint: ConfigWithExtends['rules'] = {
  /**
   * Disable ESLint's no-shadow to enable
   * TSESlint's extended version `@typescript-eslint/no-shadow`
   */
  'no-shadow': 'off',
  /**
   * ESLint's no-duplicate-imports is less reliable
   * then eslint-plugin-import's import/no-duplicates.
   */
  'no-duplicate-imports': 'off'
} as const;

export const jsdoc: ConfigWithExtends['rules'] = mkRules('jsdoc', [
  /** tsdoc syntax errors are not significant and/or mature enough to require immediate attention */
  ['lines-before-block', 'off'],
  ['require-hyphen-before-param-description', 'off'],
  ['tag-lines', 'off']
]);

export const tsdoc: ConfigWithExtends['rules'] = mkRules('tsdoc', [
  ['syntax', 'warn']
]);

export const imports: ConfigWithExtends['rules'] = mkRules('import', [
  ['no-duplicates', 'error']
]);

const REGION_PARTITION = {
  partitionByComment: {
    line: [{ pattern: '^#region' }, { pattern: '^#endregion' }]
  }
} as const;

export const perfectionist: ConfigWithExtends['rules'] = mkRules(
  'perfectionist',
  [
    ['sort-imports', ['error', { ...REGION_PARTITION }]],
    ['sort-interfaces', ['error', { ...REGION_PARTITION }]],
    ['sort-modules', ['error', { ...REGION_PARTITION }]],
    ['sort-classes', ['error', { ...REGION_PARTITION }]],
    ['sort-objects', 'off'],
    ['sort-switch-case', 'off']
  ]
);

export const vitest: ConfigWithExtends['rules'] = mkRules('vitest', [
  /** Throws errors when input is a valid string. */
  ['valid-title', 'off']
]);
/* c8 ignore end */
