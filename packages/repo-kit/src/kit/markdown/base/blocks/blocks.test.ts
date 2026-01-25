import { NPM_URL, SHIELDS_IO_URL } from '@toolbox-ts/configs/core';
import { describe, expect, it } from 'vitest';

import type { TextWithStyle } from '../text/text.ts';

import {
  badge,
  callout,
  codeBlock,
  details,
  image,
  imageElement,
  imageLink,
  imageLinkElement,
  link,
  linkElement,
  list,
  listElement,
  type ListNodes,
  makeMDOrHTML,
  npmBadge,
  npmBadgeElement,
  reference,
  spanTag,
  table,
  title,
  titleElement
} from './blocks.ts';

describe('blocks', () => {
  it('spanTag and HTML Property handling', () => {
    const out = spanTag(
      { text: 'hi' },
      {
        // ID should join with spaces and remove duplicates
        id: ['my', 'oh', 'my'],
        // style should join with semicolons
        style: ['a', 'b'],
        // strings should be quoted as-is
        strProp: 'string',
        // JSON objects should be stringified
        jsonObj: { a: 1, b: 2 },
        // other props should be added as-is
        random: true,
        // null/undefined props should be ignored
        nothing: null,
        skip: undefined
      }
    );
    expect(out).toContain('<span');
    expect(out).toContain('id="my oh"');
    expect(out).toContain('style="a; b;"');
    expect(out).toContain('strProp="string"');
    expect(out).toContain('jsonObj={"a":1,"b":2}');
    expect(out).toContain('random=true');
    expect(out).toContain('>hi</span>');
    expect(out).not.toContain('nothing');
    expect(out).not.toContain('skip');
    const out2 = spanTag({ text: undefined });
    expect(out2).toBe('<span></span>');
  });
  it('callout upper-cases type and uses text formatter', () => {
    const msg: TextWithStyle = { text: 'hello', styles: { italic: 'md' } };
    const calloutMd = callout({ message: msg, type: 'tip' });
    expect(calloutMd).toContain('> [!TIP]');
    expect(calloutMd).toContain('> *hello*');
    expect(calloutMd).toContain('\n');
  });

  describe('link', () => {
    it('md link without and with description', () => {
      const withDesc = link({
        text: 'Name',
        url: 'https://x',
        description: 'desc'
      });
      expect(withDesc).toContain('[Name]');
      expect(withDesc).toContain('(https://x)');
      expect(withDesc).toContain(': desc');
      const withoutDesc = link({ text: 'Name', url: 'https://x' });
      expect(withoutDesc).toContain('[Name]');
      expect(withoutDesc).toContain('(https://x)');
      expect(withoutDesc).not.toContain(']:');
    });

    it('element builds anchor and supports array props (target)', () => {
      const el = linkElement({
        text: { text: 'N', styles: { italic: 'i' } },
        url: 'u',
        target: '_blank',
        id: 'lnk'
      });
      expect(el).toContain('<a');
      expect(el).toContain('href="u"');
      expect(el).toContain('target="_blank"');
      expect(el).toContain('id="lnk"');
      expect(el).toContain('<i>N</i>');
    });
  });
  describe('image', () => {
    it('markdown includes description when provided and empty description when not', () => {
      const withDesc = image({ url: 'u', description: 'alt' });
      expect(withDesc).toContain('![alt]');
      expect(withDesc).toContain('(u)');

      const withoutDesc = image({ url: 'u' });
      expect(withoutDesc).toContain('![]');
      expect(withoutDesc).toContain('(u)');
    });

    it('element returns a single-tag HTML img with props', () => {
      const withDesc = imageElement({ url: 'u', description: 'alt' });
      expect(withDesc).toContain('alt="alt"');
      expect(withDesc).toContain('src="u"');
      const withoutDesc = imageElement({ url: 'u' });
      expect(withoutDesc).toContain('<img');
      expect(withoutDesc).toContain('src="u"');
      expect(withoutDesc).not.toContain('alt');
      expect(withoutDesc).not.toContain('</img>');
    });
    it('omits props when not provided', () => {
      const el = imageElement({ url: undefined });
      expect(el).toBe('<img />');
    });
  });
  describe('imageLink', () => {
    it('markdown nests image inside a link', () => {
      const md = imageLink({
        imgUrl: 'https://img/x.png',
        description: 'alt',
        linkUrl: 'https://link/page'
      });
      expect(md).toBe('[![alt](https://img/x.png)](https://link/page)');
    });
    it('element nests img inside anchor with props', () => {
      const el = imageLinkElement({
        imgUrl: 'https://img/x.png',
        linkUrl: 'https://link/page',
        description: 'alt',
        id: 'imgLink'
      });
      expect(el).toContain('<a');
      expect(el).toContain('href="https://link/page"');
      expect(el).toContain('id="imgLink"');
      expect(el).toContain('<img');
      expect(el).toContain('alt="alt"');
      expect(el).toContain('src="https://img/x.png"');
    });
  });

  describe('reference', () => {
    it('without description', () => {
      expect(reference({ name: 'n', url: 'u' })).toBe('[n]: u');
    });
    it('with styled description', () => {
      const desc: TextWithStyle = { text: 'd', styles: { bold: 'md' } };
      expect(reference({ name: 'n', url: 'u', description: desc })).toBe(
        '[n]: u "**d**"'
      );
    });
  });

  describe('npmBadge variants', () => {
    it('unscoped package uses /npm/v/<pkg> and npm link', () => {
      const out = npmBadge({ packageName: 'pkg' });
      expect(out).toContain(`${SHIELDS_IO_URL}/npm/v/pkg`);
      expect(out).toContain(`${NPM_URL}/package/pkg`);
    });

    it('scoped package includes scope in image and link', () => {
      const out = npmBadge({ packageName: 'pkg', scope: 's' });
      expect(out).toContain(`${SHIELDS_IO_URL}/npm/v/s/pkg`);
      expect(out).toContain(`${NPM_URL}/package/s/pkg`);
    });

    it('label and description are respected and usable via npmBadgeElement (html)', () => {
      const el = npmBadgeElement({
        packageName: 'pkg',
        label: 'lbl',
        description: 'desc',
        scope: 's',
        id: 'badge'
      });
      expect(el).toContain(`id="badge"`);
      expect(el).toContain(SHIELDS_IO_URL);
      expect(el).toContain(NPM_URL);
      expect(el).toContain('lbl');
    });
  });
  describe('title', () => {
    it('markdown title of specified size', () => {
      const t = title({ content: 'My Title', size: 3 });
      expect(t).toContain('###');
      expect(t).toContain('My Title');
    });

    it('element builds correct header tag with optional id', () => {
      const h = titleElement({ content: 'Header', size: 4, id: 'hdr1' });
      expect(h).toContain('<h4');
      expect(h).toContain('id="hdr1"');
      expect(h).toContain('>Header</h4>');
    });
  });

  describe('list', () => {
    describe('markdown', () => {
      const items: ListNodes = [
        { content: 'one' },
        {
          content: { text: 'Two', styles: { italic: 'i' } },
          children: [] as any
        },
        {
          content: { text: 'Three', styles: { bold: 'md' } },
          children: [{ content: 'child1' }, { content: 'childLink' }]
        },
        'text node'
      ] as const;
      it('unordered', () => {
        const unordered = list({ items });
        expect(unordered.split('\n')[0]).toBe('- one');
        expect(unordered).toContain('- <i>Two</i>');
        expect(unordered).toContain('- **Three**');
        expect(unordered).toContain('  - child1');
        expect(unordered).toContain('- text node');
      });
      it('ordered', () => {
        const ordered = list({ items, type: 'ordered' });
        expect(ordered.split('\n')[0]).toBe('1. one');
        expect(ordered).toContain('2. <i>Two</i>');
        expect(ordered).toContain('3. **Three**');
        expect(ordered).toContain('  1. child1');
      });
      it('task', () => {
        const task = list({ items, type: 'task' });
        expect(task.split('\n')[0]).toBe('- [ ] one');
        expect(task).toContain('- [ ] <i>Two</i>');
        expect(task).toContain('- [ ] **Three**');
        expect(task).toContain('  - [ ] child1');
      });
    });
    describe('element', () => {
      const items: ListNodes = [
        { content: 'one' },
        { content: { text: 'Two', styles: { italic: 'i' } } },
        {
          content: { text: 'Three', styles: { bold: 'md' } },
          children: [
            { content: 'child1' },
            { content: { text: 'childLink', styles: { underline: 'u' } } }
          ]
        }
      ];
      it('builds unordered lists', () => {
        const ul = listElement({ items, type: 'unordered' });
        expect(ul).toContain('<ul');
        expect(ul).toContain('<li>one</li>');
        expect(ul).toContain('<li><i>Two</i></li>');
        expect(ul).toContain('**Three**');
        expect(ul).toContain('<ul>');
        expect(ul).toContain('<li><u>childLink</u></li>');
        expect(ul).toContain('</ul>');
        expect(ul).toContain('</li>');
        expect(ul).toContain('</ul>');
      });
    });
  });

  it('details builds details>summary with summary text + content', () => {
    const d = details({ content: 'content', summary: 'sum', id: 'd1' } as any);
    expect(d).toBe(
      '<details id="d1"><summary>sum\n\ncontent</summary></details>'
    );
  });

  it('codeBlock uses provided language or plaintext by default', () => {
    expect(codeBlock('x', 'ts')).toBe('```ts\nx\n```');
    expect(codeBlock('y')).toBe('```plaintext\ny\n```');
  });

  it('table normalizes column widths so that each row has same length', () => {
    const t = table(['h1', 'header2'], ['short', 'longercol'], ['r2c1', 'c2']);
    const rows = t.split('\n').filter(Boolean);
    const lengths = rows.map((r) => r.length);
    expect(new Set(lengths).size).toBe(1);
    // header row should start and end with '|' and have separators line afterwards
    expect(rows[0].startsWith('|')).toBe(true);
    expect(rows[1].startsWith('|')).toBe(true);
  });
  it('makeMDOrHTML makes markdown or HTML block based on type', () => {
    const md = makeMDOrHTML('title', 'md', { content: 'Hi', size: 2 });
    expect(md).toBe('## Hi');
    const html = makeMDOrHTML('title', 'html', { content: 'Hi', size: 2 });
    expect(html).toBe('<h2>Hi</h2>');
  });
  describe('badge', () => {
    it('npm badge', () => {
      const md = badge({
        type: 'npm',
        opts: { type: 'md', opts: { packageName: 'mypkg', description: 'npm' } }
      });
      expect(md).toContain('![npm]');
      expect(md).toContain('mypkg');
      const el = badge({
        type: 'npm',
        opts: {
          type: 'html',
          opts: { packageName: 'mypkg', description: 'npm', id: 'b1' }
        }
      });
      expect(el).toContain('id="b1"');
      expect(el).toContain('mypkg');
    });
    it('image badge', () => {
      const md = badge({
        type: 'image',
        opts: {
          type: 'md',
          opts: { url: 'https://img/x.png', description: 'alt' }
        }
      });
      expect(md).toBe('![alt](https://img/x.png)');
      const el = badge({
        type: 'image',
        opts: {
          type: 'html',
          opts: { url: 'https://img/x.png', description: 'alt', id: 'img1' }
        }
      });
      expect(el).toContain('id="img1"');
      expect(el).toContain('src="https://img/x.png"');
    });
    it('link badge', () => {
      const md = badge({
        type: 'link',
        opts: {
          type: 'md',
          opts: {
            imgUrl: 'https://img/lt.png',
            linkUrl: 'https://link/page',
            description: 'LT'
          }
        }
      });
      expect(md).toContain('[![LT]');
      expect(md).toContain('(https://img/lt.png)');
      expect(md).toContain('(https://link/page)');
      const el = badge({
        type: 'link',
        opts: {
          type: 'html',
          opts: {
            imgUrl: 'https://img/lt.png',
            linkUrl: 'https://link/page',
            description: 'LT',
            id: 'lnk1'
          }
        }
      });
      expect(el).toContain('id="lnk1"');
      expect(el).toContain('href="https://link/page"');
      expect(el).toContain('src="https://img/lt.png"');
      expect(el).toContain('alt="LT"');
      expect(el).not.toContain('<a>');
      expect(el).toContain('</a>');
      expect(el).toContain('<img');
      expect(el).toContain('/>');
    });
  });
});
