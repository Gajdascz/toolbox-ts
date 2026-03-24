import type { EslintPlugins, Oxc } from '@toolbox-ts/types/defs/configs';
import type { Simplify, StringRecord } from '@toolbox-ts/types/defs/object';
import type { Nullish } from '@toolbox-ts/types';

/**
 * (false | 'omit' | null) - The plugin is excluded.
 * (true  | undefined | 'default') - The plugin is included with default settings.
 */
export type DefaultPluginStatus = boolean | 'omit' | 'default' | null | undefined;

export type PluginConfig<
  P extends string = Oxc.Lint.BuiltInPlugins,
  S = StringRecord,
  O extends StringRecord = StringRecord
> = Simplify<({ settings?: S; rules?: Oxc.Lint.PluginRules<P> } & O) | DefaultPluginStatus>;

export type JsPluginConfig<P extends string = string> = {
  name: P;
  specifier: string;
  settings?: StringRecord;
  rules?: Oxc.Lint.PluginRules<P>;
};
export type EslintPluginConfig = PluginConfig<'eslint', Oxc.Lint.Settings['eslint']>;
export type JsDocPluginConfig = PluginConfig<'jsdoc', Oxc.Lint.Settings['jsdoc']>;
export type UnicornPluginConfig = PluginConfig<'unicorn', Oxc.Lint.Settings['unicorn']>;
export type ReactPluginConfig = PluginConfig<'react', Oxc.Lint.Settings['react']>;
export type TypescriptPluginConfig = PluginConfig<'typescript', Oxc.Lint.Settings['typescript']>;
export type OxcPluginConfig = PluginConfig<'oxc', Oxc.Lint.Settings['oxc']>;
export type ImportPluginConfig = PluginConfig<'import', Oxc.Lint.Settings['import']>;
export type JestPluginConfig = PluginConfig<'jest', Oxc.Lint.Settings['jest']>;
export type VitestPluginConfig = PluginConfig<'vitest', Oxc.Lint.Settings['vitest']>;
export type JsxA11yPluginConfig = PluginConfig<'jsx-a11y', Oxc.Lint.Settings['jsx-a11y']>;
export type NextJsPluginConfig = PluginConfig<'nextjs', Oxc.Lint.Settings['nextjs']>;
export type ReactPerfPluginConfig = PluginConfig<'react-perf', Oxc.Lint.Settings['react-perf']>;
export type PromisePluginConfig = PluginConfig<'promise', Oxc.Lint.Settings['promise']>;
export type NodePluginConfig = PluginConfig<'node', Oxc.Lint.Settings['node']>;
export type VuePluginConfig = PluginConfig<'vue', Oxc.Lint.Settings['vue']>;
export interface PluginConfigs {
  jsdoc?: JsDocPluginConfig;
  unicorn?: UnicornPluginConfig;
  eslint?: EslintPluginConfig;
  react?: ReactPluginConfig;
  typescript?: TypescriptPluginConfig;
  oxc?: OxcPluginConfig;
  import?: ImportPluginConfig;
  jest?: JestPluginConfig;
  vitest?: VitestPluginConfig;
  'jsx-a11y'?: JsxA11yPluginConfig;
  nextjs?: NextJsPluginConfig;
  'react-perf'?: ReactPerfPluginConfig;
  promise?: PromisePluginConfig;
  node?: NodePluginConfig;
  vue?: VuePluginConfig;
}

export type InputConfig<P extends string = string> = Omit<
  Oxc.Lint.Config,
  '$schema' | 'plugins' | 'rules' | 'settings' | 'jsPlugins' | 'overrides'
> & {
  plugins?: PluginConfigs | 'default';
  jsPlugins?: JsPluginConfig<P>[];
  overrides?: {
    plugins?: PluginConfigs;
    jsPlugins?: JsPluginConfig<P>[];
    files: string[] | readonly string[];
    env?: Oxc.Lint.Env;
    globals?: Oxc.Lint.Globals;
  }[];
};

export type BasePlugins = {
  [K in keyof PluginConfigs]: Exclude<PluginConfigs[K], string | true | Nullish>;
};
export type BaseConfig = InputConfig & {
  $schema: string;
  plugins: BasePlugins;
  categories: {};
  env: { builtin: boolean };
  globals: {};
  ignorePatterns: string[] | readonly string[];
  overrides: NonNullable<InputConfig<string>['overrides']>;
};
export type CustomJsDocStructuredTags = EslintPlugins.JsDoc.StructuredTags;

export type ProcessedConfig = Oxc.Lint.Config;
