import { describe, expect, it } from 'vitest';

import { resolveFlags } from './flags.ts';

describe('resolveFlags', () => {
  it('resolves cache/log/report/graph/focus/doNotFollow/progress and normalizerSpecs keys', () => {
    const res = resolveFlags({
      // log
      logType: 'info',
      noLog: false,
      // report
      reportType: 'json',
      reportFileName: 'r.json',
      noReport: false,
      // graph (dot => toSvg should be present)
      graphType: 'dot',
      graphFileName: 'g.dot',
      graphDotToSvg: true,
      noGraph: false,
      // cache
      cacheCompression: true,
      cacheFolder: '/tmp/cache',
      cacheStrategy: 'local',
      noCache: false,
      // focus
      focus: 'src/index',
      focusDepth: 2,
      // doNotFollow
      doNotFollowPath: 'a,b',
      doNotFollowDependencyTypes: 'cjs,es6',
      // progress
      progressType: 'dots',
      progressMaximumLevel: 10,
      // reduced keys (use normalizerSpecs parsers)
      includeOnly: 'a,b',
      reaches: 'r1,r2',
      maxDepth: 4,
      collapse: '3',
      exclude: 'x,y',
      moduleSystems: 'cjs,invalid'
    });

    const cache = res.cache as any;
    expect(cache).toBeDefined();
    expect(cache.strategy).toBe('local');
    expect(cache.compress).toBe(true);
    expect(cache.folder).toBe('/tmp/cache');
    expect(res.log).toBe('info');

    // report
    const report = res.report as any;
    expect(report).toBeDefined();
    expect(report.type).toBe('json');
    expect(report.fileName).toBe('r.json');

    // graph (dot => toSvg included)
    const graph = res.graph as any;
    expect(graph).toBeDefined();
    expect(graph.type).toBe('dot');
    expect(graph.fileName).toBe('g.dot');
    expect(graph.toSvg).toBe(true);

    // focus
    const focus = res.focus as any;
    expect(focus).toBeDefined();
    expect(focus.path).toEqual(['src/index']);
    expect(focus.depth).toBe(2);

    // doNotFollow
    const doNotFollow = res.doNotFollow as any;
    expect(doNotFollow).toBeDefined();
    expect(doNotFollow.path).toEqual(['a', 'b']);
    expect(doNotFollow.dependencyTypes).toEqual(['cjs', 'es6']);

    // progress
    const progress = res.progress as any;
    expect(progress).toBeDefined();
    expect(progress.type).toBe('dots');
    expect(progress.maximumLevel).toBe(10);

    // parser-normalized keys
    expect(res.includeOnly.path).toEqual(['a', 'b']);
    expect(res.reaches.path).toEqual(['r1', 'r2']);
    expect(res.maxDepth).toBe(4);
    expect(res.collapse).toBe(3);
    expect(res.exclude).toEqual({ path: ['x', 'y'] });

    // moduleSystems parser should filter invalid entries
    expect(res.moduleSystems).toEqual(['cjs']);
  });

  it('graph handles toSvg', () => {
    const res = resolveFlags({
      graphType: 'png',
      graphFileName: 'g.png',
      graphDotToSvg: true,
      noGraph: false
    });
    const graph = res.graph as any;
    expect(graph).toBeDefined();
    expect(graph.type).toBe('png');
    expect(graph.fileName).toBe('g.png');
    expect(graph.toSvg).toBeUndefined();
    const res2 = resolveFlags({
      graphType: 'dot',
      graphFileName: 'g.png',
      graphDotToSvg: false,
      noGraph: false
    });
    const graph2 = res2.graph as any;
    expect(graph2).toBeDefined();
    expect(graph2.type).toBe('dot');
    expect(graph2.fileName).toBe('g.png');
    expect(graph2.toSvg).toBeFalsy();
  });

  it('suppresses outputs when corresponding "no" flags are set', () => {
    const res = resolveFlags({
      noCache: true,
      noLog: true,
      noReport: true,
      noGraph: true,
      cacheFolder: '/tmp',
      logType: 'silent',
      reportType: 'json',
      graphType: 'dot'
    });

    expect(res.cache).toBeFalsy();
    expect(res.log).toBeFalsy();
    expect(res.report).toBeFalsy();
    expect(res.graph).toBeFalsy();
  });
});
