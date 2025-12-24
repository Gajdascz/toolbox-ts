import { type ConfigModuleType, merge } from '@toolbox-ts/configs/core';
import { mergeFile, mergeJSON, mergeModule, writeFile } from '@toolbox-ts/file';
import fs from 'node:fs/promises';

import type {
  ConflictConfirmFn,
  ConflictFileData,
  ConflictResolutionResultMap,
  ConflictResolutionResultMergeCustom,
  ConflictResolutionResultMergeDefault,
  ConflictStrategy,
  ConflictStrategyArgs
} from './types.js';

import { OperationError } from '../../../../Errors.js';

const DEFAULT_FILE_DATA_MERGE = {
  object: { name: 'default-object-deep-merge', fn: merge },
  string: {
    name: 'default-string-concatenate',
    fn: (a: unknown, b: unknown) => String(a) + String(b)
  }
} as const;
const resolveFileDataMergeHandler = (
  incomingData: unknown,
  result: ConflictResolutionResultMap['merge']
) => {
  if (typeof incomingData === 'string') {
    const { fn, name } = DEFAULT_FILE_DATA_MERGE.string;
    result.usingHandlers.mergeFileData = name;
    return fn;
  } else {
    const { fn, name } = DEFAULT_FILE_DATA_MERGE.object;
    result.usingHandlers.mergeFileData = name;
    return fn;
  }
};
const DEFAULT_FILE_DISK_CONTENT_MERGE = {
  static: {
    name: 'default-static-json',
    fn: mergeJSON,
    serializer: 'default-json-stringify'
  },
  runtime: { name: 'default-runtime-module', fn: mergeModule<unknown> }
} as const;
const CUSTOM_MERGE_HANDLER_DEFAULTS = {
  parser: { name: 'default-node-fs-readfile', fn: fs.readFile },
  objectSerializer: {
    name: 'default-json-stringify',
    fn: (data: unknown) => JSON.stringify(data, null, 2)
  },
  stringSerializer: { name: 'default-string-constructor', fn: String }
} as const;
const mergeConfirmWrapper = (
  fileData: ConflictFileData,
  filePath: string,
  result: ConflictResolutionResultMap['merge'],

  confirmFn?: ConflictConfirmFn
) => {
  if (!confirmFn) {
    result.confirmation = undefined;
    return undefined;
  }
  return async (merged: unknown) => {
    /* c8 ignore start */
    // This is passed to a higher-level confirmFn
    const shouldMerge = await confirmFn(
      filePath,
      await fs.readFile(filePath, 'utf8'),
      merged
    );
    /* c8 ignore end */
    /**
     * when true is returned, the higher-level confirmFn overwrites
     * the file with merged content
     */
    if (shouldMerge === true) {
      result.confirmation = 'overwrite';
      return true;
    }
    result.confirmation = shouldMerge;
    await strategies[shouldMerge]({ fileData, filePath })();
    /** false is returned since an escape strategy is used. */
    return false;
  };
};
const resolveMergeDefaultFileDataHandler = (
  fileData: { type: 'default' } & ConflictFileData,
  incomingData: unknown,
  filePath: string,
  result: ConflictResolutionResultMergeDefault,
  confirmFn?: ConflictConfirmFn
): (() => Promise<void>) => {
  const mergeDataFn = resolveFileDataMergeHandler(incomingData, result);
  const opts = {
    baseFilePath: filePath,
    inputFilePathOrData: incomingData,
    mergeFn: mergeDataFn,
    confirmFn: mergeConfirmWrapper(fileData, filePath, result, confirmFn)
  };
  if (fileData.name === 'static') {
    const { fn, name, serializer } = DEFAULT_FILE_DISK_CONTENT_MERGE.static;
    result.usingHandlers.mergeFileDiskContent = name;
    result.usingHandlers.fileSerializer = serializer;
    return () => fn(opts);
  } else {
    const { fn, name } = DEFAULT_FILE_DISK_CONTENT_MERGE.runtime;
    result.usingHandlers.mergeFileDiskContent = name;
    const { fn: serializerFn, name: serializerName } =
      fileData.options.serialize;
    result.usingHandlers.fileSerializer = serializerName;
    return () => fn({ ...opts, serialize: serializerFn });
  }
};

const resolveMergeCustomFileDataHandler = (
  fileData: { type: 'custom' } & ConflictFileData,
  incomingData: unknown,
  filePath: string,
  result: ConflictResolutionResultMergeCustom,
  confirmFn?: ConflictConfirmFn
): (() => Promise<void>) => {
  const { fileParser, serialize, mergeFn: providedMergeFn } = fileData.options;
  let parser: (filePath: string) => Promise<unknown> | unknown;
  if (!fileParser) {
    const { name, fn } = CUSTOM_MERGE_HANDLER_DEFAULTS.parser;
    result.usingHandlers.fileParser = name;
    parser = fn;
  } else {
    result.usingHandlers.fileParser = fileParser.name;
    parser = fileParser.fn;
  }

  let serializer: (data: unknown) => Promise<string> | string;
  if (!serialize) {
    if (typeof incomingData === 'string') {
      const { fn, name } = CUSTOM_MERGE_HANDLER_DEFAULTS.stringSerializer;
      result.usingHandlers.fileSerializer = name;
      serializer = fn;
    } else {
      const { fn, name } = CUSTOM_MERGE_HANDLER_DEFAULTS.objectSerializer;
      result.usingHandlers.fileSerializer = name;
      serializer = fn;
    }
  } else {
    result.usingHandlers.fileSerializer = serialize.name;
    serializer = serialize.fn;
  }

  let mergeFn: (a: unknown, b: unknown) => Promise<unknown> | unknown;
  if (!providedMergeFn)
    mergeFn = resolveFileDataMergeHandler(incomingData, result);
  else {
    result.usingHandlers.mergeFileData = providedMergeFn.name;
    mergeFn = providedMergeFn.fn;
  }

  return () =>
    mergeFile({
      baseFilePath: filePath,
      inputFilePathOrData: incomingData,
      mergeFn,
      fileParser: parser,
      confirmFn: mergeConfirmWrapper(fileData, filePath, result, confirmFn),
      serialize: serializer
    });
};

const getStrategyMessage = (
  strategy: ConflictStrategy,
  { name }: ConflictFileData,
  filePath: string,
  action: string
): string =>
  `[conflict-handler](${strategy}) - ${name} file at ${filePath} already exists. `
  + action;

const strategies: {
  [S in ConflictStrategy]: (
    args: ConflictStrategyArgs[S]
  ) => () =>
    | ConflictResolutionResultMap[S]
    | Promise<ConflictResolutionResultMap[S]>;
} = {
  abort:
    ({ fileData, filePath }) =>
    () => {
      throw new OperationError(
        getStrategyMessage(
          'abort',
          fileData,
          filePath,
          'Aborting file operation.'
        )
      );
    },
  skip:
    ({ fileData, filePath }) =>
    () => {
      console.info(
        getStrategyMessage(
          'skip',
          fileData,
          filePath,
          'Skipping file operation'
        )
      );
      return { handledWith: 'skip' };
    },
  overwrite:
    ({ fileData, filePath, incomingData, confirmFn }) =>
    async () => {
      const result: ConflictResolutionResultMap['overwrite'] = {
        handledWith: 'overwrite',
        confirmation: undefined
      };
      let shouldOverwrite: boolean | ConflictStrategy = true;
      if (confirmFn) {
        shouldOverwrite = await confirmFn(
          filePath,
          await fs.readFile(filePath, 'utf8'),
          incomingData
        );
        result.confirmation =
          shouldOverwrite === true ? 'overwrite' : shouldOverwrite;
      }
      if (shouldOverwrite === true) {
        console.info(
          getStrategyMessage(
            'overwrite',
            fileData,
            filePath,
            'Overwriting file.'
          )
        );
        await writeFile(filePath, incomingData, {
          overwrite: { behavior: 'force' }
        });
        return result;
      } else {
        await strategies[shouldOverwrite]({ fileData, filePath })();
        result.confirmation = shouldOverwrite;
        return result;
      }
    },
  merge:
    ({ fileData, filePath, incomingData, confirmFn }) =>
    async () => {
      if (fileData.type === 'default') {
        const result: ConflictResolutionResultMergeDefault = {
          handledWith: 'merge',
          confirmation: undefined,
          usingHandlers: {
            fileSerializer: '',
            mergeFileData: '',
            mergeFileDiskContent: '',
            type: 'default'
          }
        };
        await resolveMergeDefaultFileDataHandler(
          fileData,
          incomingData,
          filePath,
          result,
          confirmFn
        )();
        return result;
      } else {
        const result: ConflictResolutionResultMergeCustom = {
          handledWith: 'merge',
          confirmation: undefined,
          usingHandlers: {
            fileParser: '',
            fileSerializer: '',
            mergeFileData: '',
            mergeFileDiskContent: '',
            type: 'custom'
          }
        };
        await resolveMergeCustomFileDataHandler(
          fileData,
          incomingData,
          filePath,
          result,
          confirmFn
        )();
        return result;
      }
    }
};

export const handleConflict = async <
  S extends ConflictStrategy,
  T extends ConfigModuleType = ConfigModuleType
>(
  strategy: S,
  args: ConflictStrategyArgs[S]
): Promise<ConflictResolutionResultMap[S]> => strategies[strategy](args)();
