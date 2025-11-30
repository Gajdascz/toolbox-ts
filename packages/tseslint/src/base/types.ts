import type { ConfigWithExtends } from '@eslint/config-helpers';
import type {
  parser,
  ConfigWithExtends as TSESLintConfig
} from 'typescript-eslint';

/** Represents the base configuration for TypeScript ESLint. */
export type BaseCfg<N extends string> = {
  extends?: ConfigWithExtends['extends'];
  files: string[];
  ignores: string[];
  importResolverNodeExtensions: readonly string[];
  name: N;
  rules: ConfigWithExtends['rules'] | undefined;
} & Partial<Omit<ConfigWithExtends, 'plugins'>>;

/** Input type for creating a configuration. */
export type CfgInput<N extends string> = {
  tsconfigFilenameOverride?: TsconfigFilename<string>;
} & Partial<Omit<BaseCfg<N>, 'name'>>;

/** Represents a processed configuration with additional properties. */
export interface ProcessedCfg<N extends string> extends ConfigWithExtends {
  languageOptions: {
    parser: { parse: () => void; parseForESLint: () => void } | typeof parser;
    parserOptions: {
      projectService:
        | boolean
        | NonNullable<
            NonNullable<TSESLintConfig['languageOptions']>['parserOptions']
          >['projectService'];
      tsconfigRootDir: string;
    };
    sourceType: 'module';
  } & ConfigWithExtends['languageOptions'];
  name: N;
  settings: {
    'import/resolver': {
      node: { extensions: readonly string[] };
      typescript: { project: TsconfigFilePath<string> };
    };
  } & ConfigWithExtends['settings'];
}

/** Represents a TypeScript configuration filename. */
export type TsconfigFilename<N extends string> =
  | 'tsconfig.json'
  | `tsconfig.${N}.json`;

/** Represents a TypeScript configuration file path. */
export type TsconfigFilePath<N extends string> =
  `${string}/${TsconfigFilename<N>}`;
