import { findConfigFile } from 'typescript';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getTsconfigPath } from './get-tsconfig-path.js';

vi.mock('typescript', () => ({
  findConfigFile: vi.fn(),
  sys: { fileExists: vi.fn() }
}));

describe('getTsconfigPath', () => {
  const mockFindConfigFile = vi.mocked(findConfigFile);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return tsconfig path when file is found', () => {
    const expectedPath = '/path/to/tsconfig.json';
    mockFindConfigFile.mockReturnValue(expectedPath);

    const result = getTsconfigPath('tsconfig.json');

    expect(result).toBe(expectedPath);
    expect(mockFindConfigFile).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(Function),
      'tsconfig.json'
    );
  });

  it('should use custom start directory when provided', () => {
    const expectedPath = '/path/to/tsconfig.json';
    const customStart = '/custom/start/path';
    mockFindConfigFile.mockReturnValue(expectedPath);

    const result = getTsconfigPath('tsconfig.json', customStart);

    expect(result).toBe(expectedPath);
    expect(mockFindConfigFile).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(Function),
      'tsconfig.json'
    );
  });

  it('should throw error when tsconfig file is not found', () => {
    mockFindConfigFile.mockReturnValue(undefined);

    expect(() => getTsconfigPath('tsconfig.json')).toThrow(
      'Could not find tsconfig file: tsconfig.json'
    );
  });

  it('should work with different tsconfig filenames', () => {
    const expectedPath = '/path/to/tsconfig.build.json';
    mockFindConfigFile.mockReturnValue(expectedPath);

    const result = getTsconfigPath('tsconfig.build.json');

    expect(result).toBe(expectedPath);
    expect(mockFindConfigFile).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(Function),
      'tsconfig.build.json'
    );
  });
});
