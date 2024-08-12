import chalk from 'chalk';
import { execa } from 'execa';
import _ from 'lodash';
import { resolve } from 'path';
import { inspect } from 'util';

import { awsCredentials } from './awsCredentials';
import { readConfig, writeConfig } from './configFile';
import { getErrorMessage } from './getErrorMessage';

interface UpdateConfigParams {
  workspace: string;
  configPath?: string;
  debug?: boolean;
  stdOut?: boolean;
}

export const updateConfig = async ({
  workspace,
  configPath: path,
  debug,
  stdOut,
}: UpdateConfigParams) => {
  try {
    if (stdOut)
      process.stdout.write(chalk.black.bold(`Updating config file...`));

    // Load config file.
    const { pkgDir, rawConfig: config, configPath } = await readConfig(path);

    // Validate workspace.
    if (!config.workspaces?.[workspace]) {
      if (stdOut)
        process.stdout.write(chalk.red.bold(' Unknown workspace!\n\n'));
      throw new Error(`Unknown workspace: ${workspace}`);
    }

    // Configure shell client.
    const $ = execa({
      cwd: resolve(pkgDir, config.workspaces[workspace].path),
      env: {
        ...(await awsCredentials({
          workspace,
          config,
          debug,
          pkgDir,
          stdOut,
        })),
        ...(debug ? { TF_LOG: 'DEBUG' } : {}),
      },
      shell: true,
    });

    // Check workspace & switch if necessary.
    const { stdout } = await $`terraform workspace show`;
    if (stdout !== workspace) {
      if (stdOut) console.log(chalk.black.bold('Switching workspace...\n'));
      await $({
        stdio: 'inherit',
      })`terraform workspace select -or-create=true ${workspace}`;
    }

    // Retrieve & conform outputs from Terraform.
    const update = _.mapValues(
      JSON.parse((await $`terraform output -json`).stdout.toString()),
      'value',
    );

    if (debug) {
      console.log(chalk.cyan('*** UPDATE OBJECT ***'));
      console.log(chalk.cyan(inspect(update, false, null)), '\n');
    }

    // Merge update & write updated config to file.
    _.merge(config, update);
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
