import { section, text, combine } from '../../core/index.js';
import {
  heading,
  imageElement,
  type ImageElementOptions,
  image,
  type ImageOptions,
  link
} from '../../blocks/index.js';

export interface NavEntry {
  label: string;
  url: string;
}
export interface HeaderOptions {
  heading: string;
  badges?: string[];
  description?: string;
  hero?: { url: string } & (
    | { type: 'element'; opts?: Omit<ImageElementOptions, 'url'> }
    | { type: 'md'; opts?: Omit<ImageOptions, 'url'> }
  );
  nav?: { homeUrl: string; homeLabel?: string; entries: NavEntry[] };
  separator?: boolean;
}

const formatHero = (hero: NonNullable<HeaderOptions['hero']>): string =>
  hero.type === 'element'
    ? imageElement({ url: hero.url, ...hero.opts })
    : image({ url: hero.url, ...hero.opts });

const formatNav = (nav: NonNullable<HeaderOptions['nav']>): string => {
  const homeLink = link({ content: nav.homeLabel ?? 'Home', url: nav.homeUrl });
  const entryLinks = nav.entries.map(({ label, url }) => link({ content: label, url }));
  return [homeLink, ...entryLinks].join(' | ');
};

export const header = ({
  badges: b,
  heading: _heading,
  description,
  hero,
  nav,
  separator
}: HeaderOptions) =>
  section({
    heading: heading({ size: 1, content: _heading }),
    body: combine(hero && formatHero(hero), b?.join(' '), nav && formatNav(nav), text(description)),
    separator
  });
