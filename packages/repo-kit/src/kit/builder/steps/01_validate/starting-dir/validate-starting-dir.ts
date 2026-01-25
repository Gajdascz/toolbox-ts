import { PACKAGE_JSON_FILE } from '@toolbox-ts/configs/core';
import { isDir, isFile } from '@toolbox-ts/file';
import path from 'node:path';

import type {
  AbortResultCode,
  BuildResult,
  ErrorResultCode,
  ExistingProjectStrategy
} from '../../../types.js';
export interface ValidateStartingDirDetail {
  packageJson: { path: string } & (
    | { exists: false; strategy: undefined }
    | { exists: true; strategy: Omit<ExistingProjectStrategy, 'abort'> }
  );
}
export type ValidateStartingDirResult = BuildResult<ValidateStartingDirDetail>;
export const NOT_A_DIR_FAIL_CODE: ErrorResultCode =
  'ERROR_STARTING_DIR_NOT_A_DIRECTORY';
export const PROJECT_EXISTS_ABORT_CODE: AbortResultCode =
  'ABORT_PROJECT_ALREADY_EXISTS';

export const validateStartingDir = async (
  rootDir: string,
  onExistingProject: ExistingProjectStrategy = 'abort'
): Promise<ValidateStartingDirResult> => {
  if (!(await isDir(rootDir)))
    return {
      status: 'error',
      detail: {
        code: NOT_A_DIR_FAIL_CODE,
        message: `The specified rootDir "${rootDir}" is not a directory or does not exist.`
      }
    };

  const packagePath = path.join(rootDir, PACKAGE_JSON_FILE);
  const detail: ValidateStartingDirDetail = {
    packageJson: { path: packagePath, exists: false, strategy: undefined }
  };
  if (await isFile(packagePath)) {
    if (onExistingProject === 'abort')
      return {
        status: 'aborted',
        detail: {
          code: PROJECT_EXISTS_ABORT_CODE,
          message:
            'project conflict - a package.json file already exists in the specified rootDir'
        }
      };
    else {
      detail.packageJson.exists = true;
      detail.packageJson.strategy = onExistingProject;
    }
  }

  return { status: 'success', detail };
};
