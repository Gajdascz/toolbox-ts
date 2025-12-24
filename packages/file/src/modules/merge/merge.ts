import { loadModule } from '../load-module/index.js';
import { parseJson } from '../parse-json/index.js';
import { writeFile } from '../write/index.js';

export interface MergeFileOptions<I> {
  baseFilePath: string;

  confirmFn?: (merged: I) => boolean | Promise<boolean>;

  fileParser: (filePath: string) => I | Promise<I>;

  inputFilePathOrData: I | string;

  mergeFn: (existing: I, incoming: I) => I | Promise<I>;

  serialize?: (data: I) => Promise<string> | string;
}
export const mergeFile = async <I = unknown>({
  baseFilePath,
  inputFilePathOrData,
  fileParser,
  mergeFn,
  confirmFn,
  serialize
}: MergeFileOptions<I>) => {
  const base = await fileParser(baseFilePath);
  const input =
    typeof inputFilePathOrData === 'string' ?
      await fileParser(inputFilePathOrData)
    : inputFilePathOrData;

  const merged = await mergeFn(base, input);
  const confirmed = confirmFn ? await confirmFn(merged) : true;
  if (confirmed)
    await writeFile(
      baseFilePath,
      serialize ? await serialize(merged) : merged,
      { overwrite: { behavior: 'force' } }
    );
};
export type MergeJSONOptions<I> = Omit<
  MergeFileOptions<I>,
  'fileParser' | 'serialize'
>;

export const mergeJSON = async <I>({
  baseFilePath,
  inputFilePathOrData,
  mergeFn,
  confirmFn
}: MergeJSONOptions<I>): Promise<void> =>
  mergeFile({
    baseFilePath,
    inputFilePathOrData,
    fileParser: parseJson,
    mergeFn,
    confirmFn
  });

export type MergeModuleOptions<I> = {
  serialize: NonNullable<MergeFileOptions<I>['serialize']>;
} & Omit<MergeFileOptions<I>, 'fileParser' | 'serialize'>;
export const mergeModule = async <I>({
  baseFilePath,
  inputFilePathOrData,
  mergeFn,
  confirmFn,
  serialize
}: MergeModuleOptions<I>) =>
  mergeFile({
    baseFilePath,
    inputFilePathOrData,
    fileParser: loadModule<I>,
    mergeFn,
    confirmFn,
    serialize
  });
