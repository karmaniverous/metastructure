import chalk from 'chalk';
import { $ as execa } from 'execa';
import _ from 'lodash';
import { resolve } from 'path';

import { type Actionable, type Config } from './Config';
import { readConfig, writeConfig } from './configFile';
import { type ConsoleParams } from './ConsoleParams';
import { getErrorMessage } from './getErrorMessage';
import { pkgDir } from './pkgDir';

type Update = {
  [K in keyof Config]-?: Config[K] extends Record<string, object>
    ? Config[K][string] extends Actionable
      ? { value: Record<string, string> }
      : never
    : never;
};

interface UpdateConfigParams extends ConsoleParams {
  batch: string;
}

export const updateConfig = async ({
  batch,
  configPath,
  stdOut,
}: UpdateConfigParams) => {
  try {
    if (stdOut)
      process.stdout.write(
        chalk.black.bold(`\nUpdating config file from batch '${batch}...`),
      );

    // Load & parse config file.
    const config = await readConfig(configPath);

    // Validate batch.
    if (!config.batches?.[batch]) {
      if (stdOut) process.stdout.write(chalk.red.bold(' Unknown batch!\n\n'));
      process.exit(1);
    }

    // Configure shell client.
    const $ = execa({
      cwd: resolve(pkgDir, config.batches[batch].path),
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

    if (stdOut) process.stdout.write(chalk.black.bold(' Done!\n'));
  } catch (error) {
    if (stdOut) {
      process.stdout.write(chalk.red.bold(' Error!\n\n'));
      console.log(chalk.red(getErrorMessage(error)), '\n');
    }

    process.exit(1);
  }
};
