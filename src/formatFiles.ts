import chalk from 'chalk';
import { $ } from 'execa';
import _ from 'lodash';
import { resolve } from 'path';

import { type Config } from './Config';

interface FormatFilesParams {
  config: Config;
  pkgDir: string;
  stdOut?: boolean;
}

export const formatFiles = async ({
  config,
  pkgDir,
  stdOut,
}: FormatFilesParams) => {
  // Load config.
  if (stdOut) process.stdout.write(chalk.black.bold('Formatting files...\n'));

  // Format Terraform files.
  for (const dir of _.castArray(config.terraform.paths)) {
    const { stdout: formatOutput } =
      await $`terraform fmt -recursive ${resolve(pkgDir, dir)}`;

    if (stdOut) console.log(chalk.black.dim(formatOutput));
  }

  process.stdout.write(chalk.green.bold('Done!\n\n'));
};
