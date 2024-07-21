import chalk from 'chalk';
import { $ as execa } from 'execa';
import _ from 'lodash';
import { resolve } from 'path';
import { packageDirectory } from 'pkg-dir';
import { inspect } from 'util';

import { readConfig, writeConfig } from './configFile';
import { getErrorMessage } from './getErrorMessage';

interface UpdateConfigParams {
  batch: string;
  debug?: boolean;
  path?: string;
  stdOut?: boolean;
}

export const updateConfig = async ({
  batch,
  debug,
  path,
  stdOut,
}: UpdateConfigParams) => {
  try {
    if (stdOut)
      process.stdout.write(chalk.black.bold(`Updating config file...`));

    // Load config file.
    const { rawConfig: config, configPath } = await readConfig(path);

    // Validate batch.
    if (!config.batches?.[batch]) {
      if (stdOut) process.stdout.write(chalk.red.bold(' Unknown batch!\n\n'));
      throw new Error(`Unknown batch: ${batch}`);
    }

    // Configure shell client.
    const $ = execa({
      cwd: resolve(
        (await packageDirectory({ cwd: configPath })) ?? '.',
        config.batches[batch].path,
      ),
      shell: true,
    });

    // Retrieve & conform outputs from Terraform.
    const update = _.mapValues(
      JSON.parse((await $`terraform output -json`).stdout),
      'value',
    );

    if (debug) {
      console.log(chalk.cyan('*** UPDATE OBJECT ***'));
      console.log(chalk.cyan(inspect(update, false, null)), '\n');
    }

    // Merge update & write updated config to file.
    _.merge(config, update);
    await writeConfig(config, configPath);

    if (stdOut) process.stdout.write(chalk.green.bold(' Done!\n\n'));

    return { configPath };
  } catch (error) {
    if (stdOut) {
      process.stdout.write(chalk.red.bold(' Error!\n\n'));
      console.log(chalk.red(getErrorMessage(error)), '\n');
    }

    throw error;
  }
};
