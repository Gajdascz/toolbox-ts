import { EMOJIS, section } from '../../core/index.js';
import { type HeadingOptions, heading, codeBlock } from '../../blocks/index.js';

export interface InstallationOptions {
  isDev?: boolean;
  packageName: string;
  heading?: Partial<HeadingOptions>;
  separator?: boolean;
}
export const installation = ({
  packageName,
  isDev = false,
  separator,
  heading: _heading = {}
}: InstallationOptions) =>
  section({
    heading: heading({ content: `${EMOJIS.INSTALLATION} Installation`, size: 2, ..._heading }),
    body: codeBlock(
      `npm install ${isDev ? '--save-dev ' : ''}${packageName}
or
yarn add ${isDev ? '--dev ' : ''}${packageName}
or
pnpm add ${isDev ? '--save-dev ' : ''}${packageName}
`,
      'sh'
    ),
    separator
  });
