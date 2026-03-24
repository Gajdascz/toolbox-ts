import { describe, it, expect } from 'vitest';
import { arrayToQueueLike, initQueueLike, type QueueLike } from './queuelike.js';

describe('File queueLike', () => {
  it('arrayToQueueLike()', () => {
    const arr = ['a', 'b', 'c'];
    const q = arrayToQueueLike(arr);
    expect(q.length).toBe(3);
    expect(q.dequeue()).toBe('a');
    expect(q.length).toBe(2);
    q.enqueue('d', 'e');
    expect(q.length).toBe(4);
    expect(q.dequeue()).toBe('b');
    expect(q.dequeue()).toBe('c');
    expect(q.dequeue()).toBe('d');
    expect(q.dequeue()).toBe('e');
    expect(q.dequeue()).toBeUndefined();
    expect(q.length).toBe(0);
    expect(q.clone?.()).not.toBe(q);
  });
  describe('initQueueLike(', () => {
    it('clones the queue if clone method is available', () => {
      let cloneCalls = 0;
      const original: QueueLike = {
        length: 2,
        clone() {
          cloneCalls += 1;
          return {
            dequeue: this.dequeue,
            enqueue: this.enqueue,
            length: this.length,
            cloneCalls: this.cloneCalls,
            clone: this.clone
          };
        },
        dequeue() {
          return 'item';
        },
        enqueue() {}
      };
      const cloned = initQueueLike(original);
      expect(cloned).not.toBe(original);
      expect(cloned?.length).toBe(2);
      expect(cloneCalls).toBe(1);
    });
    it('returns the same queue if no clone method', () => {
      const queue = {
        length: 3,
        dequeue() {
          return 'item';
        },
        enqueue() {}
      };
      const result = initQueueLike(queue);
      expect(result).toBe(queue);
    });
    it('returns an array-based QueueLike if input is an array', () => {
      const arr = ['x', 'y', 'z'];
      const q = initQueueLike(arr);
      expect(q).toBeDefined();
      expect(q?.length).toBe(3);
      expect(q?.dequeue()).toBe('x');
    });
    it('returns a new empty queue if undefined', () => {
      const result = initQueueLike();
      expect(result).toBeDefined();
      expect(result?.length).toBe(0);
    });
  });
});
