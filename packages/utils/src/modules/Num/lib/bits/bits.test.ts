import { describe, expect, it } from 'vitest';

import {
  and,
  left,
  mask,
  not,
  or,
  right,
  rotl,
  rotr,
  xor,
  zeroFillRight
} from './bits.ts';

describe('bits module', () => {
  describe('operations', () => {
    it('should perform bitwise AND', () => {
      expect(and(5, 3)).toBe(1); // 0101 & 0011 = 0001
    });
    it('should perform bitwise OR', () => {
      expect(or(5, 3)).toBe(7); // 0101 | 0011 = 0111
    });
    it('should perform bitwise XOR', () => {
      expect(xor(5, 3)).toBe(6); // 0101 ^ 0011 = 0110
    });
    it('should perform bitwise NOT', () => {
      expect(not(5)).toBe(~5);
    });
  });

  describe('shift', () => {
    it('mask should keep only lower 5 bits', () => {
      expect(mask(0)).toBe(0);
      expect(mask(31)).toBe(31);
      expect(mask(32)).toBe(0);
      expect(mask(33)).toBe(1);
      expect(mask(63)).toBe(31);
    });

    it('left should shift bits left', () => {
      expect(left(1, 2)).toBe(4);
    });

    it('right should shift bits right (arithmetic)', () => {
      expect(right(4, 2)).toBe(1);
      expect(right(-8, 2)).toBe(-2);
    });

    it('zeroFillRight should shift bits right (logical)', () => {
      expect(zeroFillRight(4, 2)).toBe(1);
      expect(zeroFillRight(-8, 2)).toBe(1_073_741_822);
    });

    it('rotl should rotate bits left', () => {
      expect(rotl(0x12_34_56_78, 8)).toBe(0x34_56_78_12);
      expect(rotl(0x12_34_56_78, 0)).toBe(0x12_34_56_78);
      expect(rotl(0x12_34_56_78, 32)).toBe(0x12_34_56_78);
    });

    it('rotr should rotate bits right', () => {
      expect(rotr(0x12_34_56_78, 8)).toBe(0x78_12_34_56);
      expect(rotr(0x12_34_56_78, 0)).toBe(0x12_34_56_78);
      expect(rotr(0x12_34_56_78, 32)).toBe(0x12_34_56_78);
    });
  });
});
