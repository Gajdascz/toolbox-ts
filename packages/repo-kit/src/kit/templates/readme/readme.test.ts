import { GITHUB_URL, NPM_URL } from '@toolbox-ts/configs/core';
import { describe, expect, it } from 'vitest';

import { DEFAULTS, readme } from './readme.ts';

describe('readme()', () => {
  it('renders a header with title and description', () => {
    const output = readme({ header: {} });

    expect(output).toContain(DEFAULTS.header.title);
    expect(output).toContain('Generated with');
  });

  it('renders installation instructions', () => {
    const output = readme({});

    expect(output).toContain('npm install');
    expect(output).toContain('yarn add');
    expect(output).toContain('pnpm add');
  });

  it('renders tooling section with core tooling', () => {
    const output = readme({});

    expect(output).toContain('Tooling');
    expect(output).toContain('TypeScript');
    expect(output).toContain('pnpm');
    expect(output).toContain('Node');
  });

  it('renders quality and version control tooling by default', () => {
    const output = readme({});

    expect(output).toContain('prettier');
    expect(output).toContain('vitest');
    expect(output).toContain('husky');
    expect(output).toContain('lint-staged');
  });

  it('does not include optional tooling unless enabled', () => {
    const output = readme({});

    expect(output).not.toContain('commitizen');
    expect(output).not.toContain('changesets');
  });

  it('includes optional tooling when enabled', () => {
    const output = readme({
      tooling: { optional: { commitizen: true, changesets: true } }
    });

    expect(output).toContain('commitizen');
    expect(output).toContain('changesets');
  });

  it('renders license section with links', () => {
    const output = readme({});

    expect(output).toContain('License');
    expect(output).toContain('MIT');
    expect(output).toContain(GITHUB_URL);
    expect(output).toContain(NPM_URL);
  });

  it('appends custom body content when provided', () => {
    const body = '## Custom Body Content';

    const output = readme({ body });

    expect(output).toContain(body);
  });
});
