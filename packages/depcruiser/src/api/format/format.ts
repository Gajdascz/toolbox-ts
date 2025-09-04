import { format as _format, type ICruiseResult } from 'dependency-cruiser';

import type { IFormattingOptions } from '../../config/index.js';

import { ghActions } from './gh-actions/index.js';

export const format = async (
  result: ICruiseResult,
  { outputType = 'json', ...rest }: Partial<IFormattingOptions> = {}
): Promise<string> => {
  const output =
    ghActions.isOutputType(outputType) ?
      ghActions.outputTypeFormatMap[outputType](result.summary.violations)
    : (await _format(result, { outputType, ...rest })).output;

  return typeof output === 'string' ? output : JSON.stringify(output, null, 2);
};
