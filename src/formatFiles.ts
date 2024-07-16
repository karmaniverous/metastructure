import chalk from 'chalk';
import { $ } from 'execa';
import _ from 'lodash';
import { resolve } from 'path';

import { type Config } from './Config';
import { ConsoleParams } from './ConsoleParams';
import { parseConfig } from './parseConfig';
import { pkgDir } from './pkgDir';

interface FormatFilesParams extends ConsoleParams {
  config?: Config;
}

export const formatFiles = async ({
  config,
  configPath,
  stdOut,
}: FormatFilesParams = {}) => {
  // Load config if necessary.
  if (!config) config = await parseConfig({ configPath, stdOut });

  if (stdOut) process.stdout.write(chalk.black.bold('Formatting files...\n'));

  // Format Terraform files.
  for (const dir of _.castArray(config.terraform.paths.source)) {
    const { stdout: formatOutput } =
      await $`terraform fmt -recursive ${resolve(pkgDir, dir)}`;

    if (stdOut) console.log(chalk.black.dim(formatOutput));
  }

  process.stdout.write(chalk.green.bold('Done!\n\n'));
};
