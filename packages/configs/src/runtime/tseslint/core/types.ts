import type { ConfigWithExtends } from '@eslint/config-helpers';
import type {
  parser,
  ConfigWithExtends as TSEslintConfigWithExtends
} from 'typescript-eslint';

export interface BaseConfig<N extends string> {
  files: readonly string[] | string[];
  ignores?: readonly string[] | string[];
  importResolverNodeExtensions: readonly string[] | string[];
  name: N;
  rules?: ConfigWithExtends['rules'];
  tsconfigFilename: string;
}

export interface ProcessedCfg<N extends string> extends ConfigWithExtends {
  languageOptions: {
    parser: { parse: () => void; parseForESLint: () => void } | typeof parser;
    parserOptions: {
      projectService:
        | boolean
        | NonNullable<
            NonNullable<
              TSEslintConfigWithExtends['languageOptions']
            >['parserOptions']
          >['projectService'];
      tsconfigRootDir: string;
    };
    sourceType: 'module';
  } & ConfigWithExtends['languageOptions'];
  name: N;
  settings: {
    'import/resolver': {
      node: { extensions: string[] } & Record<string, unknown>;
      typescript: { project: string } & Record<string, unknown>;
    } & Record<string, unknown>;
  } & ConfigWithExtends['settings'];
}
