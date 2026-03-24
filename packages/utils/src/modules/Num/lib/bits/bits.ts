import { BITS } from '../../../../core/constants/nums.js';
import {
  assertIsNumberInEightBitRange,
  assertIsNumberInSixteenBitRange,
  assertIsNumberInThirtyTwoBitRange,
  assertIsNumberInTwentyFourBitRange,
  checkIsNumberInEightBitRange,
  checkIsNumberInSixteenBitRange,
  checkIsNumberInThirtyTwoBitRange,
  checkIsNumberInTwentyFourBitRange
} from '../../../../core/guards/primitives/number/index.js';

//#region> Depths/Ranges
/** 8-bit depth with range [0, 255] */
export const eight = {
  ...BITS.eight,
  /** Checks if a number is within the 8-bit range [0, 255] */
  is: checkIsNumberInEightBitRange,
  /** Asserts that a number is within the 8-bit range [0, 255], throws an error if not */
  assert: assertIsNumberInEightBitRange
} as const;
/** 16-bit depth with range [0, 65,535] */
export const sixteen = {
  ...BITS.sixteen,
  /** Checks if a number is within the 16-bit range [0, 65,535] */
  is: checkIsNumberInSixteenBitRange,
  /** Asserts that a number is within the 16-bit range [0, 65,535], throws an error if not */
  assert: assertIsNumberInSixteenBitRange
} as const;
/** 24-bit depth with range [0, 16,777,215] */
export const twentyFour = {
  ...BITS.twentyFour,
  /** Checks if a number is within the 24-bit range [0, 16,777,215] */
  is: checkIsNumberInTwentyFourBitRange,
  /** Asserts that a number is within the 24-bit range [0, 16,777,215], throws an error if not */
  assert: assertIsNumberInTwentyFourBitRange
} as const;
/** 32-bit depth with range [0, 4,294,967,295] */
export const thirtyTwo = {
  ...BITS.thirtyTwo,
  /** Checks if a number is within the 32-bit range [0, 4,294,967,295] */
  is: checkIsNumberInThirtyTwoBitRange,
  /** Asserts that a number is within the 32-bit range [0, 4,294,967,295], throws an error if not */
  assert: assertIsNumberInThirtyTwoBitRange
} as const;
//#endregion

/** https://en.wikipedia.org/wiki/Bitwise_operation */
//#region> Operations
/**
 * Bitwise NOT (~) inverts all bits of a number.
 * Equivalent to `-a - 1` in two's complement representation.
 */
export const not = (a: number): number => ~a;
/**
 * Bitwise AND (&) compares each bit of two numbers.
 * If both corresponding bits are 1, the result is 1;
 * otherwise, it's 0.
 * This operation is commonly used for masking certain bits in a value.
 */
export const and = (a: number, b: number): number => a & b;
/**
 * Bitwise OR (|) compares each bit of two numbers.
 * If at least one of the bits is 1, the result is 1.
 * This is useful for setting specific bits in a number.
 */
export const or = (a: number, b: number): number => a | b;
/**
 * Bitwise XOR (^) compares each bit of two numbers.
 * If the bits are different (one is 0, the other is 1),
 * the result is 1.
 * This is often used in operations like toggling or comparing bits.
 */
export const xor = (a: number, b: number): number => a ^ b;
//#endregion

/** https://en.wikipedia.org/wiki/Bitwise_operation#Bit_shifts */
//#region> Shift
/**
 * Masks a shift count to ensure it's within the 0–31 range.
 * JavaScript bitwise shift operations only use the
 * lower 5 bits of the shift count,
 * so this is equivalent to `n % 32`, but faster.
 * Prevents undefined behavior from overshifting 32-bit values.
 */
export const mask = (n: number) => n & 31;
/**
 * Shifts the bits of a number to the left by n positions.
 * Each shift to the left effectively multiplies the number by 2.
 * Any bits shifted out of the left side are discarded, and
 * the right side is filled with 0s.
 */
export const left = (a: number, n: number): number => a << n;
/**
 * Shifts the bits of a number to the right by n positions.
 * For signed numbers, this operation preserves the sign bit,
 * so it's known as an arithmetic
 * For positive numbers, this is equivalent to integer division by 2.
 */
export const right = (a: number, n: number): number => a >> n;
/**
 * Shifts the bits of a number to the right by n positions,
 * but it fills the leftmost bits with 0s, regardless of
 * whether the number is signed or unsigned.
 * This is typically used for shifting unsigned binary numbers.
 */
export const zeroFillRight = (a: number, n: number): number => a >>> n;
/**
 * Rotates the bits of a 32-bit number to the left by n positions.
 * Bits shifted out on the left are wrapped around to the right.
 * Only the lower 32 bits of the number are used.
 */
export const rotl = (v: number, count: number) => {
  /** Mask count to prevent over-rotating (v \<\< 32 results in 0) */
  const n = mask(count);
  return left(v, n) | right(v, 32 - n);
};
/**
 * Rotates the bits of a 32-bit number to the right by n positions.
 * Bits shifted out on the right are wrapped around to the left.
 * Only the lower 32 bits of the number are used.
 */
export const rotr = (v: number, count: number) => {
  /** Mask count to prevent over-rotating (v \<\< 32 results in 0) */
  const n = mask(count);
  return right(v, n) | left(v, 32 - n);
};
//#endregion
