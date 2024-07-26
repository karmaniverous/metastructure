import { Handlebars } from '@karmaniverous/handlebars';
import chalk from 'chalk';
import fs from 'fs-extra';
import _ from 'lodash';
import { dirname, resolve } from 'path';
import { packageDirectory } from 'pkg-dir';
import { inspect } from 'util';
import { parse } from 'yaml';

import { type Config, configSchema } from './Config';
import { readConfig } from './configFile';
import { getErrorMessage } from './getErrorMessage';

type CliDefaultOverrides = NonNullable<
  NonNullable<Config['batches']>[string]
>['cli_defaults'];

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
  let pkgDir: string;
  let rawConfig: Config;

  try {
    if (stdOut)
      process.stdout.write(chalk.black.bold('Parsing config file...'));

    // Load & parse config file.
    ({ rawConfig, configPath } = await readConfig(path));

    // Validate batch.
    if (!rawConfig.batches?.[batch]) {
      console.log(chalk.red.bold('Unknown batch!\n'));
      throw new Error(`Unknown batch: ${batch}`);
    }

    // Get CLI default overrides.
    pkgDir = (await packageDirectory({ cwd: dirname(configPath) })) ?? '.';

    let cliDefaultOverrides: CliDefaultOverrides = {};

    const rawBatch = rawConfig.batches[batch];

    if (rawBatch.cli_defaults_path) {
      const cliDefaultOverridesPath = resolve(
        pkgDir,
        rawBatch.cli_defaults_path,
      );

      if (await fs.exists(cliDefaultOverridesPath))
        cliDefaultOverrides = parse(
          await fs.readFile(cliDefaultOverridesPath, 'utf8'),
        ) as CliDefaultOverrides;
    }

    // Override CLI params & apply to raw config.
    rawConfig.cli_params = _.defaults(
      {
        assume_role: assumeRole,
        aws_profile: awsProfile,
        batch,
        permission_set: permissionSet,
        use_local_state: useLocalState,
      },
      cliDefaultOverrides,
      rawBatch.cli_defaults,
    );

    // Parse raw config against schema.
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

  return { config, pkgDir };
};
