//#region> Hooks
/** validate commit message from git am */
export const APPLY_PATCH_MSG = 'applypatch-msg';
export type ApplyPatchMsg = typeof APPLY_PATCH_MSG;
/** run before git am applies a patch */
export const PRE_APPLYPATCH = 'pre-applypatch';
export type PreApplyPatch = typeof PRE_APPLYPATCH;

/** run after git am applies a patch */
export const POST_APPLYPATCH = 'post-applypatch';
export type PostApplyPatch = typeof POST_APPLYPATCH;

/** run before a commit is created */
export const PRE_COMMIT = 'pre-commit';
export type PreCommit = typeof PRE_COMMIT;

/** edit or validate the commit message template */
export const PREPARE_COMMIT_MSG = 'prepare-commit-msg';
export type PrepareCommitMsg = typeof PREPARE_COMMIT_MSG;

/** validate the final commit message */
export const COMMIT_MSG = 'commit-msg';
export type CommitMsg = typeof COMMIT_MSG;

/** run after a commit is created */
export const POST_COMMIT = 'post-commit';
export type PostCommit = typeof POST_COMMIT;

/** run before a rebase starts */
export const PRE_REBASE = 'pre-rebase';
export type PreRebase = typeof PRE_REBASE;

/** run after git checkout or branch switch */
export const POST_CHECKOUT = 'post-checkout';
export type PostCheckout = typeof POST_CHECKOUT;

/** run after a merge completes */
export const POST_MERGE = 'post-merge';
export type PostMerge = typeof POST_MERGE;

/** run before pushing to a remote */
export const PRE_PUSH = 'pre-push';
export type PrePush = typeof PRE_PUSH;

/** run before Git’s automatic garbage collection */
export const PRE_AUTO_GC = 'pre-auto-gc';
export type PreAutoGc = typeof PRE_AUTO_GC;

/** run after history-rewriting commands (rebase commit --amend) */
export const POST_REWRITE = 'post-rewrite';
export type PostRewrite = typeof POST_REWRITE;
//#endregion

export type Hook =
  | ApplyPatchMsg
  | CommitMsg
  | PostApplyPatch
  | PostCheckout
  | PostCommit
  | PostMerge
  | PostRewrite
  | PreApplyPatch
  | PreAutoGc
  | PreCommit
  | PrepareCommitMsg
  | PrePush
  | PreRebase;
