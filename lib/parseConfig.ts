import chalk from 'chalk';
import fs from 'fs-extra';
import { resolve } from 'path';
import yaml from 'yaml';

import { Config, ConfigSchema } from './Config';
import { type ConsoleParams } from './ConsoleParams';
import pkgDir from './pkgDir';

export const parseConfig = async ({ stdOut }: ConsoleParams = {}) => {
  let config: Config;

  try {
    if (stdOut) process.stdout.write(chalk.black.bold('Parsing config.yml...'));

    config = ConfigSchema.parse(
      yaml.parse(
        await fs.readFile(resolve(pkgDir, './src/config.yml'), 'utf8'),
      ),
    );

    if (stdOut) process.stdout.write(chalk.green.bold(' Done!\n\n'));
  } catch (error) {
    if (stdOut) {
      process.stdout.write(chalk.red.bold(' Parsing error!\n\n'));
      console.log(chalk.red(error), '\n');
    }
    process.exit();
  }

  return config;
};
