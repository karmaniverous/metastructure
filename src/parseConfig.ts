import { Handlebars } from '@karmaniverous/handlebars';
import chalk from 'chalk';

import { type Config } from './Config';
import { readConfigFile } from './configFile';
import { type ConsoleParams } from './ConsoleParams';
import { getErrorMessage } from './getErrorMessage';

export const parseConfig = async ({
  configPath,
  stdOut,
}: ConsoleParams = {}) => {
  let config: Config;

  try {
    if (stdOut)
      process.stdout.write(chalk.black.bold('Parsing config file...'));

    // Load & parse config file.
    config = await readConfigFile(configPath);

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

  return config;
};
