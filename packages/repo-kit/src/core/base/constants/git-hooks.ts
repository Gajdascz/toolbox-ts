//#region> Hooks
/** validate commit message from git am */
export const APPLY_PATCH_MSG = 'applypatch-msg';
export type GitHookApplyPatchMsg = typeof APPLY_PATCH_MSG;
/** run before git am applies a patch */
export const PRE_APPLYPATCH = 'pre-applypatch';
export type GitHookPreApplyPatch = typeof PRE_APPLYPATCH;

/** run after git am applies a patch */
export const POST_APPLYPATCH = 'post-applypatch';
export type GitHookPostApplyPatch = typeof POST_APPLYPATCH;

/** run before a commit is created */
export const PRE_COMMIT = 'pre-commit';
export type GitHookPreCommit = typeof PRE_COMMIT;

/** edit or validate the commit message template */
export const PREPARE_COMMIT_MSG = 'prepare-commit-msg';
export type GitHookPrepareCommitMsg = typeof PREPARE_COMMIT_MSG;

/** validate the final commit message */
export const COMMIT_MSG = 'commit-msg';
export type GitHookCommitMsg = typeof COMMIT_MSG;

/** run after a commit is created */
export const POST_COMMIT = 'post-commit';
export type GitHookPostCommit = typeof POST_COMMIT;

/** run before a rebase starts */
export const PRE_REBASE = 'pre-rebase';
export type GitHookPreRebase = typeof PRE_REBASE;

/** run after git checkout or branch switch */
export const POST_CHECKOUT = 'post-checkout';
export type GitHookPostCheckout = typeof POST_CHECKOUT;

/** run after a merge completes */
export const POST_MERGE = 'post-merge';
export type GitHookPostMerge = typeof POST_MERGE;

/** run before pushing to a remote */
export const PRE_PUSH = 'pre-push';
export type GitHookPrePush = typeof PRE_PUSH;

/** run before Git’s automatic garbage collection */
export const PRE_AUTO_GC = 'pre-auto-gc';
export type GitHookPreAutoGc = typeof PRE_AUTO_GC;

/** run after history-rewriting commands (rebase commit --amend) */
export const POST_REWRITE = 'post-rewrite';
export type GitHookPostRewrite = typeof POST_REWRITE;
//#endregion

export type GitHook =
  | GitHookApplyPatchMsg
  | GitHookCommitMsg
  | GitHookPostApplyPatch
  | GitHookPostCheckout
  | GitHookPostCommit
  | GitHookPostMerge
  | GitHookPostRewrite
  | GitHookPreApplyPatch
  | GitHookPreAutoGc
  | GitHookPreCommit
  | GitHookPrepareCommitMsg
  | GitHookPrePush
  | GitHookPreRebase;
