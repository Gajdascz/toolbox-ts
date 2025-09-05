import { Obj, type StrRecord } from '@toolbox-ts/utils';

import type {
  DotGraph,
  Graph,
  Loggable,
  Report,
  TypeDefs,
  Types
} from './types.js';

const all: TypeDefs = {
  //#region> Graph Output Types
  archi: { kind: 'graph', fileExtension: '.dot', loggable: false },
  cdot: { kind: 'graph', fileExtension: '.dot', loggable: false },
  d2: { kind: 'graph', fileExtension: '.svg', loggable: false },
  ddot: { kind: 'graph', fileExtension: '.dot', loggable: false },
  'x-dot-webpage': { kind: 'graph', fileExtension: '.html', loggable: false },
  anon: { kind: 'report', fileExtension: '.json', loggable: true },
  'azure-devops': { kind: 'report', fileExtension: '.txt', loggable: true },
  csv: { kind: 'report', fileExtension: '.csv', loggable: true },
  dot: { kind: 'graph', fileExtension: '.dot', loggable: false },
  fdot: { kind: 'graph', fileExtension: '.dot', loggable: false },
  flat: { kind: 'graph', fileExtension: '.dot', loggable: false },
  mermaid: { kind: 'graph', fileExtension: '.mmd', loggable: false },
  //#endregion

  //#region> Report Output Types
  'err-html': { kind: 'report', fileExtension: '.html', loggable: false },
  'err-long': { kind: 'report', fileExtension: '.txt', loggable: true },
  err: { kind: 'report', fileExtension: '.txt', loggable: true },
  html: { kind: 'report', fileExtension: '.html', loggable: false },
  json: { kind: 'report', fileExtension: '.json', loggable: true },
  markdown: { kind: 'report', fileExtension: '.md', loggable: false },
  metrics: { kind: 'report', fileExtension: '.txt', loggable: true },
  text: { kind: 'report', fileExtension: '.txt', loggable: true },
  teamcity: { kind: 'report', fileExtension: '.txt', loggable: true },
  'gh-actions-json': { kind: 'report', fileExtension: '.json', loggable: true },
  'gh-actions-annotations': {
    kind: 'report',
    fileExtension: '.txt',
    loggable: true
  },
  //#endregion

  null: { fileExtension: '.', kind: 'report', loggable: false }
} as const;

export const definitions = {
  all: all,
  graph: Obj.filter(all, (def) => def.kind === 'graph'),
  report: Obj.filter(all, (def) => def.kind === 'report'),
  dotGraph: Obj.filter(
    all,
    (def) => def.kind === 'graph' && def.fileExtension === '.dot'
  ),
  loggable: Obj.filter(all, (def) => def.loggable)
};
export const keys = {
  all: Obj.keys(definitions.all),
  report: Obj.keys(definitions.report),
  graph: Obj.keys(definitions.graph),
  dotGraph: Obj.keys(definitions.dotGraph),
  loggable: Obj.keys(definitions.loggable)
} as const;
export const sets = {
  report: new Set<string>(keys.report),
  graph: new Set<string>(keys.graph),
  dotGraph: new Set<string>(keys.dotGraph),
  loggable: new Set<string>(keys.loggable)
} as const;
export const maps = {
  all: keys.all.reduce<Types>((acc, key) => {
    (acc as StrRecord)[key] = key;
    return acc;
  }, {} as Types),
  report: keys.report.reduce(
    (acc, key) => {
      (acc as StrRecord)[key] = key;
      return acc;
    },
    {} as { [K in keyof Types as Report]: K extends Report ? K : never }
  ),
  graph: keys.graph.reduce(
    (acc, key) => {
      (acc as StrRecord)[key] = key;
      return acc;
    },
    {} as { [K in keyof Types as Graph]: K extends Graph ? K : never }
  ),
  dotGraph: keys.dotGraph.reduce(
    (acc, key) => {
      (acc as StrRecord)[key] = key;
      return acc;
    },
    {} as { [K in keyof Types as DotGraph]: K extends DotGraph ? K : never }
  ),
  loggable: keys.loggable.reduce(
    (acc, key) => {
      (acc as StrRecord)[key] = key;
      return acc;
    },
    {} as { [K in keyof Types as Loggable]: K extends Loggable ? K : never }
  )
};
export const is = {
  report: (type: string): type is Report => sets.report.has(type),
  graph: (type: string): type is Graph => sets.graph.has(type),
  dotGraph: (type: string): type is DotGraph => sets.dotGraph.has(type),
  loggable: (type: string): type is Loggable => sets.loggable.has(type)
};
