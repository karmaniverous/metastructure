import { Handlebars } from '@karmaniverous/handlebars';
import chalk from 'chalk';
import { inspect } from 'util';

import { type Config } from './Config';
import { readConfig } from './configFile';
import { getErrorMessage } from './getErrorMessage';

interface ParseConfigParams {
  debug?: boolean;
  path?: string;
  stdOut?: boolean;
}

export const parseConfig = async ({
  debug,
  path,
  stdOut,
}: ParseConfigParams) => {
  let config: Config;
  let configPath: string;

  try {
    if (stdOut)
      process.stdout.write(chalk.black.bold('Parsing config file...'));

    // Load & parse config file.
    ({ config, configPath } = await readConfig(path));

    // Recursively apply config to itself as a handlebars template.
    let thisPass = JSON.stringify(config);
    let lastPass: string;

    do {
      lastPass = thisPass;

      config = JSON.parse(
        Handlebars.compile(lastPass, { noEscape: true })(config),
      ) as Config;

      thisPass = JSON.stringify(config);
    } while (thisPass !== lastPass);

    if (stdOut) process.stdout.write(chalk.green.bold(' Done!\n\n'));
  } catch (error) {
    if (stdOut) {
      process.stdout.write(chalk.red.bold(' Parsing error!\n\n'));
      console.log(chalk.red(getErrorMessage(error)), '\n');
    }

    process.exit(1);
  }

  if (debug) {
    console.log(chalk.cyan('*** PARSED & EXPANDED CONFIG OBJECT ***'));
    console.log(chalk.cyan(inspect(config, false, null)), '\n');
  }

  return { config, configPath };
};
