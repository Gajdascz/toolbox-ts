import fs from 'node:fs';
import path from 'node:path';

import type { ResultObj } from '../types.ts';

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
 * A template for generating a writeFile.
 * - `filename`: The name of the writeFile to generate.
 * - `generate`: A function that takes a configuration object and returns the writeFile content as a string.
 * - `outDir`: Optional output directory. If not provided, the default output directory will be used.
 * - `relativePath`: Optional relative path within the output directory. If not provided, the writeFile will be written directly to the output directory.
 *
 * @template Content - The type of the configuration object passed to the `generate` function.
 *
 * @example
 * ```ts
 * const template: FileWriteTemplate<{ name: string }> = {
 *   filename: 'greeting.txt',
 *   generate: (cfg) => `Hello, ${cfg.name}!`,
 *   outDir: './output',
 *   relativePath: 'messages'
 * };
 * ```
 */
export interface FileWriteTemplate<Content extends object = object> {
  filename: string;
  generate: (cfg: Content, ...args: unknown[]) => string;
  outDir?: string;
  relativePath?: string;
}
/**
 * Optional prompts function to use if overwriteBehavior is 'prompt'
 */
export type OverwritePromptFn = () => Promise<boolean>;

export interface OverwriteResult {
  error?: string;
  success: boolean;
  writeFile: string;
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
      return (filePath: string) => ({ writeFile: filePath, success: true });
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
            { writeFile: filePath, success: true }
          : { writeFile: filePath, error: 'User skipped', success: false };
      };
    }
    case 'skip': {
      return (filePath: string) => ({
        writeFile: filePath,
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
 * Write multiple writeFileTemplates to files in a specified output directory.
 * - Creates the output directory if it does not exist.
 * - Handles existing files based on the specified overwrite behavior.
 *
 * @template Content - The type of the configuration object passed to the template generate functions.
 *
 * @example
 * ```ts
 * const writeFileTemplates: FileWriteTemplate<{ name: string }>[] = [
 *   {
 *     filename: 'greeting.txt',
 *     generate: (cfg) => `Hello, ${cfg.name}!`,
 *     relativePath: 'messages'
 *   },
 *   {
 *     filename: 'farewell.txt',
 *     generate: (cfg) => `Goodbye, ${cfg.name}!`,
 *     relativePath: 'messages'
 *   }
 * ];
 * const results = await writeFileTemplates('./output', { name: 'Alice' }, writeFileTemplates, { overwrite: { behavior: 'prompt', promptFn: async () => true } });
 * console.log(results);
 * ```
 */
export const writeFileTemplates = async <Content extends object>(
  /**
   * The default output directory where files will be written.
   */
  defaultOutDir: string,
  /**
   * The object-formatted data to pass to each template's generate function.
   */
  data: Content,
  /**
   * An array of writeFileTemplates to write.
   */
  templates: FileWriteTemplate<Content>[],
  { overwrite = {} }: WriteFileOpts = {}
): Promise<ResultObj<OverwriteResult[]>> => {
  const { behavior = 'skip', promptFn } = overwrite;
  const overwriteHandler = getFileOverwriteHandler(behavior, promptFn);
  const results: OverwriteResult[] = [];

  for (const { filename, generate, relativePath, outDir } of templates) {
    const targetDir = outDir ?? defaultOutDir;
    const filePath = path.join(targetDir, relativePath ?? '', filename);

    try {
      await fs.promises.mkdir(path.dirname(filePath), { recursive: true });

      const exists = fs.existsSync(filePath);
      if (exists) {
        const result = await overwriteHandler(filePath);
        if (!result.success) {
          results.push(result);
          continue;
        }
      }
      await fs.promises.writeFile(filePath, generate(data));
      results.push({ writeFile: filePath, success: true });
    } catch (error) {
      results.push({
        writeFile: filePath,
        success: false,
        error: (error as Error).message
      });
    }
  }

  return { result: results };
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
