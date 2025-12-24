import { $ } from 'execa';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { DependencyError } from '../../../../Errors.ts';
import {
  validateDependencies,
  type ValidateDependencyEntry
} from './validate.ts';

const mocked$ = vi.mocked($);
describe('validate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocked$.mockImplementation((cmd: string): any => {
      if (cmd === 'force-pass') {
        return Promise.resolve({ stdout: 'v1.0.0' } as any);
      }
      if (cmd === 'node --version') {
        return Promise.resolve({ stdout: 'v18.0.0' } as any);
      }
      if (cmd === 'pnpm --version') {
        return Promise.resolve({ stdout: '7.0.0' } as any);
      }
      return Promise.reject(new Error('Command not found'));
    });
  });

  describe('validateDependencies', () => {
    describe('full validation', () => {
      it('should validate installed tools successfully', async () => {
        const consoleLogSpy = vi
          .spyOn(console, 'log')
          .mockImplementation(() => {});

        const tools: ValidateDependencyEntry[] = [
          {
            id: 'node',
            getVersionCmd: 'node --version',
            fixCmd: 'echo "install node"'
          },
          {
            id: 'pnpm',
            getVersionCmd: 'pnpm --version',
            fixCmd: 'npm install -g pnpm'
          }
        ];

        await validateDependencies(true, tools);

        expect(consoleLogSpy).toHaveBeenCalledWith(
          expect.stringContaining('✅ Using node version')
        );
        expect(consoleLogSpy).toHaveBeenCalledWith(
          expect.stringContaining('✅ Using pnpm version')
        );

        consoleLogSpy.mockRestore();
      });
      it('should validate multiple tools in sequence', async () => {
        const consoleLogSpy = vi
          .spyOn(console, 'log')
          .mockImplementation(() => {});
        const fixCmd = vi.fn().mockResolvedValue(true);
        const tools: ValidateDependencyEntry[] = [
          { id: 'tool1', getVersionCmd: 'node --version', fixCmd },
          { id: 'tool2', getVersionCmd: 'pnpm --version', fixCmd },
          { id: 'tool3', getVersionCmd: 'git --version', fixCmd }
        ];

        await validateDependencies(true, tools);

        expect(consoleLogSpy).toHaveBeenCalledWith(
          expect.stringContaining('tool1')
        );
        expect(consoleLogSpy).toHaveBeenCalledWith(
          expect.stringContaining('tool2')
        );
        expect(consoleLogSpy).toHaveBeenCalledWith(
          expect.stringContaining('tool3')
        );

        consoleLogSpy.mockRestore();
      });

      it('should handle empty tools array', async () => {
        await expect(validateDependencies(true, [])).resolves.not.toThrow();
      });
    });

    describe('autofix', () => {
      it('should auto-fix missing tools when autoFix is true', async () => {
        const consoleLogSpy = vi
          .spyOn(console, 'log')
          .mockImplementation(() => {});

        const tools: ValidateDependencyEntry[] = [
          {
            id: 'missing-tool',
            getVersionCmd: 'missing-tool --version',
            fixCmd: async () => await Promise.resolve(true)
          }
        ];

        await validateDependencies(true, tools);

        expect(consoleLogSpy).toHaveBeenCalledWith(
          expect.stringContaining('missing-tool')
        );
        consoleLogSpy.mockRestore();
      });
      it('should throw error when autoFix is false and tool is missing', async () => {
        const tools: ValidateDependencyEntry[] = [
          {
            id: 'missing-tool',
            getVersionCmd: 'missing-tool --version',
            fixCmd: 'echo "should not run"'
          }
        ];

        await expect(validateDependencies(false, tools)).rejects.toThrow(
          DependencyError
        );
      });
      describe('fixCmd', () => {
        it('should auto-fix missing tools when autoFix is true with string fixCmd', async () => {
          const consoleLogSpy = vi
            .spyOn(console, 'log')
            .mockImplementation(() => {});

          // Mock the command to fail first (tool missing), then succeed after fix
          let callCount = 0;
          mocked$.mockImplementation((cmd: string): any => {
            if (cmd === 'missing-tool --version') {
              callCount++;
              return callCount === 1 ?
                  Promise.reject(new Error('Command not found'))
                : Promise.resolve({ stdout: 'v2.0.0' } as any);
            }
            if (cmd === 'npm install -g missing-tool') {
              return Promise.resolve({} as any);
            }
            return Promise.reject(new Error('Command not found'));
          });

          const tools: ValidateDependencyEntry[] = [
            {
              id: 'missing-tool',
              getVersionCmd: 'missing-tool --version',
              fixCmd: 'npm install -g missing-tool'
            }
          ];

          await validateDependencies(true, tools);

          expect(consoleLogSpy).toHaveBeenCalledWith(
            expect.stringContaining('missing-tool')
          );
          consoleLogSpy.mockRestore();
        });
        it('should succeed with valid string fixCmd', async () => {
          const consoleLogSpy = vi
            .spyOn(console, 'log')
            .mockImplementation(() => {});

          const tools: ValidateDependencyEntry[] = [
            {
              id: 'missing-tool',
              getVersionCmd: 'force-pass',
              fixCmd: 'echo "install missing-tool"'
            }
          ];

          await validateDependencies(true, tools);

          expect(consoleLogSpy).toHaveBeenCalledWith(
            expect.stringContaining('missing-tool')
          );
          consoleLogSpy.mockRestore();
        });
        it('should throw error when fixCmd fails', async () => {
          const tools: ValidateDependencyEntry[] = [
            {
              id: 'install-fail-tool',
              getVersionCmd: 'install-fail-tool --version',
              fixCmd: 'exit 1'
            }
          ];
          await expect(validateDependencies(true, tools)).rejects.toThrow(
            DependencyError
          );
        });
        it('should use function fixCmd and handle true return', async () => {
          const consoleLogSpy = vi
            .spyOn(console, 'log')
            .mockImplementation(() => {});
          const fixFn = vi.fn().mockResolvedValue(true);

          const tools: ValidateDependencyEntry[] = [
            {
              id: 'custom-tool',
              getVersionCmd: 'custom-tool --version',
              fixCmd: fixFn
            }
          ];

          await validateDependencies(true, tools);

          expect(fixFn).toHaveBeenCalled();
          expect(consoleLogSpy).toHaveBeenCalledWith(
            expect.stringContaining('custom-tool')
          );

          consoleLogSpy.mockRestore();
        });

        it('should throw error when function fixCmd returns false', async () => {
          const fixFn = vi.fn().mockResolvedValue(false);

          const tools: ValidateDependencyEntry[] = [
            {
              id: 'failed-tool',
              getVersionCmd: 'failed-tool --version',
              fixCmd: fixFn
            }
          ];

          await expect(validateDependencies(true, tools)).rejects.toThrow(
            DependencyError
          );
        });
        it('should throw error when function fixCmd throws', async () => {
          const fixFn = vi.fn().mockRejectedValue(new Error('Fix failed'));

          const tools: ValidateDependencyEntry[] = [
            {
              id: 'error-tool',
              getVersionCmd: 'error-tool --version',
              fixCmd: fixFn
            }
          ];

          await expect(validateDependencies(true, tools)).rejects.toThrow(
            DependencyError
          );
        });
        it('should throw error when string fixCmd fails', async () => {
          const tools: ValidateDependencyEntry[] = [
            {
              id: 'install-fail-tool',
              getVersionCmd: 'install-fail-tool --version',
              fixCmd: 'exit 1'
            }
          ];

          await expect(validateDependencies(true, tools)).rejects.toThrow(
            DependencyError
          );
        });
      });
    });
  });
});
