import { describe, it, expect } from 'vitest';
import { packageReadme } from './package.js';
import { EMOJIS } from '../../../core/constants.ts';

const BASE = { name: '@scope/my-pkg', licenseSpdx: 'MIT' };

describe('(documents) packageReadme', () => {
  it('always renders header, installation, and license', () => {
    const result = packageReadme(BASE);
    expect(result).toContain('# @scope/my-pkg');
    expect(result).toContain('Installation');
    expect(result).toContain('@scope/my-pkg');
    expect(result).toContain('License');
  });

  it('uses package name for installation command', () => {
    const result = packageReadme(BASE);
    expect(result).toContain('pnpm add @scope/my-pkg');
  });

  it('omits optional sections when not provided', () => {
    const result = packageReadme(BASE);
    expect(result).not.toContain('Usage');
    expect(result).not.toContain('API');
    expect(result).not.toContain('Tooling');
    expect(result).not.toContain('Resources');
  });

  it('renders usage section when provided', () => {
    const result = packageReadme({
      ...BASE,
      usage: { examples: { code: 'import { foo } from "@scope/my-pkg"' } }
    });
    expect(result).toContain('Usage');
    expect(result).toContain('import { foo }');
  });

  it('renders api section when provided', () => {
    const result = packageReadme({
      ...BASE,
      api: {
        groups: {
          heading: 'Functions',
          entries: [{ export: 'foo', type: 'Function', description: 'Does foo' }]
        }
      }
    });
    expect(result).toContain('API');
    expect(result).toContain('foo');
    expect(result).toContain('Function');
  });

  it('renders tooling section when provided', () => {
    const result = packageReadme({
      ...BASE,
      tooling: { sections: [{ content: 'vitest', url: 'https://vitest.dev' }] }
    });
    expect(result).toContain('Tooling');
    expect(result).toContain('vitest');
  });

  it('renders resources section when provided', () => {
    const result = packageReadme({
      ...BASE,
      resources: { links: [{ content: 'Changelog', url: './CHANGELOG.md' }] }
    });
    expect(result).toContain('Resources');
    expect(result).toContain('Changelog');
  });

  it('installation appears before license', () => {
    const result = packageReadme(BASE);
    expect(result.indexOf('Installation')).toBeLessThan(result.indexOf(`${EMOJIS.LEGAL} License`));
  });

  it('passes installation options through', () => {
    const result = packageReadme({ ...BASE, installation: { isDev: true } });
    expect(result).toContain('--save-dev');
  });
  describe('snapshots', () => {
    it('renders minimal readme with only required options', () => {
      expect(packageReadme(BASE)).toMatchInlineSnapshot(`
      "# @scope/my-pkg

      ## ${EMOJIS.INSTALLATION} Installation

      \`\`\`sh
      npm install @scope/my-pkg
      or
      yarn add @scope/my-pkg
      or
      pnpm add @scope/my-pkg

      \`\`\`

      ## ${EMOJIS.LEGAL} License

      MIT - Copyright &copy; ${new Date().getFullYear()} "
    `);
    });

    it('renders with dev installation', () => {
      expect(packageReadme({ ...BASE, installation: { isDev: true } })).toMatchInlineSnapshot(`
      "# @scope/my-pkg

      ## ${EMOJIS.INSTALLATION} Installation

      \`\`\`sh
      npm install --save-dev @scope/my-pkg
      or
      yarn add --dev @scope/my-pkg
      or
      pnpm add --save-dev @scope/my-pkg

      \`\`\`

      ## ${EMOJIS.LEGAL} License

      MIT - Copyright &copy; ${new Date().getFullYear()} "
    `);
    });

    it('renders with all optional sections', () => {
      expect(
        packageReadme({
          ...BASE,
          header: { description: 'A utility library' },
          usage: {
            examples: {
              code: 'import { foo } from "@scope/my-pkg";\nfoo();',
              description: 'Basic usage'
            }
          },
          resources: { links: [{ content: 'Changelog', url: './CHANGELOG.md' }] },
          api: {
            groups: {
              heading: 'Functions',
              entries: [{ export: 'foo', type: 'Function', description: 'Does foo things' }]
            }
          },
          tooling: { sections: [{ content: 'vitest', url: 'https://vitest.dev' }] }
        })
      ).toMatchInlineSnapshot(`
      "# @scope/my-pkg

      A utility library

      ## ${EMOJIS.INSTALLATION} Installation

      \`\`\`sh
      npm install @scope/my-pkg
      or
      yarn add @scope/my-pkg
      or
      pnpm add @scope/my-pkg

      \`\`\`

      ## ${EMOJIS.USAGE} Usage

      Basic usage

      \`\`\`ts
      import { foo } from "@scope/my-pkg";
      foo();
      \`\`\`

      ## ${EMOJIS.RESOURCES} Resources

      - [Changelog](./CHANGELOG.md)

      ## ${EMOJIS.API} API

      | Export | Type     | Description     |
      |--------|----------|-----------------|
      | foo    | Function | Does foo things |

      ## ${EMOJIS.TOOLING} Tooling

      - [vitest](https://vitest.dev)

      ## ${EMOJIS.LEGAL} License

      MIT - Copyright &copy; ${new Date().getFullYear()} "
    `);
    });

    it('renders with multiple usage examples', () => {
      expect(
        packageReadme({
          ...BASE,
          usage: {
            examples: [
              {
                heading: 'Basic',
                code: 'import { foo } from "@scope/my-pkg";',
                description: 'Import the module'
              },
              { heading: 'Advanced', code: 'foo({ bar: true });', language: 'ts' }
            ]
          }
        })
      ).toMatchSnapshot();
    });

    it('renders with multiple API groups', () => {
      expect(
        packageReadme({
          ...BASE,
          api: {
            groups: [
              {
                heading: 'Functions',
                entries: [{ export: 'foo', type: 'Function', description: 'Does foo' }]
              },
              {
                heading: 'Types',
                entries: [
                  { export: 'FooOptions', type: 'Interface', description: 'Options for foo' }
                ]
              }
            ]
          }
        })
      ).toMatchSnapshot();
    });

    it('renders with license owner and year', () => {
      expect(
        packageReadme({
          ...BASE,
          license: { owner: { content: 'Nolan', url: 'https://github.com/nolan' }, year: 2024 }
        })
      ).toMatchInlineSnapshot(`
      "# @scope/my-pkg

      ## ${EMOJIS.INSTALLATION} Installation

      \`\`\`sh
      npm install @scope/my-pkg
      or
      yarn add @scope/my-pkg
      or
      pnpm add @scope/my-pkg

      \`\`\`

      ## ${EMOJIS.LEGAL} License

      MIT - Copyright &copy; 2024 [Nolan](https://github.com/nolan)"
    `);
    });
  });
});
