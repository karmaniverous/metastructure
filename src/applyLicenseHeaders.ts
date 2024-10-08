import chalk from 'chalk';
import { $ as execa } from 'execa';
import fs from 'fs-extra';
import { resolve } from 'path';

import { getErrorMessage } from './getErrorMessage';

interface ApplyLicenseHeaders {
  pkgDir: string;
  stdOut?: boolean;
}

export const applyLicenseHeaders = async ({
  pkgDir,
  stdOut,
}: ApplyLicenseHeaders) => {
  if (!(await fs.exists(resolve(pkgDir, 'license-checker-config.json'))))
    return;

  if (stdOut) console.log(chalk.black.bold('Applying license headers...'));

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
        console.log(chalk.red.bold(' License error!\n'));
        console.log(chalk.red(msg), '\n');
      }

      throw error;
    }
  }

  if (licenseOutput && stdOut)
    process.stdout.write(chalk.black.dim(licenseOutput));

  if (stdOut) console.log(chalk.green.bold('Done!\n'));
};
