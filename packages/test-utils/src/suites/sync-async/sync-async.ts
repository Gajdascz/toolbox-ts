import { describe, it, expect, type Assertion } from 'vitest';

export interface SyncAsyncPair<
  TAsync extends (...args: any[]) => Promise<unknown>,
  TSync extends (...args: any[]) => unknown
> {
  async: TAsync;
  sync: TSync;
}
export type AssertionExpectedMap = {
  [K in keyof Omit<Assertion, 'toThrowError'>]: Assertion[K] extends (expected: infer E) => any
    ? E
    : never;
};
export type AssertionWithExpected = {
  [K in keyof AssertionExpectedMap as AssertionExpectedMap[K] extends never
    ? never
    : K]: AssertionExpectedMap[K];
};

export type BaseCase<Fn extends (...args: any[]) => any> = { fnArgs?: Parameters<Fn> };

export type SyncAsyncCase<Fn extends (...args: any[]) => any> = BaseCase<Fn> &
  (
    | {
        [K in keyof AssertionWithExpected]: { assertion: K; expected: AssertionWithExpected[K] };
      }[keyof AssertionWithExpected]
    | { assertion?: undefined; expected: AssertionWithExpected['toEqual'] }
  );

export type SyncAsyncCaseEntry<Fn extends (...args: any[]) => any> = {
  itShould: string;
  after?: () => void | Promise<void>;
  case: () => SyncAsyncCase<Fn> | Promise<SyncAsyncCase<Fn>>;
};
const runCase = (
  mode: 'sync' | 'async',
  fn: (...args: any[]) => unknown | Promise<unknown>,
  c: SyncAsyncCaseEntry<any>
) => {
  it(`${c.itShould}: (${mode})`, async () => {
    const { expected, assertion = 'toEqual', fnArgs = [] } = await c.case();
    if (assertion === 'toThrow') expect(async () => await fn(...fnArgs)).toThrow(expected);
    else (expect(await fn(...fnArgs))[assertion] as (...args: any[]) => void)(expected);
    await c.after?.();
  });
};

export const runSyncAsync = <
  TSync extends (...args: any[]) => any,
  TAsync extends (...args: any[]) => any
>(
  name: string,
  pair: SyncAsyncPair<TSync, TAsync>,
  cases: SyncAsyncCaseEntry<TSync | TAsync>[]
) => {
  describe(name, async () => {
    for (const c of cases) {
      runCase('sync', pair.sync, c);
      runCase('async', pair.async, c);
    }
  });
};
