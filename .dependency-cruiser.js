import { depcruiser } from '@toolbox-ts/configs';

export default depcruiser.define({
  forbidden: {
    cfg: { peerDepsUsed: false, noOrphans: false, noDuplicateDepTypes: false }
  }
});
