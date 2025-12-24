export type FileContentResolver<TLoaded, TResolved = TLoaded> = (
  parsed: Partial<TLoaded> | TLoaded
) => null | TResolved;

export type FileContentResolverArg<T> = Parameters<FileContentResolver<T>>[0];
