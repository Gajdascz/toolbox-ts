import {
  mockConsole,
  mockFirstArgsMatch
} from '@toolbox-ts/test-utils/helpers';
import { parseCommandString } from 'execa';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import Push from '../commands/push.ts';

mockConsole.stub();

vi.mock('../../core/base/config/index.ts', async (actual) => ({
  ...(await actual()),
  getScopes: vi.fn(() => ['repo', 'package-one', 'package-two'])
}));

describe('Push Command', () => {
  let cmd: Push;
  let gitSpy;
  let parseSpy;
  let readySpy;
  let validSpy;
  let getBranchSpy;
  vi.mocked(parseCommandString).mockImplementation((c) => c.split(' '));

  const convention = {
    description: 'desc',
    raw: 'feat/repo/desc',
    scope: 'repo',
    type: 'feat'
  } as const;

  beforeEach(() => {
    cmd = new Push([], {} as any);

    // spies/mocks per instance
    gitSpy = vi
      .spyOn(cmd.git as any, 'exec')
      .mockResolvedValue(undefined as any);
    readySpy = vi
      .spyOn(cmd.branch, 'assertReadyForDevelopment')
      .mockResolvedValue(convention);
    validSpy = vi
      .spyOn(cmd.changeset, 'assertValidState')
      .mockReturnValue({ scope: 'repo', type: 'feat' });
    getBranchSpy = vi
      .spyOn(cmd.branch, 'get')
      .mockResolvedValue('current-branch');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('pushes with defaults when no args and all flags false', async () => {
    parseSpy = vi.spyOn(cmd as any, 'parse').mockResolvedValue({
      args: {}, // no remote, no branch
      flags: {
        'dry-run': false,
        'force-with-lease': false,
        json: false, // should be ignored by filter
        'set-upstream': false,
        tags: false
      }
    });

    await cmd.run();

    expect(parseSpy).toHaveBeenCalledWith(Push);
    expect(readySpy).toHaveBeenCalled();
    expect(validSpy).toHaveBeenCalledWith(convention);
    expect(getBranchSpy).toHaveBeenCalled();
    expect(
      mockFirstArgsMatch(gitSpy, [['push', ['origin', 'current-branch']]])
    ).toBeTruthy();
  });
  it('pushes with provided remote and branch plus truthy flags only', async () => {
    parseSpy = vi
      .spyOn(cmd as any, 'parse')
      .mockResolvedValue({
        args: { branch: 'feature-x', remote: 'upstream' },
        flags: {
          'dry-run': true,
          'force-with-lease': false,
          json: true,
          'set-upstream': true,
          tags: true
        }
      });

    await cmd.run();

    expect(
      mockFirstArgsMatch(gitSpy, [
        [
          'push',
          ['--dry-run', '--set-upstream', '--tags', 'upstream', 'feature-x']
        ]
      ])
    ).toBeTruthy();
  });

  it('propagates errors from assertReadyForDevelopment and does not push', async () => {
    readySpy.mockRejectedValueOnce(new Error('not ready'));

    await expect(() => cmd.run()).rejects.toThrow();
    expect(gitSpy).not.toHaveBeenCalled();
    expect(validSpy).not.toHaveBeenCalled();
  });
});
