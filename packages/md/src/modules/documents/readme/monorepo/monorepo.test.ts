import { describe, it, expect } from 'vitest';
import { monorepoRootReadme } from './monorepo.js';
import { EMOJIS } from '../../../core/constants.ts';

const PKG_ENTRY = {
  name: '@scope/pkg-a',
  description: 'Package A',
  url: './packages/pkg-a',
  badges: { version: '1.0.0', lastUpdate: '2026-01', downloads: '1k' }
};
const BASE = { name: 'my-monorepo', licenseSpdx: 'MIT', packages: { packages: [PKG_ENTRY] } };

describe('(documents) monorepoRootReadme', () => {
  it('always renders header, packages section, and license', () => {
    const result = monorepoRootReadme(BASE);
    expect(result).toContain('# my-monorepo');
    expect(result).toContain(`${EMOJIS.PACKAGES} Packages`);
    expect(result).toContain(`${EMOJIS.LEGAL} License`);
  });

  it('renders package name as a link', () => {
    const result = monorepoRootReadme(BASE);
    expect(result).toContain('[@scope/pkg-a](./packages/pkg-a)');
  });

  it('renders package description', () => {
    const result = monorepoRootReadme(BASE);
    expect(result).toContain('Package A');
  });

  it('omits optional sections when not provided', () => {
    const result = monorepoRootReadme(BASE);
    expect(result).not.toContain(`${EMOJIS.TOOLING} Tooling`);
    expect(result).not.toContain(`${EMOJIS.RESOURCES} Resources`);
  });

  it('renders tooling section when provided', () => {
    const result = monorepoRootReadme({
      ...BASE,
      tooling: { sections: [{ content: 'pnpm', url: 'https://pnpm.io' }] }
    });
    expect(result).toContain(`${EMOJIS.TOOLING} Tooling`);
    expect(result).toContain('pnpm');
  });

  it('renders resources section when provided', () => {
    const result = monorepoRootReadme({
      ...BASE,
      resources: { links: [{ content: 'Contributing', url: './CONTRIBUTING.md' }] }
    });
    expect(result).toContain(`${EMOJIS.RESOURCES} Resources`);
    expect(result).toContain('Contributing');
  });

  it('packages section appears before license', () => {
    const result = monorepoRootReadme(BASE);
    expect(result.indexOf(`${EMOJIS.PACKAGES} Packages`)).toBeLessThan(
      result.indexOf(`${EMOJIS.LEGAL} License`)
    );
  });

  it('renders multiple packages', () => {
    const result = monorepoRootReadme({
      ...BASE,
      packages: {
        packages: [
          PKG_ENTRY,
          {
            name: '@scope/pkg-b',
            description: 'Package B',
            url: './packages/pkg-b',
            badges: { version: '2.0.0', lastUpdate: '2026-02', downloads: '2k' }
          }
        ]
      }
    });
    expect(result).toContain('@scope/pkg-a');
    expect(result).toContain('@scope/pkg-b');
  });
  describe('snapshots', () => {
    it('renders minimal readme with only required options', () => {
      expect(monorepoRootReadme(BASE)).toMatchInlineSnapshot(`
      "# my-monorepo

      ## ${EMOJIS.PACKAGES} Packages

      | Package                          | Status           | Description |
      |----------------------------------|------------------|-------------|
      | [@scope/pkg-a](./packages/pkg-a) | 1.0.0 2026-01 1k | Package A   |

      ## ${EMOJIS.LEGAL} License

      MIT - Copyright &copy; ${new Date().getFullYear()} "
    `);
    });

    it('renders with all optional sections', () => {
      expect(
        monorepoRootReadme({
          ...BASE,
          packages: {
            packages: [
              PKG_ENTRY,
              {
                name: '@scope/pkg-b',
                description: 'Package B',
                url: './packages/pkg-b',
                badges: { version: '2.0.0', lastUpdate: '2026-02', downloads: '2k' }
              }
            ]
          },
          resources: { links: [{ content: 'Contributing', url: './CONTRIBUTING.md' }] },
          tooling: { sections: [{ content: 'pnpm', url: 'https://pnpm.io' }] }
        })
      ).toMatchInlineSnapshot(`
      "# my-monorepo

      ## ${EMOJIS.PACKAGES} Packages

      | Package                          | Status           | Description |
      |----------------------------------|------------------|-------------|
      | [@scope/pkg-a](./packages/pkg-a) | 1.0.0 2026-01 1k | Package A   |
      | [@scope/pkg-b](./packages/pkg-b) | 2.0.0 2026-02 2k | Package B   |

      ## ${EMOJIS.RESOURCES} Resources

      - [Contributing](./CONTRIBUTING.md)

      ## 🛠️ Tooling

      - [pnpm](https://pnpm.io)

      ## ${EMOJIS.LEGAL} License

      MIT - Copyright &copy; ${new Date().getFullYear()} "
    `);
    });

    it('renders with header options', () => {
      expect(
        monorepoRootReadme({ ...BASE, header: { description: 'A modular TypeScript toolkit' } })
      ).toMatchInlineSnapshot(`
      "# my-monorepo

      A modular TypeScript toolkit

      ## ${EMOJIS.PACKAGES} Packages

      | Package                          | Status           | Description |
      |----------------------------------|------------------|-------------|
      | [@scope/pkg-a](./packages/pkg-a) | 1.0.0 2026-01 1k | Package A   |

      ## ${EMOJIS.LEGAL} License

      MIT - Copyright &copy; ${new Date().getFullYear()} "
    `);
    });

    it('renders with license owner', () => {
      expect(
        monorepoRootReadme({
          ...BASE,
          license: { owner: { content: 'Nolan', url: 'https://github.com/nolan' }, year: 2026 }
        })
      ).toMatchInlineSnapshot(`
      "# my-monorepo

      ## ${EMOJIS.PACKAGES} Packages

      | Package                          | Status           | Description |
      |----------------------------------|------------------|-------------|
      | [@scope/pkg-a](./packages/pkg-a) | 1.0.0 2026-01 1k | Package A   |

      ## ${EMOJIS.LEGAL} License

      MIT - Copyright &copy; 2026 [Nolan](https://github.com/nolan)"
    `);
    });

    it('renders tooling with record-style sections', () => {
      expect(
        monorepoRootReadme({
          ...BASE,
          tooling: {
            sections: {
              testing: [{ content: 'vitest', url: 'https://vitest.dev' }],
              linting: [{ content: 'oxlint', url: 'https://oxc.rs' }]
            }
          }
        })
      ).toMatchSnapshot();
    });
  });
});
