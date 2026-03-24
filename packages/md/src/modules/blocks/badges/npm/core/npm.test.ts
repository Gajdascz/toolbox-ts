import { describe } from 'vitest';
import * as npm from './npm.js';
import { runBadgeTests } from '../../fixtures/index.ts';
const withPkgName = 'with packageName';
describe('(blocks/badges) npm', () => {
  runBadgeTests(
    'version',
    npm.version,
    [`${withPkgName} only`, 'react', { packageName: 'react' }],
    [`${withPkgName} and tag`, 'react/latest', { packageName: 'react', tag: 'latest' }]
  );
  runBadgeTests('collaborators', npm.collaborators, [
    withPkgName,
    'react',
    { packageName: 'react' }
  ]);
  runBadgeTests('downloads', npm.downloads, [
    `${withPkgName} and interval`,
    'dm/react',
    { packageName: 'react', interval: 'dm' }
  ]);
  runBadgeTests('downloadsByAuthor', npm.downloadsByAuthor, [
    `author downloads with interval`,
    'dm/gajdascz',
    { interval: 'dm', author: 'gajdascz' }
  ]);
  runBadgeTests('jsDelivrHits', npm.jsDelivrHits, [
    `hits with period and packageName`,
    'month/react',
    { packageName: 'react', period: 'month' }
  ]);
  runBadgeTests(
    'lastUpdate',
    npm.lastUpdate,
    [`${withPkgName} only`, 'react', { packageName: 'react' }],
    [`${withPkgName} and tag`, 'react/latest', { packageName: 'react', tag: 'latest' }]
  );
  runBadgeTests('license', npm.license, [withPkgName, 'react', { packageName: 'react' }]);
  runBadgeTests('typeDefinitions', npm.typeDefinitions, [
    withPkgName,
    'react',
    { packageName: 'react' }
  ]);
  runBadgeTests(
    'unpackedSize',
    npm.unpackedSize,
    [`${withPkgName} only`, 'react', { packageName: 'react' }],
    [`${withPkgName} and version`, 'react/latest', { packageName: 'react', version: 'latest' }]
  );
  runBadgeTests(
    'dependencyVersion',
    npm.dependencyVersion,
    [
      `${withPkgName} and prod dependency version`,
      'react/prod/debug',
      { packageName: 'react', type: 'prod', dependency: 'debug' }
    ],
    [
      `${withPkgName} and dev dependency version`,
      'react/dev/debug',
      { packageName: 'react', type: 'dev', dependency: 'debug' }
    ],
    [
      `${withPkgName} and peer dependency version`,
      'react/peer/debug',
      { packageName: 'react', type: 'peer', dependency: 'debug' }
    ]
  );
  runBadgeTests(
    'bundleSize',
    npm.bundleSize,
    [`${withPkgName} and format`, 'min/react', { packageName: 'react', format: 'min' }],
    [
      `${withPkgName}, format, and version`,
      'min/react/latest',
      { packageName: 'react', format: 'min', version: 'latest' }
    ]
  );
  runBadgeTests('minGzippedSize', npm.minGzippedSize, [
    withPkgName,
    'react',
    { packageName: 'react' }
  ]);
});
