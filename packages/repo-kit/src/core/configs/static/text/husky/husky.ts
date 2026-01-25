// export const getGitHookPath = (
//   hookName: keyof typeof GIT_HOOKS,
//   dir = process.cwd()
// ) => `${dir}/${DIR}/${GIT_HOOKS[hookName]}`;
// export const writeToGitHook = (
//   hookName: keyof typeof GIT_HOOKS,
//   content: string,
//   dir = process.cwd()
// ) => $shell(`echo ${content} > ${getGitHookPath(hookName, dir)}`);
// export const init = async () => $pnpm('husky init');

// export const getEntry = ({
//   dir,
//   hooks
// }: Config = {}): OrchestratorConfigEntry => ({
//   dependencies: [[PKG_NAME, { isDev: true }]],
//   async postProcess() {
//     await $pnpm('husky init');
//     if (hooks) {
//       for (const [hookName, fileContentLines] of hooks)
//         await writeToGitHook(hookName, fileContentLines.join('\n'), dir);
//     }
//   }
// });

import type { GitHook } from '../../../../../../core/index.js';

/**
 * Configuration for Husky Git hooks.
 * Each key is a Git hook name (husky directory file),
 * and the value is the command(s) to run (file content).
 * @example
 * ```ts
 * import { husky } from '@toolbox-ts/configs';
 *
 * export default husky.define({
 *   'pre-commit': 'pnpm lint-staged',
 *   'commit-msg': 'pnpm commitlint --edit $1',
 *   'pre-push': ['pnpm test', 'pnpm build'],
 * });
 * ```
 */
export type Config = { [H in GitHook]?: string[] | string | readonly string[] };
export const define = (config: Config): Config => config;
