import { Args, Flags } from '@oclif/core';
import { icons } from '@toolbox-ts/utils/constants';

import { BaseGit } from '../base/index.js';

/** Command to standardize and enforce Git Commit quality. */
export default class Commit extends BaseGit {
  static override args = {
    stageFiles: Args.string({
      default: '.',
      description: 'Stage files for commit',
      required: false
    })
  };
  static override description =
    'Stage files and create commits with convention enforcement and changeset integration';
  static override examples = [
    '$ <%= config.bin %> <%= command.id %>',
    '$ <%= config.bin %> <%= command.id %> src/',
    '$ <%= config.bin %> <%= command.id %> --changeset',
    '$ <%= config.bin %> <%= command.id %> --commitizen',
    '$ <%= config.bin %> <%= command.id %> --amend',
    '$ <%= config.bin %> <%= command.id %> --amend --no-edit'
  ];

  static override flags = {
    amend: Flags.boolean({
      description: 'Amend new commit with previous',
      type: 'boolean'
    }),
    changeset: Flags.boolean({
      aliases: ['cs'],
      description:
        'Create a changeset for the staged files, useful for versioning',
      exclusive: ['amend'],
      type: 'boolean'
    }),
    commitizen: Flags.boolean({
      aliases: ['cz'],
      description:
        'Use Commitizen to enforce conventional commit message format',
      exclusive: ['noEdit', 'noVerify', 'amend'],
      type: 'boolean'
    }),
    ['no-edit']: Flags.boolean({
      aliases: ['-ne'],
      dependsOn: ['amend'],
      description: 'Commit without invoking the editor',
      name: 'no-edit',
      type: 'boolean'
    })
  };
  static override id = 'commit';

  public async run(): Promise<void> {
    await this.branch.assertReadyForDevelopment();

    const { args, flags } = await this.parse(Commit);
    const { stageFiles } = args;
    const { amend, changeset, commitizen, ['no-edit']: noEdit } = flags;
    if (changeset) {
      this.log(`${icons.butterfly} Creating changeset...`);
      await this.exec(['pnpm', ['changeset', '--open']]);
      this.log(`${icons.recycle} Staging changeset...`);
      await this.git.exec(['add', ['.changeset']]);
    }
    this.log(`${icons.download} Staging files...`);
    await this.git.exec(['add', [stageFiles]]);
    if (commitizen) {
      this.log(`${icons.pencil} Starting commitizen...`);
      await this.exec(['pnpm', ['cz']]);
    } else if (amend) {
      this.log(`${icons.pencil} Amending previous commit...`);
      await this.git.exec(
        noEdit ? ['commit', ['--amend', '--no-edit']] : ['commit', ['--amend']]
      );
    } else {
      this.log(`${icons.download} Committing changes...`);
      await this.git.exec(['commit']);
    }
    this.log(`${icons.success} Commit successful!`);
  }
}
