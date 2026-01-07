/**
 * A tuple type representing a pair of strings that map to [truthy, falsy] values.
 *
 * @template T - The truthy string value.
 * @template F - The falsy string value.
 * @example
 * ```ts
 * type ActiveInactive = BoolishPair<'active', 'inactive'> // ['active', 'inactive']
 * type OnOff = BoolishPair<'on', 'off'> // ['on', 'off']
 * ```
 */
export type BoolishPair<T extends string, F extends string> = readonly [
  truthy: T,
  falsy: F
];
//#endregion

//#region> Pairs
export type ActiveInactive = BoolishPair<'active', 'inactive'>;
export type AllowDeny = BoolishPair<'allow', 'deny'>;
export type AllowedDenied = BoolishPair<'allowed', 'denied'>;
export type EnabledDisabled = BoolishPair<'enabled', 'disabled'>;
export type OnOff = BoolishPair<'on', 'off'>;
export type OpenClosed = BoolishPair<'open', 'closed'>;
export type PassFail = BoolishPair<'pass', 'fail'>;
export type PresentAbsent = BoolishPair<'present', 'absent'>;
export type SuccessError = BoolishPair<'success', 'error'>;
export type TF = BoolishPair<'t', 'f'>;
export type TrueFalse = BoolishPair<'true', 'false'>;
export type YesNo = BoolishPair<'yes', 'no'>;
export type YN = BoolishPair<'y', 'n'>;
export type ZeroOne = BoolishPair<'1', '0'>;
//#endregion
/**
 * A union type representing all supported Boolish string values.
 */
export type Boolish = {
  [K in BoolishPairType]: BoolishPairMap[K];
}[BoolishPairType];

/**
 * Mapping of Boolish pair types to their corresponding truthy and falsy string values.
 */
export interface BoolishPairMap {
  activeInactive: ActiveInactive;
  allowDeny: AllowDeny;
  allowedDenied: AllowedDenied;
  enabledDisabled: EnabledDisabled;
  onOff: OnOff;
  openClosed: OpenClosed;
  passFail: PassFail;
  presentAbsent: PresentAbsent;
  successError: SuccessError;
  tf: TF;
  trueFalse: TrueFalse;
  yesNo: YesNo;
  yn: YN;
  zeroOne: ZeroOne;
}

export type BoolishPairType = keyof BoolishPairMap;
/**
 * A union type representing all falsy string values from the Boolish pairs.
 */
export type Falsy = FalsyMap[BoolishPairType];
export type FalsyMap = { [K in BoolishPairType]: BoolishPairMap[K][1] };
/**
 *  A union type representing all truthy string values from the Boolish pairs.
 */
export type Truthy = TruthyMap[BoolishPairType];
export type TruthyMap = { [K in BoolishPairType]: BoolishPairMap[K][0] };
