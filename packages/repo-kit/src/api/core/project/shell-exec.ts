/* c8 ignore start */
import { execa, type Options } from 'execa';

export const $shell = execa({ shell: true });
export const $pnpm = (cmd: string, opts: Options = {}) =>
  $shell(`pnpm ${cmd}`, opts);
/* c8 ignore end */
