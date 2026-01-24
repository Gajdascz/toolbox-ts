import path from 'node:path';

export const defaultResultHandler = <R>(
  res: R | R[],
  curr: R[],
  _?: string
) => {
  if (Array.isArray(res)) curr.push(...res);
  else curr.push(res);
};
export const toParent = (dir: string, end?: null | string) => {
  if (dir === end) return null;
  const parent = path.dirname(dir);
  return parent === dir || parent === end ? null : parent;
};
export const normalizeStartEnd = (
  startDir: string,
  endAtDir?: string
): { end: null | string; start: string } => ({
  start: path.resolve(startDir),
  end: endAtDir ? path.resolve(endAtDir) : null
});
