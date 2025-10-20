import { obj } from '@toolbox-ts/utils';
import { cruise as _cruise, type ICruiseResult } from 'dependency-cruiser';

import { resolve } from '../config/index.js';

/**
 * Runs dependency-cruiser on the given files
 *
 * - Resolves configuration given input (object or config file name)
 * - OutputType is excluded from cruiseOptions as it's handled in each format type
 *   and this function will always return the raw result object + resolved output
 *   options.
 */
export const cruise = async (
  scan: string | string[],
  { flags, input }: resolve.ResolveConfigArgs
): Promise<{
  exitCode: number;
  output: resolve.ResolvedOptions['output'];
  result: ICruiseResult;
}> => {
  const { cruiseOptions, output, resolveOptions, transpileOptions } =
    await resolve.config({ input, flags });
  const result = await _cruise(
    Array.isArray(scan) ? scan : [scan],
    cruiseOptions,
    resolveOptions,
    transpileOptions
  );
  if (!obj.guards.isObjPlain(result.output))
    throw new TypeError(
      `BaseDepCruiser cruise function should always return an ICruiseResult object, but got: ${typeof result === 'object' ? JSON.stringify(result, null, 1) : result}`
    );
  return { output, result: result.output, exitCode: result.exitCode };
};
