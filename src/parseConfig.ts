import { Handlebars } from '@karmaniverous/handlebars';
import chalk from 'chalk';
import _ from 'lodash';
import { inspect } from 'util';

import { type Config, configSchema } from './Config';
import { readConfig } from './configFile';
import { getErrorMessage } from './getErrorMessage';

interface ParseConfigParams {
  awsProfile?: string | null;
  debug?: boolean;
  localState?: boolean;
  path?: string;
  permissionSet?: string | null;
  stdOut?: boolean;
}

export const parseConfig = async ({
  awsProfile,
  debug,
  localState,
  path,
  permissionSet,
  stdOut,
}: ParseConfigParams) => {
  let config: Config;
  let configPath: string;
  let rawConfig: Config;

  try {
    if (stdOut)
      process.stdout.write(chalk.black.bold('Parsing config file...'));

    // Load & parse config file.
    ({ rawConfig, configPath } = await readConfig(path));

    // Override cli defaults.
    if (rawConfig.batches)
      for (const batch of _.values(rawConfig.batches))
        _.merge(batch.cli_defaults, {
          aws_profile: awsProfile,
          sso_permission_set: permissionSet,
          use_local_state: localState,
        });

    config = configSchema.parse(rawConfig);

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

    throw error;
  }

  if (debug) {
    console.log(chalk.cyan('*** PARSED & EXPANDED CONFIG OBJECT ***'));
    console.log(chalk.cyan(inspect(config, false, null)), '\n');
  }

  return { config, configPath };
};
