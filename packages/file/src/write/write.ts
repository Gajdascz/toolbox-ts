import fs from 'node:fs';
import path from 'node:path';

import type { ResultObj } from '../types.ts';

interface NormalizeDataOptions {
  encoding?: Parameters<InstanceType<typeof Buffer>['toString']>[0];
}
export const normalizeData = (
  data: unknown,
  { encoding = 'utf8' }: NormalizeDataOptions = {}
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

export const overwriteBehaviors: { [K in OverwriteBehavior]: K } = {
  force: 'force',
  prompt: 'prompt',
  skip: 'skip'
} as const;
export const isOverwriteBehavior = (
  value: unknown
): value is OverwriteBehavior =>
  typeof value === 'string' && value in overwriteBehaviors;
/**
 * Optional prompts function to use if overwriteBehavior is 'prompt'
 */
export type OverwritePromptFn = () => Promise<boolean>;
export interface OverwriteResult {
  error?: string;
  file: string;
  success: boolean;
}

/**
 * Options for writing templates to an output directory
 */
export interface WriteOpts {
  overwrite?: { behavior?: OverwriteBehavior; promptFn?: OverwritePromptFn };
}
export interface WriteTemplate<Content extends object = object> {
  filename: string;
  generate: (cfg: Content, ...args: unknown[]) => string;
  outDir?: string;
  relativePath?: string;
}

/**
 * Gets the appropriate handler function based on the overwrite behavior.
 */
const getOverwriteHandler = (
  behavior: OverwriteBehavior,
  promptFn?: OverwritePromptFn
): ((filePath: string) => Promise<OverwriteResult>) => {
  switch (behavior) {
    case 'force': {
      return async (filePath: string) => {
        return await Promise.resolve({ file: filePath, success: true });
      };
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
            { file: filePath, success: true }
          : { file: filePath, error: 'User skipped', success: false };
      };
    }
    case 'skip': {
      return async (filePath: string) => {
        return await Promise.resolve({
          file: filePath,
          success: false,
          error: 'Skipped (exists)'
        });
      };
    }
    default: {
      throw new Error(`Unexpected overwrite behavior: ${behavior}`);
    }
  }
};

export const templates = async <Content extends object>(
  defaultOutDir: string,
  data: Content,
  tmplts: WriteTemplate<Content>[],
  { overwrite = {} }: WriteOpts = {}
): Promise<ResultObj<OverwriteResult[]>> => {
  const { behavior = 'skip', promptFn } = overwrite;
  const overwriteHandler = getOverwriteHandler(behavior, promptFn);
  const results: OverwriteResult[] = [];

  for (const { filename, generate, relativePath, outDir } of tmplts) {
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
      results.push({ file: filePath, success: true });
    } catch (error) {
      results.push({
        file: filePath,
        success: false,
        error: (error as Error).message
      });
    }
  }

  return { result: results };
};

export const file = async (
  filePath: string,
  data: unknown,
  { overwrite = {} }: WriteOpts = {}
): Promise<void> => {
  const _data = normalizeData(data);
  const { behavior = 'skip', promptFn } = overwrite;

  if (fs.existsSync(filePath)) {
    const { success, error } = await getOverwriteHandler(
      behavior,
      promptFn
    )(filePath);
    if (!success)
      throw new Error(`Cannot write to ${filePath}. Write aborted: ${error}`);
  }
  await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
  await fs.promises.writeFile(filePath, _data);
};
