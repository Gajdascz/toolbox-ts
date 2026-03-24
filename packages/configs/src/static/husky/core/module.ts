import { HOOKS } from '@toolbox-ts/constants/git';
import { Arr, Obj } from '@toolbox-ts/utils';

/**
 * Configuration for Husky Git hooks.
 * Each key is a Git hook name (husky directory file),
 * and the value is the command(s) to run (file content).
 * @example
 * ```ts
 * import { husky } from '@toolbox-ts/configs';
 *
 * export default husky.define({
 *   'pre-push': ['pnpm test', 'pnpm build'],
 * });
 * ```
 */
export type PresetHook = 'pre-commit' | 'commit-msg';
export type ProcessedConfig = { [H in HOOKS.Hook]?: string } & { [H in PresetHook]: string };
export const BRANCH_CONDITION = `branch=$(git rev-parse --abbrev-ref HEAD)
if [ "$branch" = "main" ]; then
  echo "Direct commits to 'main' are not allowed. Please checkout a new branch and commit your changes there."
  exit 1
fi`;
export const DEFAULTS: ProcessedConfig = {
  'pre-commit': `${BRANCH_CONDITION}

pnpm run lint-staged
`,
  'commit-msg': 'pnpm exec commitlint --edit "$1"'
};
export type InputConfig = Omit<
  { [H in HOOKS.Hook]?: string | string[] },
  'pre-commit' | 'commit-msg'
> & { append?: { 'pre-commit'?: string | string[]; 'commit-msg'?: string | string[] } };

export const define = ({ append = {}, ...rest }: InputConfig = {}): ProcessedConfig => {
  const preCommit = append['pre-commit']
    ? `${DEFAULTS['pre-commit']}\n${Arr.ensure(append['pre-commit']).join('\n')}`
    : DEFAULTS['pre-commit'];
  const commitMsg = append['commit-msg']
    ? `${DEFAULTS['commit-msg']}\n${Arr.ensure(append['commit-msg']).join('\n')}`
    : DEFAULTS['commit-msg'];

  return {
    'pre-commit': preCommit,
    'commit-msg': commitMsg,
    ...Obj.map(rest, (h) => Arr.ensure(h).join('\n'))
  };
};

export const toFileEntry = define;
