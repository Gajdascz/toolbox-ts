/**
 * A simple queue-like structure for managing a list of items with enqueue and dequeue operations.
 */
export interface QueueLike<T = string> {
  clone?: () => QueueLike<T>;
  dequeue: () => T | undefined;
  enqueue: (...dirs: T[]) => void;
  length: number;
}
/**
 * Convert an array to a QueueLike structure.
 *
 * @example
 * ```ts
 * const q = arrayToQueueLike(['a', 'b', 'c']);
 * console.log(q.length); // 3
 * console.log(q.dequeue()); // 'a'
 * q.enqueue('d');
 * console.log(q.length); // 3
 * ```
 */
export const arrayToQueueLike = <T = string>(arr: T[] = []): QueueLike<T> => {
  const q = [...arr];
  return {
    clone: () => arrayToQueueLike(q),
    dequeue: () => q.shift(),
    enqueue: (...dirs: T[]) => q.push(...dirs),
    get length() {
      return q.length;
    }
  };
};
/**
 * Initialize a QueueLike structure from either an existing QueueLike or an array.
 * - If an array is provided, it converts it to a QueueLike using {@link arrayToQueueLike}.
 * - If a QueueLike is provided, it clones it if a `clone` method is available; otherwise, it returns the original QueueLike.
 *
 * @example
 * ```ts
 * const q1 = initQueueLike(['a', 'b', 'c']);
 * console.log(q1.length); // 3
 * console.log(q1.dequeue()); // 'a'
 *
 * const originalQueue: QueueLike = {
 *   length: 2,
 *   dequeue() { return 'x'; },
 *   enqueue(...dirs: string[]) { this.length += dirs.length; }
 * };
 * const q2 = initQueueLike(originalQueue);
 * console.log(q2.length); // 2
 * console.log(q2.dequeue()); // 'x'
 * ```
 */
export const initQueueLike = <T = string>(queue?: QueueLike<T> | T[]): QueueLike<T> =>
  Array.isArray(queue) || !queue ? arrayToQueueLike(queue) : queue.clone ? queue.clone() : queue;
