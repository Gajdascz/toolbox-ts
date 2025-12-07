export const ARRAYS = {
  ALL_IGNORES: [
    '**/node_modules/**',
    '**/dist/**',
    '**/build/**',
    '**/docs/**'
  ],
  DEV_DIRS: ['dev', '_dev', 'tools', '_tools'],
  EXTS: ['ts', 'tsx', 'js', 'jsx', 'mjs', 'cjs'],
  SRC_DIRS: ['src', 'packages', 'apps', 'bin', 'app', 'package'],
  TEST_FILES: ['test', 'spec', 'bench']
} as const;
export const GLOBS = {
  DEV_DIRS: `{${ARRAYS.DEV_DIRS.join(',')}}`,
  EXTS: `{${ARRAYS.EXTS.join(',')}}`,
  SRC_DIRS: `{${ARRAYS.SRC_DIRS.join(',')}}`,
  TEST_FILES: `{${ARRAYS.TEST_FILES.join(',')}}`
} as const;
