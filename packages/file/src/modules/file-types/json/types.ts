import { type CommentPrefix, type parse } from 'comment-json';

import {
  type PatchFileOptions as PFOptions,
  type PatchFileSyncOptions as PFSyncOptions,
  type WriteFileOptions as WFOptions,
  type WriteFileSyncOptions as WFSyncOptions,
  type ReadFileSyncOptions as RFSyncOptions,
  type ReadFileOptions as RFOptions
} from '../../helpers/index.js';

//#region> Parse
export type ParseJSONFileArgs = [
  /**
   * A function that transforms the results. This function is called for each member of the object.
   */
  reviver?: Parameters<typeof parse>[1],
  /**
   * If true, the comments won't be maintained, which is often used when we want to get
   * a clean object. If a member contains nested objects, the nested objects are
   * transformed before the parent object is.
   *
   */
  removeComments?: Parameters<typeof parse>[2]
];
export interface ParseFileOptions extends Omit<RFOptions, 'parser' | 'fileType'> {
  parserArgs?: ParseJSONFileArgs;
}
export interface ParseFileSyncOptions extends Omit<RFSyncOptions, 'parser' | 'fileType'> {
  parserArgs?: ParseJSONFileArgs;
}
export type ParseFn = <T = unknown>(text: string, ...args: ParseJSONFileArgs) => T;
//#endregion
//#region> Stringify
export interface StringifyOptions {
  replacer?: (string | number)[] | ((key: string, value: unknown) => unknown) | null | undefined;
  space?: string | number | undefined;
}
//#endregion
//#region> Write
export type WriteFileOptions<D = unknown> = Omit<WFOptions<D>, 'stringify' | 'fileType'> & {
  stringify?: StringifyOptions;
};
export type WriteFileSyncOptions<D = unknown> = Omit<WFSyncOptions<D>, 'stringify' | 'fileType'> & {
  stringify?: StringifyOptions;
};
//#endregion
//#region> Patch
export type PatchFileOptions<D> = Omit<
  PFOptions<D>,
  'stringify' | 'parser' | 'reader' | 'fileType'
> & { stringify?: StringifyOptions };
export type PatchFileSyncOptions<D> = Omit<
  PFSyncOptions<D>,
  'stringify' | 'parser' | 'reader' | 'fileType'
> & { stringify?: StringifyOptions };
//#endregion
//#region> Build
export type PropCommentPrefix = Exclude<CommentPrefix, 'afterAll' | 'beforeAll'>;
export type CommentType = 'LineComment' | 'BlockComment';

export type PropLineComment = { type: 'LineComment'; value: string; inline?: boolean };
export type PropBlockComment = {
  type: 'BlockComment';
  value: string | string[];
  inline?: false | never;
};
export type BuildPropValue = BuildProp | string | number | boolean | null;
export interface BuildProp {
  /** The JSON object property key */
  key: string;
  /** The value of the JSON object property */
  value: BuildPropValue | BuildPropValue[];
  /**
   * An optional comment associated with the JSON object property.
   * - Line comments are comments that start with `//` and are placed on a single line.
   *    - When not inline the comment is placed before the property.
   *    - When inline the comment is placed on the same line as the property after the value.
   * - Block comments are comments span multiple lines and are always placed before the property. Values are automatically formatted with indentation and leading asterisk.
   *
   */
  comment?: PropLineComment | PropBlockComment;
}
//#endregion
