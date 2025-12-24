import { createForbiddenRule } from '../../factory/forbidden-rule-factory.js';
export default createForbiddenRule(
  'no-deprecated-core',
  'A module depends on a node core module that has been deprecated. Find an alternative - these are '
    + "bound to exist - node doesn't deprecate lightly.",
  {
    to: {
      dependencyTypes: ['core'],
      path: [
        '^v8/tools/codemap$',
        '^v8/tools/consarray$',
        '^v8/tools/csvparser$',
        '^v8/tools/logreader$',
        '^v8/tools/profile_view$',
        '^v8/tools/profile$',
        '^v8/tools/SourceMap$',
        '^v8/tools/splaytree$',
        '^v8/tools/tickprocessor-driver$',
        '^v8/tools/tickprocessor$',
        '^node-inspect/lib/_inspect$',
        '^node-inspect/lib/internal/inspect_client$',
        '^node-inspect/lib/internal/inspect_repl$',
        '^async_hooks$',
        '^punycode$',
        '^domain$',
        '^constants$',
        '^sys$',
        '^_linklist$',
        '^_stream_wrap$'
      ]
    }
  }
);
