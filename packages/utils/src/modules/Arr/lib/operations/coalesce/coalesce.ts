import type { Nullish } from '@toolbox-ts/types';
import type { Arr } from '@toolbox-ts/types/defs/array';

export function coalesceFirst<T extends Arr>(...arrs: (Nullish | T)[]): T {
  for (const arr of arrs) {
    if (arr != null) return [...arr] as T;
  }
  return [] as unknown as T;
}

export function coalesceLast<T extends Arr>(...arrs: (Nullish | T)[]): T {
  for (let i = arrs.length - 1; i >= 0; i--) {
    const arr = arrs[i];
    if (arr != null) return [...arr] as T;
  }
  return [] as unknown as T;
}
