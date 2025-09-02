import {
  dependencyExists,
  mockKeys,
  wrapMockExport
} from '../../../core/index.js';

export const inquirerExists = await dependencyExists('@inquirer/prompts');

export const inquirer = wrapMockExport(
  mockKeys([
    'Separator',
    'checkbox',
    'confirm',
    'editor',
    'expand',
    'input',
    'number',
    'password',
    'rawlist',
    'search',
    'select'
  ])
);
