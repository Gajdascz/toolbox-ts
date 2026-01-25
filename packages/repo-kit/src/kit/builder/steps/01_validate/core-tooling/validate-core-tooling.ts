import type { BuildResult, ErrorResultCode } from '../../../types.js';

import {
  validateDependencies,
  type ValidateDependencyEntry,
  type ValidateDependencyResult
} from '../../../../core/index.js';
import { CORE_TOOLING } from './policy.js';
export interface ValidateCoreToolingDetail {
  coreTooling: ValidateDependencyResult[];
}
export interface ValidateCoreToolingOptions {
  additional?: ValidateDependencyEntry[];
  attemptAutoFixes?: boolean;
  useBasePolicy?: boolean;
}
export type ValidateCoreToolingResult = BuildResult<
  ValidateCoreToolingDetail,
  ValidateCoreToolingDetail
>;
export const CORE_TOOLING_FAIL_CODE: ErrorResultCode =
  'ERROR_CORE_TOOLING_VALIDATION_FAILED';

export const validateCoreTooling = async ({
  additional = [],
  attemptAutoFixes = false,
  useBasePolicy = true
}: ValidateCoreToolingOptions = {}): Promise<ValidateCoreToolingResult> => {
  const entries = useBasePolicy ? [...CORE_TOOLING, ...additional] : additional;
  const results = await validateDependencies(attemptAutoFixes, entries);
  const hasErrors = results.some((r) => r.status === 'invalid');
  return hasErrors ?
      {
        status: 'error',
        detail: {
          code: CORE_TOOLING_FAIL_CODE,
          message: 'core tooling validation failed',
          coreTooling: results
        }
      }
    : { status: 'success', detail: { coreTooling: results } };
};
