import * as icons from 'simple-icons';
import { writeFile } from '@toolbox-ts/file';
import { resolve } from 'path';
import { $ } from 'execa';

const PATH = resolve(import.meta.dirname, '../src/modules/blocks/badges/simple-icons-slugs.ts');

const { stdout } = await $`pnpm i -D simple-icons@latest`;
console.log(stdout);

await writeFile(
  PATH,
  `export type SimpleIconsSlug = ${Object.values(icons)
    .map(({ slug }) => `'${slug}'`)
    .join(' | ')};`
);
