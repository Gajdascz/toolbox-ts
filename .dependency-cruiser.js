import { config } from '@toolbox-ts/depcruiser';

const cfg = config.define({
  forbidden: {
    noOrphans: false,
    peerDepsUsed: { from: { pathNot: ['packages/tseslint'] } }
  },
  options: {
    cache: false,
    combinedDependencies: true,
    exclude: ['node_modules'],
    preserveSymlinks: false
  },
  tsconfigFilename: 'tsconfig.build.json'
});
export default cfg;
