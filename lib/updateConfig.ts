import chalk from 'chalk';
import { $ as execa } from 'execa';
import fs from 'fs-extra';
import _ from 'lodash';
import { resolve } from 'path';
import yaml from 'yaml';

import { type Actionable, type Config, configSchema } from './Config';
import { type ConsoleParams } from './ConsoleParams';
import { getErrorMessage } from './getErrorMessage';
import pkgDir from './pkgDir';

type Update = {
  [K in keyof Config]-?: Config[K] extends Record<string, object>
    ? Config[K][string] extends Actionable
      ? { value: Record<string, string> }
      : never
    : never;
};

const $ = execa({
  cwd: resolve(pkgDir, 'src/contexts/bootstrap'),
  shell: true,
});

export const updateConfig = async ({ stdOut }: ConsoleParams = {}) => {
  let config: Config;

  try {
    if (stdOut)
      process.stdout.write(chalk.black.bold('\nUpdating config.yml...'));

    // Load & parse config file.
    config = configSchema.parse(
      yaml.parse(
        await fs.readFile(resolve(pkgDir, './src/config.yml'), 'utf8'),
      ),
    );

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
    await fs.writeFile(
      resolve(pkgDir, './src/config.yml'),
      yaml.stringify(config, { doubleQuotedAsJSON: true }),
    );

    if (stdOut) process.stdout.write(chalk.black.bold(' Done!\n'));
  } catch (error) {
    if (stdOut) {
      process.stdout.write(chalk.red.bold(' Error!\n\n'));
      console.log(chalk.red(getErrorMessage(error)), '\n');
    }

    process.exit(1);
  }

  return config;
};
