import type { DocumentOptions, ParseOptions, SchemaOptions, ToJSOptions, stringify } from 'yaml';
import type {
  ReadFileSyncOptions,
  ReadFileOptions,
  WriteFileOptions as WFO,
  WriteFileSyncOptions as WFSO,
  PatchFileOptions as PFO
} from '../../helpers/index.js';

export type ParseYAMLFileArgs = [
  reviver?: ParseYAMLFileOptions | YAMLReviver,
  options?: ParseYAMLFileOptions
];
export type ParseYAMLFileOptions = DocumentOptions & ParseOptions & SchemaOptions & ToJSOptions;
export type YAMLReviver = (key: unknown, value: unknown) => unknown;
export type YAMLScalar = boolean | null | number | string;
export type YAMLValue = { [key: string]: YAMLValue } | YAMLScalar | YAMLValue[];
export type StringifyOptions = {
  replacer?: (string | number)[] | ((key: string, value: unknown) => unknown) | null | undefined;
} & Exclude<Parameters<typeof stringify>[2], string | number>;

export interface ParseFileSyncOptions extends Omit<ReadFileSyncOptions, 'fileType'> {
  parserArgs?: ParseYAMLFileArgs;
}
export interface ParseFileOptions extends Omit<ReadFileOptions, 'fileType'> {
  parserArgs?: ParseYAMLFileArgs;
}

export type WriteFileOptions<D = unknown> = Omit<WFO<D>, 'stringify' | 'fileType'> & {
  stringify?: StringifyOptions;
};
export type WriteFileSyncOptions<D = unknown> = Omit<WFSO<D>, 'stringify' | 'fileType'> & {
  stringify?: StringifyOptions;
};
export type PatchFileOptions<D> = Omit<PFO<D>, 'stringify' | 'parser' | 'reader' | 'fileType'> & {
  stringify?: StringifyOptions;
};
