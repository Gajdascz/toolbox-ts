import type { ToolingRegisterEntry, ToolingMeta, ToolingRegistry } from './types.js';

export const entry = <N extends string>({
  name,
  description,
  repo,
  docs = repo
}: {
  name: N;
  description: string;
  repo: string;
  docs?: string;
}): ToolingRegisterEntry<N> => [name, { description, repo, docs }] as const;

export const entries = <N extends string>(
  ...args: { name: N; description: string; repo: string; docs?: string }[]
): readonly ToolingRegisterEntry<N>[] => args.map(entry);

export const registry = <N extends string, M extends ToolingMeta>(
  entries: ToolingRegisterEntry<N, M>[]
): ToolingRegistry<N, M> =>
  entries.reduce(
    (acc, [name, entry]) => {
      (acc as Record<string, unknown>)[name] = { ...entry, name };
      return acc;
    },
    {} as ToolingRegistry<N, M>
  );
