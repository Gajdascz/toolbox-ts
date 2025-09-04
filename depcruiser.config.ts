import { config } from '@toolbox-ts/depcruiser';

const cfg = config({
  configFileName: 'depcruiser.config.ts',

  forbidden: {
    noOrphans: false,
    peerDepsUsed: { from: { pathNot: ['packages/tseslint'] } }
  },
  options: {
    cache: false,
    log: 'gh-actions-text',

    includeOnly: { path: 'packages/*' },
    doNotFollow: {
      path: [
        'bin',
        '.d.ts',
        '.test.ts',
        '.spec.ts',
        '.bench.ts',
        '.md',
        'LICENSE',
        'dist'
      ]
    },
    graph: { type: 'x-dot-webpage' },
    combinedDependencies: true,
    preserveSymlinks: false,
    tsConfig: { fileName: 'tsconfig.build.json' }
  }
});
export default cfg;
