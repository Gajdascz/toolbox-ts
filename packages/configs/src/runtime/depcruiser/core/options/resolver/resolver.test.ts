import { beforeEach, describe, expect, it, vi } from 'vitest';

import * as handlers from './handlers/index.js';
import { resolve } from './resolver.js';

vi.mock('./handlers/index.ts', () => ({
  handleAffected: vi.fn(),
  handleReporter: vi.fn()
}));

describe('resolver.ts', () => {
  const mockHandleAffected = vi.mocked(handlers.handleAffected);

  beforeEach(() => {
    mockHandleAffected.mockClear();
  });

  describe('resolve', () => {
    it('should return options unchanged when no affected is provided', async () => {
      const options = { outputType: 'json' as const };

      const result = await resolve(options);

      expect(result.outputType).toEqual('json');
      expect(mockHandleAffected).toHaveBeenCalled();
      expect(result.affected).toBeUndefined();
      expect(result.reaches).toBeUndefined();
    });

    it('should resolve affected and set reaches when affected is provided', async () => {
      mockHandleAffected.mockResolvedValue('file1.ts|file2.ts');

      const result = await resolve({ affected: true });

      expect(mockHandleAffected).toHaveBeenCalledWith(true);
      expect(result.affected).toBeUndefined();
      expect(result.reaches).toBe('file1.ts|file2.ts');
    });

    it('should preserve other options when resolving affected', async () => {
      mockHandleAffected.mockResolvedValue('src/.*');

      const result = await resolve({
        affected: 'main',
        outputType: 'dot',
        validate: true
      });
      expect(result.outputType).toBe('dot');
      expect(result.validate).toBe(true);
      expect(result.affected).toBeUndefined();
      expect(result.reaches).toBe('src/.*');
    });

    it('should not set reaches when handleAffected returns undefined', async () => {
      mockHandleAffected.mockResolvedValue(undefined);

      const result = await resolve({ affected: true });

      expect(result.affected).toEqual(undefined);
      expect(result.reaches).toEqual(undefined);
    });

    it('should resolve doNotFollowPath when provided', async () => {
      const result = await resolve({ doNotFollow: { path: ['custom'] } });
      expect((result.doNotFollow as any).path).toContain('custom');
      const result2 = await resolve({ doNotFollow: { path: 'custom' } });
      expect((result2.doNotFollow as any).path).toContain('custom');
    });
  });
});
