import { describe, expect, it } from 'vitest';

import type { BadgeOptions } from '../base/index.ts';

import {
  header,
  type HeaderOptions,
  installation,
  license,
  tooling
} from './sections.ts';

describe('sections', () => {
  describe('license', () => {
    it('without owner', () => {
      const result = license({ type: 'ISC', year: 2022 });
      expect(result).toContain('ISC – © 2022');
      expect(result).not.toContain('[');
    });

    it('with default year (current year)', () => {
      const currentYear = new Date().getFullYear();
      const result = license({
        type: 'BSD',
        owner: { text: 'Corp', url: 'https://corp.com' }
      });
      expect(result).toContain(
        `BSD – © ${currentYear} [Corp](https://corp.com)`
      );
    });
    it('with urls', () => {
      const result = license({
        type: 'Apache-2.0',
        year: 2023,
        owner: { text: 'Dev', url: 'https://dev.com' },
        urls: [
          { text: 'Repo', url: '' },
          { text: 'Website', url: 'https://dev.com' }
        ]
      });
      expect(result).toContain('Apache-2.0 – © 2023 [Dev](https://dev.com)');
      expect(result).toContain('[Repo]() | [Website](https://dev.com)');
    });
    it('without urls property', () => {
      const result = license({
        type: 'GPL',
        year: 2021,
        owner: { text: 'Foundation', url: 'https://fsf.org' }
      });
      expect(result).toContain('GPL – © 2021 [Foundation](https://fsf.org)');
      expect(result).not.toContain('|');
    });
    it('uses custom title', () => {
      const result = license({
        type: 'MIT',
        year: 2020,
        title: { content: 'Custom License', size: 3 }
      });
      expect(result).toContain('### Custom License');
    });
    it('links to file when linkToFile is provided', () => {
      const result = license({
        type: 'MIT',
        year: 2020,
        linkToFile: './LICENSE'
      });
      expect(result).toContain('[MIT](./LICENSE) – © 2020');
    });
  });
  describe('installation', () => {
    it('all default options', () => {
      const result = installation({ packageName: 'my-pkg' });
      expect(result).toContain('## 🚀 Installation');
      expect(result).toContain('npm install my-pkg');
      expect(result).toContain('yarn add my-pkg');
      expect(result).toContain('pnpm add my-pkg');
      expect(result).toContain('```sh');
    });

    it('dev dependency', () => {
      const result = installation({ packageName: 'eslint', isDev: true });
      expect(result).toContain('npm install --save-dev eslint');
      expect(result).toContain('yarn add --dev eslint');
      expect(result).toContain('pnpm add --save-dev eslint');
    });

    it('without separator', () => {
      const result = installation({ packageName: 'test', separator: false });
      console.log(result);
      expect(result).not.toContain('---');
    });

    it('all custom options', () => {
      const result = installation({
        packageName: 'full-custom',
        isDev: true,
        separator: false,
        title: { content: 'Get Started', size: 4 }
      });
      expect(result).toContain('#### Get Started');
      expect(result).toContain('--save-dev full-custom');
      expect(result).not.toContain('---');
    });
  });
  describe('tooling', () => {
    it('empty sections', () => {
      const result = tooling({});
      expect(result).toContain('## 🛠️ Tooling');
      expect(result).not.toContain('<details>');
    });
    it('with sections', () => {
      const result = tooling({
        title: { size: 2 },
        sections: {
          formatters: [{ text: 'Prettier', url: 'https://prettier.io' }],
          linters: [
            { text: 'ESLint', url: 'https://eslint.org' },
            { text: 'Stylelint', url: 'https://stylelint.io' }
          ]
        }
      });
      expect(result).toContain('## 🛠️ Tooling');
      expect(result).toContain('<h3>Linters</h3>');
      expect(result).toContain('[ESLint](https://eslint.org)');
      expect(result).toContain('[Stylelint](https://stylelint.io)');
      expect(result).toContain('<h3>Formatters</h3>');
      expect(result).toContain('[Prettier](https://prettier.io)');
    });
  });
  describe('header', () => {
    const title = 'Project Title';

    const hero: HeaderOptions['hero'] = {
      type: 'md',
      opts: { description: 'Hero Image', url: 'https://example.com/hero.png' }
    };
    const checkHero = (md: string) =>
      md.includes('![Hero Image](https://example.com/hero.png)');

    const badges: Record<string, BadgeOptions> = {
      npm: {
        type: 'npm',
        opts: { type: 'md', opts: { packageName: 'my-pkg' } }
      },
      imageMD: {
        type: 'image',
        opts: {
          type: 'md',
          opts: { url: 'badge-url', description: 'Badge Image' }
        }
      },
      imageLinkHTML: {
        type: 'link',
        opts: {
          type: 'html',
          opts: {
            imgUrl: 'badge-url',
            linkUrl: 'https://ci.com/build',
            description: 'CI Badge'
          }
        }
      }
    };
    const checkBadges = (md: string) => {
      expect(md).includes('https://img.shields.io/npm/v');
      expect(md).includes('my-pkg');
      expect(md).includes('![Badge Image](badge-url)');
      expect(md).includes('<img');
      expect(md).includes('CI Badge');
      expect(md).includes('<a');
      expect(md).includes('</a>');
      expect(md).includes('href="https://ci.com/build"');
      expect(md).includes(' />');
      return true;
    };

    const description =
      'This is a sample project header description for testing purposes.';
    it('title and description only', () => {
      const result = header({ title, description });
      expect(result).toContain(`# ${title}`);
      expect(result).toContain(description);
    });
    it('with hero', () => {
      expect(checkHero(header({ title, hero }))).toBeTruthy();
    });
    it('with badges', () => {
      expect(
        checkBadges(
          header({
            title,
            badges: [badges.npm, badges.imageMD, badges.imageLinkHTML]
          })
        )
      ).toBeTruthy();
    });

    it('with all options', () => {
      const result = header({
        title,
        badges: [badges.npm, badges.imageMD, badges.imageLinkHTML],
        description,
        hero
      });

      expect(checkHero(result)).toBeTruthy();
      expect(checkBadges(result)).toBeTruthy();

      expect(result).toContain(description);
    });
  });
});
