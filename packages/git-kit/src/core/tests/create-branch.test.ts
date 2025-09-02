import { input, select } from '@inquirer/prompts';
import { Config } from '@oclif/core';
import {
  mockConsole,
  mockFirstArgsMatch
} from '@toolbox-ts/test-utils/helpers';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import Cb from '../commands/create-branch.ts';

mockConsole.stub();

vi.mock('../../core/base/config/index.ts', async (actual) => ({
  ...(await actual()),
  getScopes: vi.fn(() => ['repo', 'package-one', 'package-two'])
}));

describe('Create-Branch Command', () => {
  let command: Cb;
  let gitMock: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    command = new Cb([], await Config.load({ root: process.cwd() }));
    (gitMock as any) = vi
      .spyOn(command.git as any, 'exec')
      .mockResolvedValue(undefined);
    vi.spyOn(command as any, 'parse').mockResolvedValue({
      args: { description: 'description', scope: 'package-one', type: 'feat' },
      flags: {}
    });
  });

  it('creates branch', async () => {
    await command.run();
    expect(
      mockFirstArgsMatch(gitMock, [
        ['checkout', ['-b', 'feat/package-one/description']]
      ])
    ).toBeTruthy();
  });

  it('creates branch with type and "repo" scope', async () => {
    vi.spyOn(command as any, 'parse').mockResolvedValue({
      args: { description: 'description', scope: 'repo', type: 'chore' },
      flags: {}
    });
    await command.run();
    expect(
      mockFirstArgsMatch(gitMock, [
        ['checkout', ['-b', 'chore/repo/description']]
      ])
    ).toBeTruthy();
  });

  it('throws if type is missing', async () => {
    vi.spyOn(command as any, 'parse').mockResolvedValue({
      args: { scope: 'repo', type: undefined },
      flags: {}
    });
    await expect(command.run()).rejects.toThrow();
  });
  it('throws if scope is missing', async () => {
    vi.spyOn(command as any, 'parse').mockResolvedValue({
      args: { description: 'description', scope: undefined, type: 'feat' },
      flags: {}
    });
    await expect(command.run()).rejects.toThrow();
  });

  it('calls git with correct command tuple', async () => {
    vi.spyOn(command as any, 'parse').mockResolvedValue({
      args: { description: 'description', scope: 'package-two', type: 'perf' },
      flags: {}
    });
    await command.run();
    expect(
      mockFirstArgsMatch(gitMock, [
        ['checkout', ['-b', 'perf/package-two/description']]
      ])
    ).toBeTruthy();
  });
  it('throws error for invalidate scope', async () => {
    vi.spyOn(command as any, 'parse').mockResolvedValue({
      args: { scope: 'invalid-scope', type: 'feat' },
      flags: {}
    });
    await expect(command.run()).rejects.toThrow();
  });
  it('handles interactive mode', async () => {
    vi.spyOn(command as any, 'parse').mockResolvedValue({
      args: {},
      flags: { interactive: true }
    });
    vi.mocked(select)
      .mockResolvedValueOnce('feat')
      .mockResolvedValueOnce('package-one');
    vi.mocked(input).mockResolvedValueOnce('description');

    await command.run();
    expect(
      mockFirstArgsMatch(gitMock, [
        ['checkout', ['-b', 'feat/package-one/description']]
      ])
    ).toBeTruthy();
  });
});
