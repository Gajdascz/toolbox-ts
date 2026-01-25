export type ScopedFileMergeOp<I> = (
  input: Partial<I>,
  confirmFn?: (merged: Partial<I>) => boolean | Promise<boolean>
) => Promise<void>;
