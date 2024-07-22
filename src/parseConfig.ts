import { Handlebars } from '@karmaniverous/handlebars';
import chalk from 'chalk';
import _ from 'lodash';
import { inspect } from 'util';

import { type Config, configSchema } from './Config';
import { readConfig } from './configFile';
import { getErrorMessage } from './getErrorMessage';

interface ParseConfigParams {
  assumeRole?: string | null;
  awsProfile?: string | null;
  batch: string;
  debug?: boolean;
  path?: string;
  permissionSet?: string | null;
  stdOut?: boolean;
  useLocalState?: boolean;
}

export const parseConfig = async ({
  assumeRole,
  awsProfile,
  batch,
  debug,
  path,
  permissionSet,
  stdOut,
  useLocalState,
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
    if (rawConfig.batches?.[batch])
      rawConfig.batches[batch].cli_defaults = _.merge(
        rawConfig.batches[batch].cli_defaults ?? {},
        {
          assume_role: assumeRole,
          aws_profile: awsProfile,
          permission_set: permissionSet,
          use_local_state: useLocalState,
        },
      );

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
