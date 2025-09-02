import fs from 'node:fs';

import type { FileContentResolver, ResultObj } from '../types.ts';

export interface ParseJsonOpts<TParsed, TResolved = TParsed> {
  resolverFn?: FileContentResolver<TParsed, TResolved>;
}

const parseJson = async <TParsed, TResolved = TParsed>(
  filePath: string,
  { resolverFn }: ParseJsonOpts<TParsed, TResolved> = {}
): Promise<ResultObj<TResolved>> => {
  try {
    const content = await fs.promises.readFile(filePath, 'utf8');
    let parsed: null | TParsed | TResolved = JSON.parse(content) as TParsed;
    if (resolverFn) parsed = resolverFn(parsed);
    if (parsed === null) throw new Error(`Resolver function returned null`);
    return { result: parsed as TResolved };
  } catch (error) {
    const errMsg =
      `Failed to parse JSON config from ${filePath}\n`
      + (error instanceof Error ? `Error: ${error.message}` : String(error));
    return { result: null, error: errMsg };
  }
};

export { parseJson };
