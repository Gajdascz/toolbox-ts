/**
 * Callback invoked for each directory during traversal.
 * - Can be asynchronous.
 * - Returning `{ break: true }` will stop the traversal.
 * - The `result` can be a single value or an array of values, which will be collected and returned.
 */
export type OnDirAsync<R> = (dir: string) => OnDirResult<R> | Promise<OnDirResult<R>>;

/**
 * The result of the `onDir` callback.
 * - If `break` is `true`, the traversal will stop.
 * - The `result` can be a single value or an array of values, which will be collected and returned.
 */
export type OnDirResult<R> =
  | { break: true; result: R | R[] }
  | { break?: false | null | undefined; result?: R | R[] };

/**
 * Synchronous version of @see OnDirAsync.
 */
export type OnDirSync<R> = (dir: string) => OnDirResult<R>;
export interface Opts<R> {
  /**
   * An optional directory to stop at (exclusive).
   */
  endDir?: string;
  /**
   * A function to handle results as they are produced.
   * - Defaults to accumulating results in an array.
   * - If `result` is an array, it will be spread into the accumulator.
   * - If `result` is a single value, it will be pushed into the accumulator.
   * - This modifies the curr array in place.
   */
  resultHandler?: (res: R | R[], curr: R[], dir?: string) => void;

  /**
   * The directory to start traversing from (inclusive).
   *
   * @default process.cwd()
   */
  startDir?: string;
}
