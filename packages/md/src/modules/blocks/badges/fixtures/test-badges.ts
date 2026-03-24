import { describe, expect, it } from 'vitest';
import type { BadgeHandlersWithShorthand, BadgeHandlersNoShorthand } from '../shields-io.ts';

export type BadgeTestCase<R> = [itRenders: string, withShortHand: string, withObjOptions: R];
export const runBadgeTests = <R>(
  description: string,
  handlers: BadgeHandlersWithShorthand<R, any>,
  ...cases: BadgeTestCase<R>[]
) =>
  describe(description, () => {
    cases.forEach(([itRenders, shorthand, obj]) => {
      let md: string;
      let element: string;
      let url: string;
      it(`renders ${itRenders} - snapshots`, () => {
        md = handlers.md(obj);
        element = handlers.element(obj);
        url = handlers.url(obj);
        expect(url).toMatchSnapshot();
        expect(md).toMatchSnapshot();
        expect(element).toMatchSnapshot();
      });
      it(`renders ${itRenders} - shorthand equals object form`, () => {
        expect(handlers.md(shorthand)).toBe(md);
        expect(handlers.element(shorthand)).toBe(element);
        expect(handlers.url(shorthand)).toBe(url);
      });
    });
  });

export type BadgeTestCaseNoShorthand<R> = [itRenders: string, withObjOptions: R];

export const runBadgeTestsNoShorthand = <R>(
  description: string,
  handlers: BadgeHandlersNoShorthand<R, any>,
  ...cases: BadgeTestCaseNoShorthand<R>[]
) =>
  describe(description, () => {
    cases.forEach(([itRenders, obj]) => {
      it(`renders ${itRenders} - snapshots`, () => {
        expect(handlers.url(obj)).toMatchSnapshot();
        expect(handlers.md(obj)).toMatchSnapshot();
        expect(handlers.element(obj)).toMatchSnapshot();
      });
    });
  });
