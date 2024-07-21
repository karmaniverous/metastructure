import chalk from 'chalk';
import { $ as execa } from 'execa';

import { getErrorMessage } from './getErrorMessage';

interface ApplyLicenseHeaders {
  pkgDir: string;
  stdOut?: boolean;
}

export const applyLicenseHeaders = async ({
  pkgDir,
  stdOut,
}: ApplyLicenseHeaders) => {
  if (stdOut)
    process.stdout.write(chalk.black.bold('Applying license headers...'));

  let licenseOutput: string | undefined;
  try {
    // Configure shell client.
    const $ = execa({
      cwd: pkgDir,
      shell: true,
    });

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

  if (licenseOutput && stdOut)
    process.stdout.write(chalk.black.dim(licenseOutput));

  if (stdOut) console.log(chalk.green.bold('\nDone!\n'));
};
