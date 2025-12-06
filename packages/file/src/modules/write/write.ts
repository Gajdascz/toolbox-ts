import fs from 'node:fs';
import path from 'node:path';

interface NormalizeWriteDataOptions {
  encoding?: Parameters<InstanceType<typeof Buffer>['toString']>[0];
}
/**
 * Normalize various data types to a string for writing to a writeFile.
 * - `null` or `undefined` become an empty string.
 * - `string` is returned as-is.
 * - `Buffer` and `Uint8Array` are converted to strings using the specified encoding (default is 'utf8').
 * - `Date` is converted to an ISO string.
 * - `object` is serialized to a JSON string with 2-space indentation.
 * - Other types are converted to strings using their `toString` method.
 *
 * @example
 * ```ts
 * normalizeWriteData(null); // ''
 * normalizeWriteData(undefined); // ''
 * normalizeWriteData('Hello, World!'); // 'Hello, World!'
 * normalizeWriteData(Buffer.from('Hello, Buffer!')); // 'Hello, Buffer!'
 * normalizeWriteData(new Uint8Array([72, 101, 108, 108, 111])); // 'Hello'
 * normalizeWriteData(new Date('2023-10-01T12:00:00Z')); // '
 * 2023-10-01T12:00:00.000Z'
 * normalizeWriteData({ key: 'value' }); // '{\n  "key": "value"\n}'
 * normalizeWriteData(123); // '123'
 * ```
 */
export const normalizeWriteData = (
  data: unknown,
  { encoding = 'utf8' }: NormalizeWriteDataOptions = {}
): string => {
  if (data === null || data === undefined) return '';

  if (typeof data === 'string') return data;

  if (data instanceof Buffer) return data.toString(encoding);

  if (data instanceof Uint8Array) return Buffer.from(data).toString(encoding);

  if (data instanceof Date) return data.toISOString();

  if (typeof data === 'object') return JSON.stringify(data, null, 2);

  return String(data as unknown);
};

/**
 * Controls what happens when the output directory is not empty
 * - 'prompt': Ask user for confirmation (requires prompts dependency to be passed)
 * - 'force': Always overwrite without asking
 * - 'skip': Never overwrite, return false if directory is not empty
 */
export type OverwriteBehavior = 'force' | 'prompt' | 'skip';

export const overwriteBehavior: { [K in OverwriteBehavior]: K } = {
  force: 'force',
  prompt: 'prompt',
  skip: 'skip'
} as const;
export const isOverwriteBehavior = (
  value: unknown
): value is OverwriteBehavior =>
  typeof value === 'string' && value in overwriteBehavior;

/**
 * Optional prompts function to use if overwriteBehavior is 'prompt'
 */
export type OverwritePromptFn = () => Promise<boolean>;

export interface OverwriteResult {
  error?: string;
  filePath: string;
  success: boolean;
}

/**
 * Options for writing writeFileTemplates to an output directory
 */
export interface WriteFileOpts {
  overwrite?: { behavior?: OverwriteBehavior; promptFn?: OverwritePromptFn };
}

/**
 * Gets the appropriate handler function based on the overwrite behavior.
 */
const getFileOverwriteHandler = (
  behavior: OverwriteBehavior,
  promptFn?: OverwritePromptFn
): ((filePath: string) => OverwriteResult | Promise<OverwriteResult>) => {
  switch (behavior) {
    case 'force': {
      return (filePath: string) => ({ filePath, success: true });
    }
    case 'prompt': {
      if (typeof promptFn !== 'function') {
        throw new TypeError(
          'Prompt function is required when overwrite behavior is set to "prompt".'
        );
      }
      return async (filePath: string) => {
        const result = await promptFn();
        return result ?
            { filePath, success: true }
          : { filePath, error: 'User skipped', success: false };
      };
    }
    case 'skip': {
      return (filePath: string) => ({
        filePath,
        success: false,
        error: 'Skipped (exists)'
      });
    }
    default: {
      throw new Error(`Unexpected overwrite behavior: ${behavior}`);
    }
  }
};

/**
 * Write data to a writeFile.
 * - Creates the directory if it does not exist.
 * - Handles existing files based on the specified overwrite behavior.
 *
 * @throws when writing fails or when overwrite is denied/skipped.
 *
 * @example
 * ```ts
 * await writeFile('output/hello.txt', 'Hello, World!', { overwrite: { behavior: 'prompt', promptFn: async () => true } });
 * ```
 *
 */
export const writeFile = async (
  filePath: string,
  data: unknown,
  { overwrite = {} }: WriteFileOpts = {}
): Promise<void> => {
  const _data = normalizeWriteData(data);
  const { behavior = 'skip', promptFn } = overwrite;

  if (fs.existsSync(filePath)) {
    const { success, error } = await getFileOverwriteHandler(
      behavior,
      promptFn
    )(filePath);
    if (!success)
      throw new Error(`Cannot write to ${filePath}. Write aborted: ${error}`);
  }
  await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
  await fs.promises.writeFile(filePath, _data);
};

export interface FileEntry {
  /**
   * Data to write to the writeFile. Can be any type; will be normalized to string.
   */
  data: unknown;
  /**
   * Name of the writeFile to write.
   */
  filename: string;
  /**
   * Optional path relative to the output directory to write the file to.
   */
  pathFromOutDir?: string;
}
interface WriteFilesResult {
  error?: string;
  filename: string;
  success: boolean;
}
/**
 * Write multiple files to a specified output directory.
 * - Creates directories as needed.
 * - Handles existing files based on the specified overwrite behavior.
 * - Returns results for each file indicating success or failure.
 *
 * @param outDir - The base output directory where files will be written.
 * @param files - An array of file entries to write.
 * @param opts - Optional write options (overwrite behavior).
 * @returns An array of results for each file write operation.
 *
 * @example
 * ```ts
 * const files: FileEntry[] = [
 *   { filename: 'greeting.txt', data: 'Hello, Alice!' },
 *   { filename: 'config.json', data: { name: 'app' }, pathFromOutDir: 'configs' }
 * ];
 *
 * const results = await writeFiles('./output', files);
 * // Writes: ./output/greeting.txt, ./output/configs/config.json
 *
 * // With overwrite options:
 * const results = await writeFiles('./output', files, {
 *   overwrite: { behavior: 'force' }
 * });
 * ```
 */
export const writeFiles = async (
  outDir: string,
  files: FileEntry[],
  opts?: WriteFileOpts
): Promise<WriteFilesResult[]> => {
  const results: WriteFilesResult[] = [];
  for (const file of files) {
    const filePath = path.join(
      outDir,
      file.pathFromOutDir ?? '',
      file.filename
    );
    try {
      await writeFile(filePath, file.data, opts);
      results.push({ filename: filePath, success: true });
    } catch (error) {
      results.push({
        filename: filePath,
        success: false,
        error: (error as Error).message
      });
    }
  }
  return results;
};
