/* c8 ignore start */
import { OperationError } from '../../../result.js';
export class TraverseError extends OperationError {
  constructor(
    {
      direction,
      startDir,
      endDir
    }: { direction: 'up' | 'down'; startDir: string; endDir?: string | null },
    cause?: unknown
  ) {
    super(`Failed to traverse ${direction}wards from ${startDir} to ${endDir ?? '*'}`, cause);
  }
}
/* c8 ignore stop */
