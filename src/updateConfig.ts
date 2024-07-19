import chalk from 'chalk';
import { $ as execa } from 'execa';
import _ from 'lodash';
import { resolve } from 'path';
import { packageDirectory } from 'pkg-dir';

import { type Actionable, type Config } from './Config';
import { readConfig, writeConfig } from './configFile';
import { getErrorMessage } from './getErrorMessage';

type Update = {
  [K in keyof Config]-?: NonNullable<Config[K]> extends Record<string, object>
    ? NonNullable<Config[K]>[string] extends Actionable
      ? { value: Record<string, string> }
      : never
    : never;
};

interface UpdateConfigParams {
  batch: string;
  path?: string;
  stdOut?: boolean;
}

export const updateConfig = async ({
  batch,
  path,
  stdOut,
}: UpdateConfigParams) => {
  try {
    if (stdOut)
      process.stdout.write(
        chalk.black.bold(`Updating config file from batch '${batch}...`),
      );

    // Load config file.
    const { rawConfig: config, configPath } = await readConfig(path);

    // Validate batch.
    if (!config.batches?.[batch]) {
      if (stdOut) process.stdout.write(chalk.red.bold(' Unknown batch!\n\n'));
      process.exit(1);
    }

    // Configure shell client.
    const $ = execa({
      cwd: resolve(
        (await packageDirectory({ cwd: configPath })) ?? '.',
        config.batches[batch].path,
      ),
      shell: true,
    });

    // Retrieve outputs from Terraform.
    const update = JSON.parse(
      (await $`terraform output -json`).stdout,
    ) as Update;

    // Remove destroyed Terraform outputs from config.
    for (const key of _.keys(update) as (keyof Update)[])
      for (const item of _.keys(config[key]))
        if (!(item in update[key].value)) _.unset(config, [key, item]);

    // Update config with Terraform outputs & remove action keys.
    _.forEach(update, ({ value: collection }, key) =>
      _.forEach(collection, (id, item) => {
        _.set(config, [key, item, 'id'], id);
        _.unset(config, [key, item, 'action']);
      }),
    );

    // Write updated config to file.
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
