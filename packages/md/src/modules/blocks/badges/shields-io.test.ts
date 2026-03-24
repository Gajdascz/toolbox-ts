import { describe, it, expect } from 'vitest';
import {
  URL,
  QUERY_PARAMS,
  encodeBadgeColor,
  url,
  md,
  element,
  createBadgeHandlers
} from './shields-io.ts';

describe('(blocks/Badges) shields-io', () => {
  describe('encodeBadgeColor', () => {
    it('strips leading # from hex color', () => {
      expect(encodeBadgeColor('#ff0000')).toBe('ff0000');
    });

    it('returns named/hex-without-hash color unchanged', () => {
      expect(encodeBadgeColor('blue')).toBe('blue');
      expect(encodeBadgeColor('#ff0000')).toBe('ff0000');
    });
  });

  describe('url', () => {
    it('returns base URL + route with no query params when options are empty', () => {
      expect(url('badge/label-message-blue')).toBe(`${URL}/badge/label-message-blue`);
    });

    it('appends style param', () => {
      const result = url('badge/x-y-z', { style: 'flat-square' });
      expect(result).toContain(`${QUERY_PARAMS.STYLE}=flat-square`);
    });

    it('appends cacheSeconds param', () => {
      const result = url('badge/x-y-z', { cacheSeconds: 3600 });
      expect(result).toContain(`${QUERY_PARAMS.CACHE_SECONDS}=3600`);
    });

    it('appends label override param', () => {
      const result = url('badge/x-y-z', { labelOverride: 'My Label' });
      expect(result).toContain(`${QUERY_PARAMS.LABEL}=My+Label`);
    });

    it('appends labelColor param (strips # from hex)', () => {
      const result = url('badge/x-y-z', { labelColor: '#ffffff' });
      expect(result).toContain(`${QUERY_PARAMS.LABEL_COLOR}=ffffff`);
    });

    it('appends labelColor param (named color left unchanged)', () => {
      const result = url('badge/x-y-z', { labelColor: 'red' });
      expect(result).toContain(`${QUERY_PARAMS.LABEL_COLOR}=red`);
    });

    it('appends logo slug without color', () => {
      const result = url('badge/x-y-z', { logo: { slug: 'github' } });
      expect(result).toContain(`${QUERY_PARAMS.LOGO}=github`);
      expect(result).not.toContain(QUERY_PARAMS.LOGO_COLOR);
    });

    it('appends logo slug and logo color when color is provided', () => {
      const result = url('badge/x-y-z', { logo: { slug: 'npm', color: '#cb3837' } });
      expect(result).toContain(`${QUERY_PARAMS.LOGO}=npm`);
      expect(result).toContain(`${QUERY_PARAMS.LOGO_COLOR}=cb3837`);
    });

    it('appends logoSize param', () => {
      const result = url('badge/x-y-z', { logoSize: 'auto' });
      expect(result).toContain(`${QUERY_PARAMS.LOGO_SIZE}=auto`);
    });

    it('appends color param (strips # from hex)', () => {
      const result = url('badge/x-y-z', { color: '#00ff00' });
      expect(result).toContain(`${QUERY_PARAMS.COLOR}=00ff00`);
    });

    it('appends arbitrary extra params from rest', () => {
      const result = url('badge/x-y-z', { route: 'ignored' } as any);
      // route is not a URLSearchParams key — it is spread into rest and appended
      expect(result).toContain('route=ignored');
    });

    it('omits falsy extra rest params', () => {
      // passing an empty string value via rest should be skipped
      const result = url('badge/x-y-z', { route: '' } as any);
      expect(result).not.toContain('route=');
    });

    it('builds full URL with all params', () => {
      const result = url('badge/label-message-blue', {
        style: 'for-the-badge',
        cacheSeconds: 86400,
        labelOverride: 'version',
        labelColor: '#555',
        logo: { slug: 'nodedotjs', color: '#339933' },
        logoSize: 'auto',
        color: '#4c1'
      });
      expect(result).toContain(`${URL}/badge/label-message-blue`);
      expect(result).toContain(`${QUERY_PARAMS.STYLE}=for-the-badge`);
      expect(result).toContain(`${QUERY_PARAMS.CACHE_SECONDS}=86400`);
      expect(result).toContain(`${QUERY_PARAMS.LABEL}=version`);
      expect(result).toContain(`${QUERY_PARAMS.LABEL_COLOR}=555`);
      expect(result).toContain(`${QUERY_PARAMS.LOGO}=nodedotjs`);
      expect(result).toContain(`${QUERY_PARAMS.LOGO_COLOR}=339933`);
      expect(result).toContain(`${QUERY_PARAMS.LOGO_SIZE}=auto`);
      expect(result).toContain(`${QUERY_PARAMS.COLOR}=4c1`);
    });
  });

  describe('md', () => {
    it('returns markdown image with empty alt text by default', () => {
      const result = md('badge/label-message-blue');
      expect(result).toBe(`![](${URL}/badge/label-message-blue)`);
    });

    it('uses description as alt text', () => {
      const result = md('badge/label-message-blue', { description: 'My Badge' });
      expect(result).toBe(`![My Badge](${URL}/badge/label-message-blue)`);
    });

    it('passes through query params to the URL', () => {
      const result = md('badge/x-y-z', { description: 'badge', style: 'flat' });
      expect(result).toContain(`${QUERY_PARAMS.STYLE}=flat`);
      expect(result).toMatch(/^!\[badge\]/);
    });
  });

  describe('element', () => {
    it('returns an img element excluding alt by default', () => {
      const result = element('badge/label-message-blue');
      expect(result).toContain('<img');
      expect(result).toContain(`src="${URL}/badge/label-message-blue"`);
      expect(result).not.toContain('alt=');
    });

    it('uses description as alt text', () => {
      const result = element('badge/label-message-blue', { description: 'My Badge' });
      expect(result).toContain('alt="My Badge"');
    });

    it('passes through query params to the URL', () => {
      const result = element('badge/x-y-z', { style: 'flat' });
      expect(result).toContain(`${QUERY_PARAMS.STYLE}=flat`);
    });
  });

  describe('createBadgeHandlers', () => {
    describe('no shorthand', () => {
      const formatter = (route: string) => `custom/${route}`;
      const handlers = createBadgeHandlers(formatter);
      it('returns url, md, and element handlers', () => {
        expect(handlers).toHaveProperty('url');
        expect(handlers).toHaveProperty('md');
        expect(handlers).toHaveProperty('element');
      });
      it('url handler applies route formatter', () => {
        const result = handlers.url('my-badge');
        expect(result).toBe(`${URL}/custom/my-badge`);
      });
      it('url handler forwards query params', () => {
        const result = handlers.url('my-badge', { style: 'plastic' } as any);
        expect(result).toContain(`${QUERY_PARAMS.STYLE}=plastic`);
      });
      it('md handler applies route formatter and returns markdown image', () => {
        const result = handlers.md('my-badge');
        expect(result).toBe(`![](${URL}/custom/my-badge)`);
      });
      it('md handler uses description when provided', () => {
        const result = handlers.md('my-badge', { description: 'desc' } as any);
        expect(result).toBe(`![desc](${URL}/custom/my-badge)`);
      });
      it('element handler applies route formatter and returns img element', () => {
        const result = handlers.element('my-badge');
        expect(result).toContain(`src="${URL}/custom/my-badge"`);
      });
      it('element handler uses description as alt when provided', () => {
        const result = handlers.element('my-badge', { description: 'alt text' } as any);
        expect(result).toContain('alt="alt text"');
      });
    });
    describe('with shorthand', () => {
      const formatter = ({ route, target }: { route: string; target?: string }) =>
        `custom/${route}${target ? `/${target}` : ''}`;
      it('handles single primary route key with', () => {
        const handlers = createBadgeHandlers(formatter, 'route');
        const result = handlers.url({ route: 'my-badge' });
        expect(result).toBe(`${URL}/custom/my-badge`);
      });
      it('handles positional array of route keys', () => {
        const handlers = createBadgeHandlers(formatter, ['route', { key: 'target' }]);
        const result = handlers.url({ route: 'my-badge', target: 'latest' });
        expect(result).toBe(`${URL}/custom/my-badge/latest`);
      });
      it('throws error if shorthand string has too many segments', () => {
        const handlers = createBadgeHandlers(formatter, ['route', { key: 'target' }]);
        expect(() => handlers.url('my-badge/latest/extra')).toThrow(/Too many route segments/);
      });
      it('throws error if shorthand string is missing required segments', () => {
        const handlers = createBadgeHandlers(formatter, [
          'route',
          { key: 'target', required: true }
        ]);
        expect(() => handlers.url('my-badge')).toThrow(/Missing required route segment/);
      });
    });
  });
});
