import { describe, it, expect } from 'vitest';
import { url, element, md } from './static.ts';
import { runBadgeTestsNoShorthand } from '../../fixtures/index.ts';

describe('(blocks/badges) static badge', () => {
  describe('encodeBadgeText', () => {
    it('escapes dashes', () => {
      expect(url({ label: 'my-label' })).toContain('my--label');
    });

    it('escapes underscores', () => {
      expect(url({ label: 'my_label' })).toContain('my__label');
    });

    it('converts spaces to underscores', () => {
      expect(url({ label: 'my label' })).toContain('my_label');
    });
  });
  describe('formatPathParams', () => {
    it('label only', () => {
      expect(url({ label: 'build' })).toContain('/build');
    });

    it('label + message', () => {
      expect(url({ label: 'build', message: 'passing' })).toContain('/build-passing');
    });

    it('label + color (no message)', () => {
      expect(url({ label: 'build', color: '#4c1' })).toContain('/build-4c1');
    });

    it('label + message + color', () => {
      expect(url({ label: 'build', message: 'passing', color: 'green' })).toContain(
        '/build-passing-green'
      );
    });
  });
  runBadgeTestsNoShorthand(
    'snapshots',
    { element, md, url },
    ['label only', { label: 'label' }],
    ['label and message', { label: 'label', message: 'message' }],
    ['label and color', { label: 'label', color: 'blue' }],
    ['label, message, and color', { label: 'label', message: 'message', color: 'blue' }]
  );
});
