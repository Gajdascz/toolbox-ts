import { Arr, Obj } from '@toolbox-ts/utils';
import type { Oxc } from '@toolbox-ts/types/defs/configs';
import { wrapWhen } from '@toolbox-ts/utils/core';
import type {
  BasePlugins,
  CustomJsDocStructuredTags,
  PluginConfigs,
  ProcessedConfig,
  BaseConfig,
  InputConfig
} from './types.js';
import { GLOBS, FILES } from '@toolbox-ts/constants/fs';
import { runtimeConfigToFileContent, serializeJson } from '../../../helpers.js';

const CUSTOM_JSDOC_STRUCTURED_TAGS: CustomJsDocStructuredTags = {
  //#region> Declarative
  shallow: {
    name: false,
    description: 'Indicates that the function only operates on the top-level properties of data.'
  },
  deep: {
    name: false,
    description: 'Indicates that the function operates on all nested properties of data.'
  },
  pure: {
    name: false,
    description:
      'Indicates that the function has no side effects and does not modify any external state.'
  },
  experimental: {
    name: false,
    description:
      'Indicates that the code is experimental and may change or be removed in future versions.'
  },
  //#endregion
  //#region> Informational
  important: { description: 'Information that should be highlighted as important.' },
  tip: { description: 'Provides a helpful tip or suggestion related to the function code.' },
  narrows: {
    description:
      'Indicates that the function narrows the type of its input. Should show what type the input is narrowed to.'
  },
  asserts: {
    description:
      'Indicates that the function is an assertion function, which throws an error if a condition is not met and narrows the input type. Should show what type the input is narrowed to.'
  },
  checks: {
    description:
      'Indicates that the function is a check function, which verifies a condition without narrowing the input type or throwing an error.'
  },
  remarks: { description: 'Provides additional remarks or comments about the code.' }
  //#endregion
} as const;

export const PLUGINS: BasePlugins = {
  eslint: {
    settings: {},
    rules: {
      'eslint/constructor-super': 'warn',
      'eslint/for-direction': 'warn',
      'eslint/no-async-promise-executor': 'warn',
      'eslint/no-caller': 'warn',
      'eslint/no-class-assign': 'warn',
      'eslint/no-compare-neg-zero': 'warn',
      'eslint/no-cond-assign': 'warn',
      'eslint/no-const-assign': 'warn',
      'eslint/no-constant-binary-expression': 'warn',
      'eslint/no-constant-condition': 'warn',
      'eslint/no-control-regex': 'warn',
      'eslint/no-debugger': 'warn',
      'eslint/no-delete-var': 'warn',
      'eslint/no-dupe-class-members': 'warn',
      'eslint/no-dupe-else-if': 'warn',
      'eslint/no-dupe-keys': 'warn',
      'eslint/no-duplicate-case': 'warn',
      'eslint/no-empty-character-class': 'warn',
      'eslint/no-empty-pattern': 'warn',
      'eslint/no-empty-static-block': 'warn',
      'eslint/no-eval': 'warn',
      'eslint/no-ex-assign': 'warn',
      'eslint/no-extra-boolean-cast': 'warn',
      'eslint/no-func-assign': 'warn',
      'eslint/no-global-assign': 'warn',
      'eslint/no-import-assign': 'warn',
      'eslint/no-invalid-regexp': 'warn',
      'eslint/no-irregular-whitespace': 'warn',
      'eslint/no-loss-of-precision': 'warn',
      'eslint/no-new-native-nonconstructor': 'warn',
      'eslint/no-nonoctal-decimal-escape': 'warn',
      'eslint/no-obj-calls': 'warn',
      'eslint/no-self-assign': 'warn',
      'eslint/no-setter-return': 'warn',
      'eslint/no-shadow-restricted-names': 'warn',
      'eslint/no-sparse-arrays': 'warn',
      'eslint/no-this-before-super': 'warn',
      'eslint/no-unassigned-vars': 'warn',
      'eslint/no-unsafe-finally': 'warn',
      'eslint/no-unsafe-negation': 'warn',
      'eslint/no-unsafe-optional-chaining': 'warn',
      'eslint/no-unused-expressions': 'warn',
      'eslint/no-unused-labels': 'warn',
      'eslint/no-unused-private-class-members': 'warn',
      'eslint/no-unused-vars': 'warn',
      'eslint/no-useless-backreference': 'warn',
      'eslint/no-useless-catch': 'warn',
      'eslint/no-useless-escape': 'warn',
      'eslint/no-useless-rename': 'warn',
      'eslint/no-with': 'warn',
      'eslint/require-yield': 'warn',
      'eslint/use-isnan': 'warn',
      'eslint/valid-typeof': 'warn'
    }
  },
  jsdoc: {
    settings: {
      ignorePrivate: false,
      ignoreInternal: false,
      ignoreReplacesDocs: true,
      overrideReplacesDocs: true,
      augmentsExtendsReplacesDocs: false,
      implementsReplacesDocs: false,
      exemptDestructuredRootsFromChecks: false,
      tagNamePreference: {},
      structuredTags: { ...CUSTOM_JSDOC_STRUCTURED_TAGS }
    },
    rules: {
      'jsdoc/check-tag-names': ['error', { definedTags: Object.keys(CUSTOM_JSDOC_STRUCTURED_TAGS) }]
    }
  },
  unicorn: {
    settings: {
      'filename-case': [
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
             *   index.js
             *   MyComponent.jsx
             *   MyComponent.test.jsx
             *
             * ```
             *
             */
            pascalCase: true
          }
        }
      ]
    },
    rules: {
      'unicorn/no-await-in-promise-methods': 'warn',
      'unicorn/no-empty-file': 'warn',
      'unicorn/no-invalid-fetch-options': 'warn',
      'unicorn/no-invalid-remove-event-listener': 'warn',
      'unicorn/no-new-array': 'warn',
      'unicorn/no-single-promise-in-promise-methods': 'warn',
      'unicorn/no-thenable': 'warn',
      'unicorn/no-unnecessary-await': 'warn',
      'unicorn/no-useless-fallback-in-spread': 'warn',
      'unicorn/no-useless-length-check': 'warn',
      'unicorn/no-useless-spread': 'warn',
      'unicorn/prefer-set-size': 'warn',
      'unicorn/prefer-string-starts-ends-with': 'warn'
    }
  },
  typescript: {
    settings: {},
    rules: {
      'typescript/await-thenable': 'warn',
      'typescript/no-array-delete': 'warn',
      'typescript/no-base-to-string': 'warn',
      'typescript/no-duplicate-enum-values': 'warn',
      'typescript/no-duplicate-type-constituents': 'warn',
      'typescript/no-extra-non-null-assertion': 'warn',
      'typescript/no-floating-promises': 'warn',
      'typescript/no-for-in-array': 'warn',
      'typescript/no-implied-eval': 'warn',
      'typescript/no-meaningless-void-operator': 'warn',
      'typescript/no-misused-new': 'warn',
      'typescript/no-misused-spread': 'warn',
      'typescript/no-non-null-asserted-optional-chain': 'warn',
      'typescript/no-redundant-type-constituents': 'warn',
      'typescript/no-this-alias': 'warn',
      'typescript/no-unnecessary-parameter-property-assignment': 'warn',
      'typescript/no-unsafe-declaration-merging': 'warn',
      'typescript/no-unsafe-unary-minus': 'warn',
      'typescript/no-useless-empty-export': 'warn',
      'typescript/no-wrapper-object-types': 'warn',
      'typescript/prefer-as-const': 'warn',
      'typescript/require-array-sort-compare': 'warn',
      'typescript/restrict-template-expressions': 'warn',
      'typescript/triple-slash-reference': 'warn',
      'typescript/unbound-method': 'warn'
    }
  },
  oxc: {
    settings: {},
    rules: {
      'oxc/bad-array-method-on-arguments': 'warn',
      'oxc/bad-char-at-comparison': 'warn',
      'oxc/bad-comparison-sequence': 'warn',
      'oxc/bad-min-max-func': 'warn',
      'oxc/bad-object-literal-comparison': 'warn',
      'oxc/bad-replace-all-arg': 'warn',
      'oxc/const-comparisons': 'warn',
      'oxc/double-comparisons': 'warn',
      'oxc/erasing-op': 'warn',
      'oxc/missing-throw': 'warn',
      'oxc/number-arg-out-of-range': 'warn',
      'oxc/only-used-in-recursion': 'warn',
      'oxc/uninvoked-array-callback': 'warn'
    }
  },
  'react-perf': false,
  'jsx-a11y': false,
  nextjs: false,
  import: false,
  jest: false,
  node: false,
  promise: false,
  react: false,
  vitest: { rules: { 'vitest/no-focused-tests': 'off' } },
  vue: false
};

export const OVERRIDES = [
  {
    files: GLOBS.ALL.TESTS,
    rules: { 'typescript/unbound-method': 'off', 'vitest/no-focused-tests': 'off' }
  }
] as const;

export const DEFAULTS: BaseConfig = {
  $schema: './node_modules/oxlint/configuration_schema.json',
  plugins: { ...PLUGINS },
  categories: {},
  env: { builtin: true },
  globals: {},
  ignorePatterns: [],
  overrides: [...OVERRIDES]
} as const;

const resolvePlugins = (plugins: InputConfig['plugins']) => {
  const selected = plugins === 'default' || plugins === undefined ? DEFAULTS.plugins : plugins;
  return Obj.reduce<
    PluginConfigs,
    { plugins: Oxc.Lint.BuiltInPlugins[]; settings: Oxc.Lint.Settings; rules: Oxc.Lint.Rules }
  >(
    selected,
    (acc, cfg, id) => {
      if (cfg !== false) {
        const def = DEFAULTS.plugins[id];
        if (!def) return acc;
        acc.plugins.push(id);
        acc.rules = { ...acc.rules, ...def.rules };
        acc.settings = { ...acc.settings, ...def.settings };
      }
      return acc;
    },
    { plugins: [], settings: {}, rules: {} }
  );
};

export const define = ({
  plugins,
  extends: exts,
  jsPlugins,
  globals = {},
  categories = {},
  env = {},
  ignorePatterns = [],
  overrides = []
}: InputConfig = {}): ProcessedConfig => ({
  $schema: DEFAULTS.$schema,
  categories: { ...DEFAULTS.categories, ...categories },
  env: { ...DEFAULTS.env, ...env },
  globals: { ...DEFAULTS.globals, ...globals },
  ignorePatterns: Arr.mergeUnique(DEFAULTS.ignorePatterns, ignorePatterns),
  overrides: Arr.mergeUnique(DEFAULTS.overrides, overrides).map((override) => ({
    ...override,
    plugins: resolvePlugins(override.plugins).plugins
  })),
  ...resolvePlugins(plugins),
  ...wrapWhen('extends', exts),
  ...wrapWhen('jsPlugins', jsPlugins)
});

export const toFileContent = (config?: InputConfig) =>
  runtimeConfigToFileContent('oxlint', [serializeJson(config)]);

export const toFileEntry = (config?: InputConfig) => ({
  [FILES.CONFIG.OXLINT]: toFileContent(config)
});
