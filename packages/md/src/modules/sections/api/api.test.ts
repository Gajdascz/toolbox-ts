import { describe, it, expect } from 'vitest';
import { api } from './api.js';
import { EMOJIS } from '../../core/constants.ts';

const ENTRY = { export: 'myFn', type: 'Function', description: 'Does something' };

describe('(sections) api', () => {
  it('renders section heading', () => {
    const result = api({ groups: { heading: 'Functions', entries: [ENTRY] } });
    expect(result).toContain(`## ${EMOJIS.API} API`);
  });

  it('renders table headers', () => {
    const result = api({ groups: { heading: 'Fns', entries: [ENTRY] } });
    expect(result).toContain('Export');
    expect(result).toContain('Type');
    expect(result).toContain('Description');
  });

  it('renders entry values in table', () => {
    const result = api({ groups: { heading: 'Fns', entries: [ENTRY] } });
    expect(result).toContain('myFn');
    expect(result).toContain('Function');
    expect(result).toContain('Does something');
  });

  it('single group renders table directly without group subheading', () => {
    const result = api({ groups: { heading: 'Fns', entries: [ENTRY] } });
    expect(result).not.toContain('### Fns');
  });

  it('multiple groups render each with a subheading', () => {
    const result = api({
      groups: [
        { heading: 'Functions', entries: [ENTRY] },
        {
          heading: 'Types',
          entries: [{ export: 'MyType', type: 'Interface', description: 'A type' }]
        }
      ]
    });
    expect(result).toContain('### Functions');
    expect(result).toContain('### Types');
    expect(result).toContain('myFn');
    expect(result).toContain('MyType');
  });

  it('supports custom section heading', () => {
    const result = api({
      groups: { heading: 'Fns', entries: [ENTRY] },
      heading: { content: 'Reference', size: 3 }
    });
    expect(result).toContain('### Reference');
  });
});
