import chalk from 'chalk';
import { $ } from 'execa';

import { ConsoleParams } from './ConsoleParams';
import { getErrorMessage } from './getErrorMessage';

export const applyLicenseHeaders = async ({ stdOut }: ConsoleParams = {}) => {
  if (stdOut)
    process.stdout.write(chalk.black.bold('Applying license headers...'));

  let licenseOutput = '';
  try {
    ({ stdout: licenseOutput } = await $`license-check-and-add add`);
  } catch (error) {
    const msg = getErrorMessage(error);

    // This is a common spurious error.
    if (!msg.includes('0x1fffffe8')) {
      if (stdOut) {
        process.stdout.write(chalk.red.bold(' License error!\n\n'));
        console.log(chalk.red(msg), '\n');
      }

      process.exit(1);
    }
  }

  if (licenseOutput && stdOut) console.log(chalk.black.dim(licenseOutput));

  if (stdOut) process.stdout.write(chalk.green.bold('\nDone!\n\n'));
};
