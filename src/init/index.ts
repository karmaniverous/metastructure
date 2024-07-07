import chalk from 'chalk';
import fs from 'fs-extra';
import { resolve } from 'path';
import { packageDirectory } from 'pkg-dir';
import { inspect } from 'util';
import yaml from 'yaml';

import { KarmaConfigSchema } from './config';

const pkgDir = await packageDirectory();

if (!pkgDir) {
  throw new Error('No package directory found');
}

try {
  console.log(chalk.black('Parsing config.yml...\n'));

  const config = KarmaConfigSchema.parse(
    yaml.parse(
      await fs.readFile(resolve(pkgDir, './infrastructure/config.yml'), 'utf8'),
    ),
  );

  console.log(chalk.green.bold('Done!\n'));

  console.log(chalk.green(inspect(config, false, null)), '\n');
} catch (error) {
  console.log(chalk.red.bold('Parsing error!\n'));

  console.log(chalk.red(error));
}
