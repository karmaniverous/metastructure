import chalk from 'chalk';
import { $ } from 'execa';
import _ from 'lodash';
import { resolve } from 'path';

interface FormatFilesParams {
  paths: string | string[];
  pkgDir: string;
  stdOut?: boolean;
}

export const formatFiles = async ({
  paths,
  pkgDir,
  stdOut,
}: FormatFilesParams) => {
  // Load config.
  if (stdOut) console.log(chalk.black.bold('Formatting files...'));

  // Format Terraform files.
  for (const dir of _.castArray(paths)) {
    const { stdout: formatOutput } =
      await $`terraform fmt -recursive ${resolve(pkgDir, dir)}`;

    if (stdOut) process.stdout.write(chalk.black.dim(formatOutput));
  }

  console.log(chalk.green.bold('\nDone!\n'));
};
