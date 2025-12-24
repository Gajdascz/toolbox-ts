import type { MergeFileOptions } from '@toolbox-ts/file';

//#region> Strategies
export type ConflictStrategy = 'abort' | 'merge' | 'overwrite' | 'skip';
//#region> Args
export interface BaseConflictStrategyArgs<C = unknown> {
  fileData: ConflictFileData<C>;
  filePath: string;
}
export interface ConflictStrategyArgs<C = unknown> {
  abort: BaseConflictStrategyArgs<C>;
  merge: WriteStrategyArgs;
  overwrite: WriteStrategyArgs;
  skip: BaseConflictStrategyArgs<C>;
}
export interface WriteStrategyArgs extends BaseConflictStrategyArgs {
  confirmFn?: ConflictConfirmFn;
  incomingData: unknown;
}
//#endregion
//#endregion

export type ConflictConfirmFn = (
  filePath: string,
  oldData: unknown,
  newData: unknown
) => Promise<'abort' | 'skip' | true>;
export type ConflictFileData<C = unknown> =
  | {
      name: 'runtime';
      options: {
        serialize: {
          fn: (...args: any[]) => Promise<string> | string;
          name: string;
        };
      };
      type: 'default';
    }
  | { name: 'static'; options?: undefined; type: 'default' }
  | { name: string; options: CustomMergeHandlerOptions<C>; type: 'custom' };

export type CustomMergeHandlerOptions<I = unknown> = {
  /**
   * A function to read and parse the file content.
   *
   * @default fs.promises.readFile
   */
  fileParser?: { fn: (filePath: string) => I | Promise<I>; name: string };
  /**
   * A function to merge existing and incoming data.
   * defaults to:
   * - deep merge for objects @see {@link merge}
   * - concatenation for strings
   */
  mergeFn?: { fn: (existing: I, incoming: I) => I | Promise<I>; name: string };
  /**
   * A function to serialize the data before writing to the file.
   *  defaults to:
   *  - JSON.stringify if an object
   *  - as-is for strings
   */
  serialize?: { fn: (data: I) => Promise<string> | string; name: string };
} & Omit<
  MergeFileOptions<I>,
  | 'baseFilePath'
  | 'confirmFn'
  | 'fileParser'
  | 'inputFilePathOrData'
  | 'mergeFn'
  | 'serialize'
>;

//#region> Resolution
/**
 * undefined - no confirm function was provided or used
 */
export type ConflictConfirmationResult =
  | Exclude<ConflictStrategy, 'merge'>
  | undefined;
//#region> Results
export type ConflictResolutionResult =
  ConflictResolutionResultMap[keyof ConflictResolutionResultMap];
export interface ConflictResolutionResultAbort extends ConflictResolutionResultBase {
  handledWith: 'abort';
}
export interface ConflictResolutionResultBase {
  handledWith: ConflictStrategy;
}
export interface ConflictResolutionResultMap {
  abort: ConflictResolutionResultAbort;
  merge:
    | ConflictResolutionResultMergeCustom
    | ConflictResolutionResultMergeDefault;
  overwrite: ConflictResolutionResultOverwrite;
  skip: ConflictResolutionResultSkip;
}

export interface ConflictResolutionResultMergeCustom extends ConflictResolutionResultBase {
  confirmation: ConflictConfirmationResult;
  handledWith: 'merge';
  usingHandlers: {
    fileParser: string;
    fileSerializer: string;
    mergeFileData: string;
    mergeFileDiskContent: string;
    type: 'custom';
  };
}
export interface ConflictResolutionResultMergeDefault extends ConflictResolutionResultBase {
  confirmation: ConflictConfirmationResult;
  handledWith: 'merge';
  usingHandlers: {
    fileSerializer: string;
    mergeFileData: string;
    mergeFileDiskContent: string;
    type: 'default';
  };
}
export interface ConflictResolutionResultOverwrite extends ConflictResolutionResultBase {
  confirmation: ConflictConfirmationResult;
  handledWith: 'overwrite';
}
export interface ConflictResolutionResultSkip extends ConflictResolutionResultBase {
  handledWith: 'skip';
}
//#endregion

//#endregion
