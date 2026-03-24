import path from 'node:path';

export const defaultResultHandler = <R>(res: R | R[], curr: R[], _?: string) => {
  if (Array.isArray(res)) curr.push(...res);
  else curr.push(res);
};
export const toParent = (dir: string, end?: null | string) => {
  if (dir === end) return null;
  const parent = path.dirname(dir);
  return !parent || parent === dir || parent === end ? null : parent;
};
export const normalizeStartEnd = (
  direction: 'up' | 'down',
  startDir: string,
  endAtDir?: string
): { end: null | string; start: string } => {
  const start = path.resolve(startDir);
  const end = endAtDir ? path.resolve(endAtDir) : null;
  if (end) {
    if (direction === 'up' && !start.startsWith(end))
      throw new Error(
        `End directory "${end}" must be a parent directory of the start directory "${start}".`
      );
    else if (direction === 'down' && !end.startsWith(start))
      throw new Error(
        `End directory "${end}" must be a subdirectory of the start directory "${start}".`
      );
  }
  return { start, end };
};
