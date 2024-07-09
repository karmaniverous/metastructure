import chalk from 'chalk';
import { $ } from 'execa';
import { resolve } from 'path';

import { ConsoleParams } from './ConsoleParams';
import pkgDir from './pkgDir';

export const formatFiles = async ({ stdOut }: ConsoleParams = {}) => {
  if (stdOut) process.stdout.write(chalk.black.bold('Formatting files...\n'));

  const { stdout: formatOutput } =
    await $`terraform fmt -recursive ${resolve(pkgDir, 'src')}`;

  if (stdOut) {
    console.log(chalk.black.dim(formatOutput));

    process.stdout.write(chalk.green.bold('Done!\n\n'));
  }
};
