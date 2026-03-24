import { beforeEach, describe, expect, it, vi } from 'vitest';
import { EXTS } from '@toolbox-ts/constants/fs';
import * as watskeburt from 'watskeburt';
import { AFFECTED_DEFAULTS, handleAffected } from './affected.js';

vi.mock('watskeburt', () => ({ list: vi.fn() }));
const SRC_EXTS = EXTS.SRC.join(',');

const mockList = vi.mocked(watskeburt.list);

beforeEach(() => {
  mockList.mockClear();
});

describe('handleAffected()', () => {
  it('should call list with default options when called with no arguments', async () => {
    mockList.mockResolvedValue('file1.js|file2.js');

    const result = await handleAffected();

    expect(mockList).toHaveBeenCalledWith({
      oldRevision: 'main',
      outputType: 'regex',
      extensions: SRC_EXTS
    });
    expect(result).toBe('file1.js|file2.js');
  });

  it('should call list with default options when called with true', async () => {
    mockList.mockResolvedValue('file1.js');

    const result = await handleAffected(true);

    expect(mockList).toHaveBeenCalledWith({
      oldRevision: 'main',
      outputType: 'regex',
      extensions: SRC_EXTS
    });
    expect(result).toBe('file1.js');
  });

  it('should handle oldRevision as custom string', async () => {
    mockList.mockResolvedValue('file1.js');

    await handleAffected('develop');

    expect(mockList).toHaveBeenCalledWith({
      oldRevision: 'develop',
      outputType: 'regex',
      extensions: SRC_EXTS
    });
  });

  it('should handle oldRevision set to true in options (AFFECTED_DEFAULTS to main)', async () => {
    mockList.mockResolvedValue('file1.js');

    await handleAffected({ oldRevision: true });

    expect(mockList).toHaveBeenCalledWith(expect.objectContaining({ oldRevision: 'main' }));
  });

  it('should handle oldRevision as custom string in options', async () => {
    mockList.mockResolvedValue('file1.js');

    await handleAffected({ oldRevision: 'feature-branch' });

    expect(mockList).toHaveBeenCalledWith(
      expect.objectContaining({ oldRevision: 'feature-branch' })
    );
  });

  it('should handle custom outputType', async () => {
    mockList.mockResolvedValue('file1.js');

    await handleAffected({ outputType: 'json' });

    expect(mockList).toHaveBeenCalledWith(expect.objectContaining({ outputType: 'json' }));
  });

  it('should handle newRevision', async () => {
    mockList.mockResolvedValue('file1.js');

    await handleAffected({ newRevision: 'feature-branch' });

    expect(mockList).toHaveBeenCalledWith(
      expect.objectContaining({ newRevision: 'feature-branch' })
    );
  });

  it('should handle trackedOnly', async () => {
    mockList.mockResolvedValue('file1.js');

    await handleAffected({ trackedOnly: true });

    expect(mockList).toHaveBeenCalledWith(expect.objectContaining({ trackedOnly: true }));
  });

  it('should append string extensions to EXTS.SRC with comma', async () => {
    mockList.mockResolvedValue('file1.js');

    await handleAffected({ extensions: 'json' });

    expect(mockList).toHaveBeenCalledWith(
      expect.objectContaining({ ...AFFECTED_DEFAULTS, extensions: `${SRC_EXTS},json` })
    );
  });

  it('should handle empty string extensions', async () => {
    mockList.mockResolvedValue('file1.js');

    await handleAffected({ extensions: '' });

    expect(mockList).toHaveBeenCalledWith(expect.objectContaining({ extensions: SRC_EXTS }));
  });

  it('should append array extensions to EXTS.SRC with comma separator', async () => {
    mockList.mockResolvedValue('file1.js');

    await handleAffected({ extensions: ['.json', '.md'] });

    expect(mockList).toHaveBeenCalledWith(
      expect.objectContaining({ extensions: `${SRC_EXTS}.json,.md` })
    );
  });

  it('should return undefined when list returns empty string', async () => {
    mockList.mockResolvedValue('');

    const result = await handleAffected();

    expect(result).toBeUndefined();
  });

  it('should return undefined when list returns undefined', async () => {
    mockList.mockResolvedValue(undefined as any);

    const result = await handleAffected();

    expect(result).toBeUndefined();
  });

  it('should return string when list returns non-empty string', async () => {
    mockList.mockResolvedValue('file1.js|file2.js');

    const result = await handleAffected({
      oldRevision: 'v1.0.0',
      newRevision: 'v2.0.0',
      outputType: 'json',
      trackedOnly: false,
      extensions: ['.jsx', '.jsx']
    });

    expect(mockList).toHaveBeenCalledWith({
      oldRevision: 'v1.0.0',
      newRevision: 'v2.0.0',
      outputType: 'json',
      trackedOnly: false,
      extensions: `${SRC_EXTS}.jsx,.jsx`
    });
    expect(result).toBe('file1.js|file2.js');
  });

  it('should handle oldRevision undefined in options (AFFECTED_DEFAULTS to main)', async () => {
    mockList.mockResolvedValue('file1.js');

    await handleAffected({ oldRevision: undefined });

    expect(mockList).toHaveBeenCalledWith(expect.objectContaining({ oldRevision: 'main' }));
  });
});
