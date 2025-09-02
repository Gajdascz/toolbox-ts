import {
  mockConsole,
  mockFirstArgsMatch
} from '@toolbox-ts/test-utils/helpers';
import { parseCommandString } from 'execa';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import Commit from '../commands/commit.ts';

mockConsole.stub();

vi.mock('../../core/base/config/index.ts', async (actual) => ({
  ...(await actual()),
  getScopes: vi.fn(() => ['repo', 'package-one', 'package-two'])
}));
vi.mocked(parseCommandString).mockImplementation((c) => c.split(' '));
describe('Commit Command', () => {
  let command: Commit;
  let execMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.spyOn(process, 'cwd').mockReturnValue('./root');
    command = new Commit([], {} as any); // do not load oclif Config for unit tests
    (execMock as any) = vi
      .spyOn(command as any, 'exec')
      .mockResolvedValue({ stdout: '' });

    vi.spyOn(command.branch, 'assertReadyForDevelopment').mockResolvedValue({
      description: 'description',
      raw: 'feat/repo/description',
      scope: 'repo',
      type: 'feat'
    });
  });

  it('runs with no flags and default args', async () => {
    vi.spyOn(command as any, 'parse').mockResolvedValue({
      args: { stageFiles: '.' },
      flags: {
        amend: false,
        changeset: false,
        commitizen: false,
        noEdit: false
      }
    });

    await command.run();

    expect(execMock).toHaveBeenCalledTimes(2);
    expect(
      mockFirstArgsMatch(execMock, [
        ['git', ['add', '.']],
        ['git', ['commit']]
      ])
    ).toBeTruthy();
  });

  it('runs with changeset flag', async () => {
    vi.spyOn(command as any, 'parse').mockResolvedValue({
      args: { stageFiles: 'my-files' },
      flags: { amend: false, changeset: true, commitizen: false, noEdit: false }
    });

    await command.run();
    expect(execMock).toHaveBeenCalledTimes(4);
    expect(
      mockFirstArgsMatch(execMock, [
        ['pnpm', ['changeset', '--open']],
        ['git', ['add', '.changeset']],
        ['git', ['add', 'my-files']],
        ['git', ['commit']]
      ])
    ).toBeTruthy();
  });

  it('runs with commitizen flag', async () => {
    vi.spyOn(command as any, 'parse').mockResolvedValue({
      args: { stageFiles: '.' },
      flags: { amend: false, changeset: false, commitizen: true, noEdit: false }
    });

    await command.run();

    expect(execMock).toHaveBeenCalledTimes(2);
    expect(
      mockFirstArgsMatch(execMock, [
        ['git', ['add', '.']],
        ['pnpm', ['cz']]
      ])
    ).toBeTruthy();
  });

  it('runs with amend flag and no noEdit flag', async () => {
    vi.spyOn(command as any, 'parse').mockResolvedValue({
      args: { stageFiles: 'files' },
      flags: { amend: true, changeset: false, commitizen: false, noEdit: false }
    });

    await command.run();

    expect(execMock).toHaveBeenCalledTimes(2);
    expect(
      mockFirstArgsMatch(execMock, [
        ['git', ['add', 'files']],
        ['git', ['commit', '--amend']]
      ])
    ).toBeTruthy();
  });

  it('runs with amend flag and noEdit flag', async () => {
    vi.spyOn(command as any, 'parse').mockResolvedValue({
      args: { stageFiles: 'files' },
      flags: {
        amend: true,
        changeset: false,
        commitizen: false,
        ['no-edit']: true
      }
    });

    await command.run();

    expect(execMock).toHaveBeenCalledTimes(2);
    expect(
      mockFirstArgsMatch(execMock, [
        ['git', ['add', 'files']],
        ['git', ['commit', '--amend', '--no-edit']]
      ])
    ).toBeTruthy();
  });

  it('throws error for protected branches', async () => {
    vi.spyOn(command.branch, 'assertReadyForDevelopment').mockRejectedValueOnce(
      new Error()
    );

    await expect(command.run()).rejects.toThrow();
    expect(execMock).not.toHaveBeenCalled();
  });
});
