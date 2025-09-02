import { input, select } from '@inquirer/prompts';
import { Args, Flags } from '@oclif/core';
import { Obj, Str } from '@toolbox-ts/utils';
import { icons } from '@toolbox-ts/utils/constants';

import { BaseGit } from '../base/index.js';

/** Command to create a Git branch with standardized naming conventions. */
export default class CreateBranch extends BaseGit {
  static override args = {
    type: Args.string({
      description: 'The type of branch to create',
      name: 'type',
      options: Obj.keys(this.CONVENTIONAL)
    }),
    scope: Args.string({
      description: 'The scope of the branch',
      name: 'scope'
    }),
    description: Args.string({
      description:
        'A short description of the branch. Must be lowercase, kebab-case, and alphanumeric.',
      name: 'description'
    })
  };
  static override description =
    'Creates a new branch using standardized naming: <type>/<scope>/<description>. Enforces lowercase, kebab-case, and valid types/scopes.';
  static override examples = [
    '$ <%= config.bin %> <%= command.id %> feat add-feature',
    '$ <%= config.bin %> <%= command.id %> fix bugfix',
    '$ <%= config.bin %> <%= command.id %> feat add-feature core',
    '$ <%= config.bin %> <%= command.id %> chore update-deps repo'
  ];
  static override flags = {
    interactive: Flags.boolean({
      default: false,
      description: 'Run the command in interactive mode to select options'
    })
  };
  static override id = 'cb';

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(CreateBranch);
    const {
      description = '',
      scope = '',
      type = ''
    } = flags.interactive ? await this.interactive() : args;
    const branch = `${type}/${scope}/${description}`;
    await this.branch.assertConvention({
      description,
      raw: branch,
      scope,
      type
    });
    this.log(`${icons.branch} Creating branch: ${branch}`);
    await this.git.exec(['checkout', ['-b', branch]]);
  }

  private async interactive() {
    return {
      type: await select({
        message: 'Select branch type (what kind of change is this?)',
        choices: CreateBranch.CONVENTIONAL_KEYS.map((key) => ({
          name: key,
          value: key,
          description: CreateBranch.CONVENTIONAL[key].description
        }))
      }),
      scope: await select({
        message: 'Select branch scope (where does it apply?)',
        choices: (await this.SCOPES).map((sc) => ({ name: sc, value: sc }))
      }),
      description: await input({
        message:
          'Enter a short description of the branch (what does it do?) in kebab and lowercase format (eg add-feature-to-pkg)'
      })
    };
  }
}
