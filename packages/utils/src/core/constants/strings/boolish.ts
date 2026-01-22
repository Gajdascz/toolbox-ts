import type { StringRecord } from '@toolbox-ts/types/defs/object';
import type {
  BoolishPairMap,
  FalsyMap,
  TruthyMap
} from '@toolbox-ts/types/defs/string';

export const PAIRS: BoolishPairMap = {
  tf: ['t', 'f'],
  trueFalse: ['true', 'false'],
  yesNo: ['yes', 'no'],
  yn: ['y', 'n'],
  zeroOne: ['1', '0'],
  activeInactive: ['active', 'inactive'],
  allowDeny: ['allow', 'deny'],
  allowedDenied: ['allowed', 'denied'],
  enabledDisabled: ['enabled', 'disabled'],
  onOff: ['on', 'off'],
  openClosed: ['open', 'closed'],
  passFail: ['pass', 'fail'],
  presentAbsent: ['present', 'absent'],
  successError: ['success', 'error']
} as const;
export const TRUTHY: TruthyMap = Object.keys(PAIRS).reduce<TruthyMap>(
  (acc, key) => {
    (acc as StringRecord)[key] = PAIRS[key as keyof BoolishPairMap][0];
    return acc;
  },
  {} as TruthyMap
);
export const FALSY: FalsyMap = Object.keys(PAIRS).reduce<FalsyMap>(
  (acc, key) => {
    (acc as StringRecord)[key] = PAIRS[key as keyof BoolishPairMap][1];
    return acc;
  },
  {} as FalsyMap
);
