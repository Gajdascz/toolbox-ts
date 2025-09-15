import { describe, expect, it } from 'vitest';

import { type Depth, is, ops, shift } from './bits.ts';

describe('bits module', () => {
  describe('is.depth', () => {
    it('should return true for valid numeric depths', () => {
      expect(is.depth(8)).toBe(true);
      expect(is.depth(16)).toBe(true);
      expect(is.depth(24)).toBe(true);
      expect(is.depth(32)).toBe(true);
    });
    it('should return true for valid string depths', () => {
      expect(is.depth('8')).toBe(true);
      expect(is.depth('16')).toBe(true);
      expect(is.depth('24')).toBe(true);
      expect(is.depth('32')).toBe(true);
    });
    it('should return false for invalid depths', () => {
      expect(is.depth(7)).toBe(false);
      expect(is.depth('7')).toBe(false);
      expect(is.depth('foo')).toBe(false);
      expect(is.depth(undefined)).toBe(false);
      expect(is.depth(null)).toBe(false);
    });
  });

  describe('is.inDepth', () => {
    it('should return true for values within depth max', () => {
      expect(is.inDepth(8, 255)).toBe(true);
      expect(is.inDepth('8', '255')).toBe(true);
      expect(is.inDepth(16, 65_535)).toBe(true);
      expect(is.inDepth(24, 16_777_215)).toBe(true);
      expect(is.inDepth(32, 4_294_967_295)).toBe(true);
    });
    it('should return false for values above depth max', () => {
      expect(is.inDepth(8, 256)).toBe(false);
      expect(is.inDepth(16, 65_536)).toBe(false);
      expect(is.inDepth(24, 16_777_216)).toBe(false);
      expect(is.inDepth(32, 4_294_967_296)).toBe(false);
    });
    it('should return false for invalid depth', () => {
      expect(is.inDepth(7 as Depth, 255)).toBe(false);
      expect(is.inDepth('7' as Depth, 255)).toBe(false);
    });
    it('should handle string values', () => {
      expect(is.inDepth(8, '255')).toBe(true);
      expect(is.inDepth(8, '256')).toBe(false);
    });
  });

  describe('ops', () => {
    it('should perform bitwise AND', () => {
      expect(ops.and(5, 3)).toBe(1); // 0101 & 0011 = 0001
    });
    it('should perform bitwise OR', () => {
      expect(ops.or(5, 3)).toBe(7); // 0101 | 0011 = 0111
    });
    it('should perform bitwise XOR', () => {
      expect(ops.xor(5, 3)).toBe(6); // 0101 ^ 0011 = 0110
    });
    it('should perform bitwise NOT', () => {
      expect(ops.not(5)).toBe(~5);
    });
  });

  describe('shift', () => {
    it('mask should keep only lower 5 bits', () => {
      expect(shift.mask(0)).toBe(0);
      expect(shift.mask(31)).toBe(31);
      expect(shift.mask(32)).toBe(0);
      expect(shift.mask(33)).toBe(1);
      expect(shift.mask(63)).toBe(31);
    });

    it('left should shift bits left', () => {
      expect(shift.left(1, 2)).toBe(4);
    });

    it('right should shift bits right (arithmetic)', () => {
      expect(shift.right(4, 2)).toBe(1);
      expect(shift.right(-8, 2)).toBe(-2);
    });

    it('zeroFillRight should shift bits right (logical)', () => {
      expect(shift.zeroFillRight(4, 2)).toBe(1);
      expect(shift.zeroFillRight(-8, 2)).toBe(1_073_741_822);
    });

    it('rotl should rotate bits left', () => {
      expect(shift.rotl(0x12_34_56_78, 8)).toBe(0x34_56_78_12);
      expect(shift.rotl(0x12_34_56_78, 0)).toBe(0x12_34_56_78);
      expect(shift.rotl(0x12_34_56_78, 32)).toBe(0x12_34_56_78);
    });

    it('rotr should rotate bits right', () => {
      expect(shift.rotr(0x12_34_56_78, 8)).toBe(0x78_12_34_56);
      expect(shift.rotr(0x12_34_56_78, 0)).toBe(0x12_34_56_78);
      expect(shift.rotr(0x12_34_56_78, 32)).toBe(0x12_34_56_78);
    });
  });
});
