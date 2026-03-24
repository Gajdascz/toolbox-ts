import { Arr } from '@toolbox-ts/utils';
import { Traverse } from '../../../../traverse/index.js';
import { tryCatch, tryCatchSync } from '../../../../../result.js';
import type { FindDirection, FindResult, FindTarget, WhenOpts } from '../../types.js';
import { FindError } from '../../error.js';
import path from 'node:path';
export const tryBaseWhen = async <R = string>(
  find: (dir: string) => FindResult<R> | Promise<FindResult<R>>,
  resolver: (res: FindResult<R>) => Traverse.OnDirResult<R>,
  target: 'first' | 'last',
  opts: Partial<WhenOpts> = {}
) => {
  const { direction, endDir, startDir } = resolveWhenOpts(opts);
  return tryCatch<R | null, FindError>(
    async () => {
      const traverse = direction === 'up' ? Traverse.tryUp : Traverse.tryDown;
      const traverseResult = await traverse(async (dir) => resolver(await find(dir)), {
        startDir,
        endDir
      });
      if (!traverseResult.ok) throw traverseResult.error;
      return Arr.at(traverseResult.detail, target === 'first' ? 0 : -1, null);
    },
    /* c8 ignore next */
    (e) => new FindError({ direction, endDir, startDir, target }, e)
  );
};
export const tryBaseWhenSync = <R = string>(
  find: (dir: string) => FindResult<R>,
  resolver: (res: FindResult<R>) => Traverse.OnDirResult<R>,
  target: 'first' | 'last',
  opts: Partial<WhenOpts> = {}
) => {
  const { direction, endDir, startDir } = resolveWhenOpts(opts);
  return tryCatchSync<R | null, FindError>(
    () => {
      const traverse = direction === 'up' ? Traverse.tryUpSync : Traverse.tryDownSync;
      const traverseResult = traverse((dir) => resolver(find(dir)), { startDir, endDir });
      if (!traverseResult.ok) throw traverseResult.error;
      return traverseResult.detail.at(target === 'first' ? 0 : -1) ?? null;
    },
    /* c8 ignore next */
    (e) => new FindError({ direction, startDir, target, endDir }, e)
  );
};
export const resolveFirstResult = <R = string>(result: FindResult<R>): Traverse.OnDirResult<R> =>
  ({ break: !!result, ...resolveResult(result) }) as Traverse.OnDirResult<R>;
export const resolveResult = <R = string>(result: FindResult<R>): Traverse.OnDirResult<R> => ({
  result: result === false ? undefined : result
});
export const resolveWhenOpts = (
  opts: Partial<WhenOpts & { target?: FindTarget }> = {}
): { startDir: string; endDir?: string; direction: FindDirection } => {
  const startDir = opts.startDir ?? process.cwd();
  const direction = opts.direction ?? 'up';
  const endDir = opts.endDir ?? (direction === 'up' ? path.parse(startDir).root : undefined);
  return { startDir, endDir, direction };
};
