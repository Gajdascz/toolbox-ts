export const TS = ['ts', 'tsx'] as const;
export const JS = ['js', 'jsx', 'cjs', 'mjs'] as const;
export const SRC = [...TS, ...JS] as const;
export type SrcFileExt = (typeof SRC)[number];

export const JSON = ['json', 'jsonc', 'json5'] as const;
export const YAML = ['yaml', 'yml'] as const;

export const DATA = [
  ...JSON,
  ...YAML,
  'txt',
  'toml',
  'csv',
  'xml',
  'md'
] as const;
export type DataFileExt = (typeof DATA)[number];

export const TEST_SUFFIXES = [
  'test',
  'test-d',
  'spec',
  'bench',
  'mock',
  'int',
  'integration',
  'unit'
] as const;
export type TestFileSuffix = (typeof TEST_SUFFIXES)[number];

export const TS_BUILD_INFO = 'tsbuildinfo';
export type TsBuildInfoExt = typeof TS_BUILD_INFO;
export type TsBuildInfoFile<N extends string = 'tsconfig'> =
  `${N}.${TsBuildInfoExt}`;
