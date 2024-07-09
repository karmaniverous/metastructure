import chalk from 'chalk';
import { $ } from 'execa';

import { ConsoleParams } from './ConsoleParams';

export const applyLicenseHeaders = async ({ stdOut }: ConsoleParams = {}) => {
  if (stdOut)
    process.stdout.write(chalk.black.bold('Applying license headers...\n'));

  let licenseOutput = '';
  try {
    ({ stdout: licenseOutput } = await $`license-check-and-add add`);
  } catch {} // eslint-disable-line no-empty

  if (licenseOutput && stdOut) console.log(chalk.black.dim(licenseOutput));

  if (stdOut) process.stdout.write(chalk.green.bold('Done!\n\n'));
};
