/**
 * Predefined numeric intervals for various ranges.
 */
export const INTERVALS = {
  unit: [0, 1],
  byte: [0, 1024],
  digit: [-9, 9],
  negativeDigit: [-9, -1],
  positiveDigit: [1, 9],
  eightBit: [0, 255],
  sixteenBit: [0, 65_535],
  twentyFourBit: [0, 16_777_215],
  thirtyTwoBit: [0, 4_294_967_295]
} as const;

/** Predefined bit depths and their corresponding numeric ranges. */
export const BITS = {
  /** 8-bit depth with range [0, 255] */
  eight: {
    /** The bit depth (8) */
    depth: 8,
    /** The minimum value for eight-bit depth (0) */
    min: INTERVALS.eightBit[0],
    /** The maximum value for eight-bit depth (255) */
    max: INTERVALS.eightBit[1]
  },
  /** 16-bit depth with range [0, 65,535] */
  sixteen: { depth: 16, min: INTERVALS.sixteenBit[0], max: INTERVALS.sixteenBit[1] },
  twentyFour: {
    /** 24-bit depth with range [0, 16,777,215] */
    depth: 24,
    /** The minimum value for 24-bit depth (0) */
    min: INTERVALS.twentyFourBit[0],
    /** The maximum value for 24-bit depth (16,777,215) */
    max: INTERVALS.twentyFourBit[1]
  },
  /** 32-bit depth with range [0, 4,294,967,295] */
  thirtyTwo: {
    /** The bit depth (32) */
    depth: 32,
    /** The minimum value for 32-bit depth (0) */
    min: INTERVALS.thirtyTwoBit[0],
    /** The maximum value for 32-bit depth (4,294,967,295) */
    max: INTERVALS.thirtyTwoBit[1]
  }
} as const;
