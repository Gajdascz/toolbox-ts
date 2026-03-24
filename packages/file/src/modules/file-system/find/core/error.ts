/* c8 ignore start */
import { OperationError } from '../../../result.js';
import type { FindDirection, FindTarget } from './types.js';
export class FindError extends OperationError {
  constructor(
    {
      direction,
      startDir,
      endDir = '*',
      target
    }: { startDir: string; endDir?: string; direction: FindDirection; target: FindTarget },
    cause?: unknown
  ) {
    super(
      `Failed to find ${target} file${target === 'all' ? 's' : ''}:\n   started at: ${startDir}\n   direction: ${direction}\n   end: ${endDir}`,
      cause
    );
  }
}
/* c8 ignore stop */
