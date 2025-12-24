export const dedupeArrays = <V>(...arrays: readonly (readonly V[])[]): V[] => [
  ...new Set(arrays.flat())
];
export const toArray = <V>(input?: V | V[]) =>
  input === undefined || input === null ? []
  : Array.isArray(input) ? input
  : [input];

export const when = <T>(condition: unknown, value: T) =>
  condition ? value : undefined;

const internalMerge = (a: unknown, b: unknown): unknown => {
  if (b === undefined || b === null) return a;

  if (Array.isArray(a)) return dedupeArrays(a, toArray(b));

  if (typeof a !== 'object' || a === null || typeof b !== 'object') return b;
  for (const key of Object.keys(b as Record<string, unknown>)) {
    (a as Record<string, unknown>)[key] = internalMerge(
      a[key as keyof typeof a],
      (b as keyof typeof b)[key]
    );
  }
  return a;
};

export const merge = <V>(a: unknown, b?: unknown, mutate = false): V =>
  internalMerge(mutate ? a : structuredClone(a), b) as V;
