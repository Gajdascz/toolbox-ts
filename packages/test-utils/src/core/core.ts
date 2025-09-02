import { vi } from 'vitest';

const MOCKED_MODULE = Symbol('Module is mocked');

/** Checks if a module has a specific mock token. */
export const isMocked = (module: Record<string | symbol, unknown>): boolean =>
  module[MOCKED_MODULE] === true
  && (!module.default
    || (typeof module.default === 'object'
      && MOCKED_MODULE in module.default
      && (module.default as Record<string | symbol, unknown>)[MOCKED_MODULE]
        === true));

/** Passed to assertMockedEnv to check if a module is mocked. */
export interface MockCheck {
  description: string;
  modulePath: string;
  validate?: (module: Record<string | symbol, unknown>) => string | true;
}

/** Error message for when a required environment variable is not mocked. */
export const mockEnvErr = (desc: string) =>
  `[TEST ENV ERROR]: ${desc} is not mocked. Refusing to run tests.`;

/** Asserts that the environment is mocked correctly, throwing an error if not. */
export const assertMockedEnv = async (
  mockChecks: MockCheck[] = []
): Promise<void> => {
  const errors: string[] = [];
  for (const { validate, description, modulePath } of mockChecks) {
    try {
      const module = (await import(modulePath)) as Record<
        string | symbol,
        unknown
      >;
      /* c8 ignore start */
      if (!isMocked(module)) errors.push(mockEnvErr(description));
      /* c8 ignore end */
      if (validate) {
        const result = validate(module);
        if (result !== true) errors.push(result);
      }
    } catch {
      errors.push(mockEnvErr(description));
    }
  }
  if (errors.length > 0) throw new Error(errors.join('\n'));
};

/** Type representing a mocked export with an optional extension. */
export type ExportedMock<O, Extension = Record<string, unknown>> = {
  __esModule: true;
  default: { [MOCKED_MODULE]: true } & Extension & O;
  [MOCKED_MODULE]: true;
} & Extension
  & O;

/** Wraps a mock export with an optional extension, ensuring it has the correct structure. */
export const wrapMockExport = <O, Extension>(
  mock: O,
  extension: Extension = {} as Extension
): ExportedMock<O, Extension> => {
  return {
    default: { ...mock, ...extension, [MOCKED_MODULE]: true },
    ...mock,
    ...extension,
    __esModule: true,
    [MOCKED_MODULE]: true
  } as ExportedMock<O, Extension>;
};

export type MockedFn = ReturnType<typeof vi.fn>;

/** Represents a mocked module with reset functionality. */
export type MockedModule<M> = {
  [K in keyof M]: M[K] extends (...arguments_: unknown[]) => unknown ? MockedFn
  : M[K] extends Record<string, unknown> ?
    Omit<MockedModule<M[K]>, 'reset' | typeof MOCKED_MODULE>
  : M[K] extends string ? string
  : M[K];
} & { [MOCKED_MODULE]: true; reset: () => void };

/**Recursively resets all mocked functions in an object. */
export function recursiveReset(
  object: Record<string, unknown>,
  seen = new WeakSet()
): void {
  if (seen.has(object)) return;
  seen.add(object);
  for (const value of Object.values(object)) {
    if (typeof value === 'function' && 'mockReset' in value)
      (value as MockedFn).mockReset();
    else if (value && typeof value === 'object')
      recursiveReset(value as Record<string, unknown>, seen);
  }
}

export const dependencyExists = async (importPath: string, log = false) => {
  try {
    await import(importPath);
    return true;
  } catch {
    if (log)
      console.warn(
        `Failed to import ${importPath}. Make sure it's an installed dependency.`
      );
    return false;
  }
};

export const mockKeys = <K extends string>(keys: K[]) =>
  keys.reduce(
    (acc, key) => {
      acc[key] = vi.fn();
      return acc;
    },
    {} as Record<K, MockedFn>
  );
