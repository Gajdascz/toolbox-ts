export interface TopoSortOptions<T> {
  /**
   * Function to get the unique identifier of an item (what's found in getDeps).
   */
  getId: (item: T) => string;
  /**
   * Function to get the dependencies of an item by its identifier.
   */
  getDeps: (item: T) => string[];
  /** If false, deps not present in the input array are silently skipped. @default true */
  strict?: boolean;
}

/**
 * Orders items based on their dependency relationships.
 * - Uses Depth-First Search (DFS) to determine the order.
 *
 * Throws Reference Error when:
 *    - An item has a circular dependency.
 *    - A dependency is not found in the input set and strict mode is enabled.
 *
 * @example
 * ```ts
 * [a] → [b] ← [c]
 *  ↓  ↙  ↑  ↗
 * [d] → [e]   [f]
 *
 * topoSort({ a: [b,d] },  { b: [d] }, { c: [b] }, { d: [e] }, { e: [f] },  { f: [] })
 * // result: [{ f: [] }, { e: [f] }, { d: [e] }, { b: [d] }, { a: [b,d] }, { c: [b] }]
 * ```
 */
export function topoSort<T>(items: T[], options: TopoSortOptions<T>): T[] {
  const { getId, getDeps, strict = true } = options;

  const itemMap = new Map(items.map((item) => [getId(item), item]));
  const idSet = new Set(itemMap.keys());
  const visited = new Set<string>();
  const visiting = new Set<string>();
  const result: T[] = [];

  function visit(item: T): void {
    const id = getId(item);
    if (visited.has(id)) return;
    if (visiting.has(id)) throw new ReferenceError(`Circular dependency detected: ${id}`);
    visiting.add(id);
    for (const depId of getDeps(item)) {
      if (!idSet.has(depId)) {
        if (strict)
          throw new ReferenceError(`${id} depends on ${depId} which is not in the input set.`);
        continue;
      }
      visit(itemMap.get(depId)!);
    }
    visiting.delete(id);
    visited.add(id);
    result.push(item);
  }

  for (const item of items) visit(item);
  return result;
}
