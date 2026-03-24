export interface ToolingMeta {
  name: string;
  description: string;
  docs: string;
  repo: string;
}
export type ToolingRegistry<N extends string, M extends ToolingMeta = ToolingMeta> = {
  readonly [K in N]: M;
};
export type ToolingRegisterEntry<N extends string, M extends ToolingMeta = ToolingMeta> = readonly [
  name: N,
  meta: Omit<M, 'name'>
];
