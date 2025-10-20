/* c8 ignore start */
//#region> Keys
const VALID_KEYS = ['a', 'b', 'c', 'd'] as const;
export type ValidKey = (typeof VALID_KEYS)[number];
const INVALID_KEYS = ['w', 'x', 'y', 'z'] as const;
export const KEYS = { valid: VALID_KEYS, invalid: INVALID_KEYS };
//#endregion

//#region> Values
const NUM_VALUES = [1, 2, 3, 4] as const;
const STR_VALUES = ['one', 'two', 'three', 'four'] as const;
const MIXED_VALUES = [
  NUM_VALUES[0],
  STR_VALUES[1],
  NUM_VALUES[2],
  STR_VALUES[3]
] as const;
export const VALUES = {
  nums: NUM_VALUES,
  strs: STR_VALUES,
  mixed: MIXED_VALUES
} as const;
//#endregion

//#region> Collections
export const TUPLES = {
  nums: [
    [VALID_KEYS[0], NUM_VALUES[0]],
    [VALID_KEYS[1], NUM_VALUES[1]],
    [VALID_KEYS[2], NUM_VALUES[2]],
    [VALID_KEYS[3], NUM_VALUES[3]]
  ],
  strs: [
    [VALID_KEYS[0], STR_VALUES[0]],
    [VALID_KEYS[1], STR_VALUES[1]],
    [VALID_KEYS[2], STR_VALUES[2]],
    [VALID_KEYS[3], STR_VALUES[3]]
  ],
  mixed: [
    [VALID_KEYS[0], MIXED_VALUES[0]],
    [VALID_KEYS[1], MIXED_VALUES[1]],
    [VALID_KEYS[2], MIXED_VALUES[2]],
    [VALID_KEYS[3], MIXED_VALUES[3]]
  ]
} as const;
export const RECORDS = {
  nums: {
    [VALID_KEYS[0]]: NUM_VALUES[0],
    [VALID_KEYS[1]]: NUM_VALUES[1],
    [VALID_KEYS[2]]: NUM_VALUES[2],
    [VALID_KEYS[3]]: NUM_VALUES[3]
  },
  strs: {
    [VALID_KEYS[0]]: STR_VALUES[0],
    [VALID_KEYS[1]]: STR_VALUES[1],
    [VALID_KEYS[2]]: STR_VALUES[2],
    [VALID_KEYS[3]]: STR_VALUES[3]
  },
  mixed: {
    [VALID_KEYS[0]]: MIXED_VALUES[0],
    [VALID_KEYS[1]]: MIXED_VALUES[1],
    [VALID_KEYS[2]]: MIXED_VALUES[2],
    [VALID_KEYS[3]]: MIXED_VALUES[3]
  }
} as const;
//#endregion
export const GET = {
  keyNumValue: (key: ValidKey) => RECORDS.nums[key],
  keyStrValue: (key: ValidKey) => RECORDS.strs[key],
  keyMixedValue: (key: ValidKey) => RECORDS.mixed[key]
} as const;
/* c8 ignore end */
