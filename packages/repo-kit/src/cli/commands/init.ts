import { Args, Flags } from '@oclif/core';
import { BaseCommand } from '@toolbox-ts/cli-kit';
import { REPO_TYPES, type RepoType } from '@toolbox-ts/configs/core';

import { init } from '../../api/index.js';

export class InitCommand extends BaseCommand {
  static override readonly args = {
    repoType: Args.string({ required: true, options: [...REPO_TYPES] })
  };
  static override readonly flags = {
    rootDir: Flags.string({ required: false, default: '.' })
  };
  static override id = 'repo-kit';
  async run(): Promise<void> {
    const { args, flags } = await this.parse(InitCommand);
    const result = await init(args.repoType as RepoType, flags);
    switch (result.status) {
      case 'success':
        this.log('🚀 Repository initialized successfully.');
        break;
      case 'aborted':
        this.log(`⚠️ Initialization aborted: ${result.reason}`);
        break;
      case 'error':
        this.log(`❌ Initialization error: ${result.message}`);
        break;
    }
  }
}
