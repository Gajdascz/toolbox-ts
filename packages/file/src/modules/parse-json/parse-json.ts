import fs from 'node:fs';

import type { FileContentResolver, ResultObj } from '../types.ts';

/**
 * Options for parsing JSON content from a file
 */
export interface ParseJsonOpts<TParsed, TResolved = TParsed> {
  resolverFn?: FileContentResolver<TParsed, TResolved>;
}
const formatError = (filePath: string, error: unknown): string =>
  `Failed to parse JSON config from ${filePath}\n`
  + (error instanceof Error ? `Error: ${error.message}` : String(error));

const parse = <TParsed, TResolved = TParsed>(
  content: string,
  filePath: string,
  r: FileContentResolver<TParsed, TResolved> | undefined
): ResultObj<TResolved> => {
  try {
    let parsed: null | TParsed | TResolved = JSON.parse(content) as TParsed;
    if (r) parsed = r(parsed);
    if (parsed === null) throw new Error(`Resolver function returned null`);
    return { result: parsed as TResolved };
  } catch (error) {
    const errMsg = formatError(filePath, error);
    return { result: null, error: errMsg };
  }
};

/**
 * Parse JSON content from a file asynchronously.
 * - Reads the file content and parses it as JSON.
 * - Optionally processes the parsed content with a resolver function.
 * - Returns a result object containing either the parsed content or an error message.
 *
 * @example
 * ```ts
 * // config.json
 * {
 *   "key": "value"
 * }
 *
 * // parse-json.ts
 * const { result, error } = await parseJson<{ key: string }>('config.json');
 * console.log(result); // { key: 'value' }
 * ```
 */
export const parseJson = async <TParsed, TResolved = TParsed>(
  filePath: string,
  { resolverFn }: ParseJsonOpts<TParsed, TResolved> = {}
): Promise<ResultObj<TResolved>> => {
  try {
    const read = await fs.promises.readFile(filePath, 'utf8');
    return parse(read, filePath, resolverFn);
  } catch (error) {
    return { result: null, error: formatError(filePath, error) };
  }
};

/**
 * Parse JSON content from a file synchronously.
 * - Reads the file content and parses it as JSON.
 * - Optionally processes the parsed content with a resolver function.
 * - Returns a result object containing either the parsed content or an error message.
 *
 * @example
 * ```ts
 * // config.json
 * {
 *   "key": "value"
 * }
 *
 * // parse-json.ts
 * const { result, error } = syncParseJson<{ key: string }>('config.json');
 * console.log(result); // { key: 'value' }
 * ```
 */
export const syncParseJson = <TParsed, TResolved = TParsed>(
  filePath: string,
  { resolverFn }: ParseJsonOpts<TParsed, TResolved> = {}
): ResultObj<TResolved> =>
  parse(fs.readFileSync(filePath, 'utf8'), filePath, resolverFn);
