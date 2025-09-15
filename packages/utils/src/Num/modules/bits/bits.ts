import * as Base from '../base/index.js';

/** 8-bit (1-byte) depth and max value. */
const eight = { depth: 8, max: 255 } as const;
/** 16-bit (2-byte) depth and max value. */
const sixteen = { depth: 16, max: 65_535 } as const;
/** 24-bit (3-byte) depth and max value. */
const twentyFour = { depth: 24, max: 16_777_215 } as const;
/** 32-bit (4-byte) depth and max value. */
const thirtyTwo = { depth: 32, max: 4_294_967_295 } as const;

/** Mapping of bit depths to their corresponding config. */
const map = {
  '8': eight,
  '16': sixteen,
  '24': twentyFour,
  '32': thirtyTwo
} as const;

/** Type representing valid bit depths. */
type Depth = '16' | '24' | '32' | '8' | 16 | 24 | 32 | 8;

const is = {
  /** Checks if a value is a valid bit depth (8, 16, 24, or 32). */
  depth: (value: number | string): value is Depth =>
    (Base.is.stringNumber(value) ? value : String(value)) in map,
  /** Checks if a value is a number within the range of the specified bit depth. */
  inDepth: (depth: Depth, value: unknown): value is number => {
    if (
      !(String(depth) in map)
      || !(typeof value === 'number' || Base.is.stringNumber(value))
    )
      return false;
    const parsed = Number.parseInt(String(depth), 10);
    return parsed >= 0 && parsed <= map[depth].max;
  }
} as const;

/** https://en.wikipedia.org/wiki/Bitwise_operation */
const ops = {
  /**
   * Bitwise AND (&) compares each bit of two numbers.
   * If both corresponding bits are 1, the result is 1;
   * otherwise, it's 0.
   * This operation is commonly used for masking certain bits in a value.
   */
  and: (a: number, b: number): number => a & b,
  /**
   * Bitwise OR (|) compares each bit of two numbers.
   * If at least one of the bits is 1, the result is 1.
   * This is useful for setting specific bits in a number.
   */
  or: (a: number, b: number): number => a | b,
  /**
   * Bitwise XOR (^) compares each bit of two numbers.
   * If the bits are different (one is 0, the other is 1),
   * the result is 1.
   * This is often used in operations like toggling or comparing bits.
   */
  xor: (a: number, b: number): number => a ^ b,
  /**
   * Bitwise NOT (~) inverts all bits of a number.
   * Equivalent to `-a - 1` in two's complement representation.
   */
  not: (a: number): number => ~a
} as const;
/** https://en.wikipedia.org/wiki/Bitwise_operation#Bit_shifts */
const shift = {
  /**
   * Masks a shift count to ensure it's within the 0–31 range.
   * JavaScript bitwise shift operations only use the
   * lower 5 bits of the shift count,
   * so this is equivalent to `n % 32`, but faster.
   * Prevents undefined behavior from overshifting 32-bit values.
   */
  mask: (n: number) => n & 31,
  /**
   * Shifts the bits of a number to the left by n positions.
   * Each shift to the left effectively multiplies the number by 2.
   * Any bits shifted out of the left side are discarded, and
   * the right side is filled with 0s.
   */
  left: (a: number, n: number): number => a << n,
  /**
   * Shifts the bits of a number to the right by n positions.
   * For signed numbers, this operation preserves the sign bit,
   * so it's known as an arithmetic shift.
   * For positive numbers, this is equivalent to integer division by 2.
   */
  right: (a: number, n: number): number => a >> n,
  /**
   * Shifts the bits of a number to the right by n positions,
   * but it fills the leftmost bits with 0s, regardless of
   * whether the number is signed or unsigned.
   * This is typically used for shifting unsigned binary numbers.
   */
  zeroFillRight: (a: number, n: number): number => a >>> n,

  /**
   * Rotates the bits of a 32-bit number to the left by n positions.
   * Bits shifted out on the left are wrapped around to the right.
   * Only the lower 32 bits of the number are used.
   */
  rotl: (v: number, count: number) => {
    /** Mask count to prevent over-rotating (v \<\< 32 results in 0) */
    const n = shift.mask(count);
    return shift.left(v, n) | shift.right(v, 32 - n);
  },
  /**
   * Rotates the bits of a 32-bit number to the right by n positions.
   * Bits shifted out on the right are wrapped around to the left.
   * Only the lower 32 bits of the number are used.
   */
  rotr: (v: number, count: number) => {
    /** Mask count to prevent over-rotating (v \<\< 32 results in 0) */
    const n = shift.mask(count);
    return shift.right(v, n) | shift.left(v, 32 - n);
  }
} as const;

export {
  type Depth,
  eight,
  is,
  map,
  ops,
  shift,
  sixteen,
  thirtyTwo,
  twentyFour
};
