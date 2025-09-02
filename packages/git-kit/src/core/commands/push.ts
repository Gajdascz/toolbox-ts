import { Args, Flags } from '@oclif/core';

import { BaseGit } from '../base/index.js';

export default class Push extends BaseGit {
  static override args = {
    remote: Args.string({
      default: 'origin',
      description: 'Git remote name',
      required: false
    }),
    branch: Args.string({ description: 'Branch name to push', required: false })
  };
  static override description =
    'Pushes the current branch to a remote with standardized options and safety checks. Supports dry-run, tags, force-with-lease, and upstream flags.';

  static override examples = [
    '$ <%= config.bin %> <%= command.id %>',
    '$ <%= config.bin %> <%= command.id %> origin main',
    '$ <%= config.bin %> <%= command.id %> upstream feature-branch --tags',
    '$ <%= config.bin %> <%= command.id %> --dry-run',
    '$ <%= config.bin %> <%= command.id %> origin main --set-upstream --force-with-lease'
  ];
  static override flags = {
    'dry-run': Flags.boolean({
      description: 'Do not actually push, just show what would happen'
    }),
    'force-with-lease': Flags.boolean({
      description: 'Use --force-with-lease when pushing'
    }),
    'set-upstream': Flags.boolean({
      description: 'Set upstream on first push'
    }),
    tags: Flags.boolean({ description: 'Push tags as well' })
  };
  static override id = 'push';

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(Push);

    const convention = await this.branch.assertReadyForDevelopment();
    this.changeset.assertValidState(convention);

    const remote = args.remote || 'origin';
    const branch = args.branch ?? (await this.branch.get());
    const { json, ...rest } = flags;

    const extra = Object.entries(rest)
      .filter(([k, v]) => Boolean(v))
      .flatMap(([k]) => [`--${k}`]);

    this.log('Pushing branch:', branch);
    await this.git.exec(['push', [...extra, remote, branch]]);
  }
}
