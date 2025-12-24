import { DependencyError } from '../../../../Errors.js';
import { $shell } from '../../shell-exec.js';

export interface ValidateDependencyEntry {
  fixCmd?: (() => boolean | Promise<boolean>) | string;
  getVersionCmd: string;
  id: string;
  optional?: { message?: string; statusWhenMissing: 'valid' | 'warn' };
}

export type ValidateDependencyResult =
  | {
      error: Error;
      id: string;
      isOptional: false;
      message: string;
      status: 'invalid';
    }
  | {
      error: Error;
      id: string;
      isOptional: true;
      message: string;
      status: 'invalid';
    }
  | {
      id: string;
      isOptional: false;
      status: 'fixed' | 'valid';
      version: string;
    }
  | { id: string; isOptional: true; message: string; status: 'warn' }
  | { id: string; isOptional: true; status: 'valid'; version?: string };

export type ValidateDependencyStatus = 'fixed' | 'invalid' | 'valid' | 'warn';

export const validateDependencies = async (
  autoFix: boolean,
  deps: ValidateDependencyEntry[]
): Promise<ValidateDependencyResult[]> => {
  const results: ValidateDependencyResult[] = [];

  for (const { id, getVersionCmd, fixCmd, optional } of deps) {
    // 1. Try to read version
    try {
      const { stdout } = await $shell(getVersionCmd);
      results.push({
        id,
        isOptional: !!optional,
        status: 'valid',
        version: stdout
      });
      continue;
    } catch (error) {
      // only DependencyError is considered "missing"
      if (!(error instanceof DependencyError)) {
        throw error;
      }
    }

    // 2. Optional dependency missing
    if (optional) {
      if (optional.statusWhenMissing === 'valid') {
        results.push({ id, isOptional: true, status: 'valid' });
      } else {
        results.push({
          id,
          isOptional: true,
          status: 'warn',
          message: optional.message ?? `${id} is optional and missing`
        });
      }
      continue;
    }

    // 3. Required dependency missing → try auto-fix
    if (autoFix && fixCmd) {
      try {
        const fixResult =
          typeof fixCmd === 'function' ?
            await fixCmd()
          : Boolean((await $shell(fixCmd)).stdout);

        if (fixResult) {
          const { stdout } = await $shell(getVersionCmd);
          results.push({
            id,
            isOptional: false,
            status: 'fixed',
            version: stdout
          });
          continue;
        }

        throw new DependencyError(`Auto-fix for ${id} returned falsy`);
      } catch (error) {
        results.push({
          id,
          isOptional: false,
          status: 'invalid',
          message: `Auto-fix for ${id} failed`,
          error:
            error instanceof Error ? error : new DependencyError(String(error))
        });
        continue;
      }
    }

    // 4. Required dependency missing, no auto-fix
    results.push({
      id,
      isOptional: false,
      status: 'invalid',
      message: `${id} is missing and auto-fix is disabled`,
      error: new DependencyError(`${id} missing`)
    });
  }

  return results;
};
