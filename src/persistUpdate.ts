import chalk from 'chalk';
import { execa } from 'execa';
import _ from 'lodash';
import { resolve } from 'path';
import { inspect } from 'util';

import { awsCredentials } from './awsCredentials';
import { readConfig, writeConfig } from './configFile';

interface PersistUpdateParams {
  workspace: string;
  configPath?: string;
  debug?: boolean;
  stdOut?: boolean;
  updateOverride: boolean | undefined;
}

export const persistUpdate = async ({
  workspace,
  configPath: path,
  debug,
  stdOut,
  updateOverride,
}: PersistUpdateParams) => {
  if (stdOut)
    process.stdout.write(
      chalk.black.bold(
        `Updating config ${updateOverride ? 'override ' : ''}file...`,
      ),
    );

  // Load config file.
  const { pkgDir, rawConfig, rawOverride, configPath } = await readConfig(path);

  // Validate override path.
  if (updateOverride && !rawConfig.config_override_path) {
    if (stdOut)
      process.stdout.write(chalk.red.bold(' No config override path!\n'));
    throw new Error('No override path specified in config file.');
  }

  // Validate workspace.
  if (!rawConfig.workspaces?.[workspace]) {
    if (stdOut) process.stdout.write(chalk.red.bold(' Unknown workspace!\n\n'));
    throw new Error(`Unknown workspace: ${workspace}`);
  }

  // Configure shell client.
  const $ = execa({
    cwd: resolve(pkgDir, rawConfig.workspaces[workspace].path),
    env: {
      ...(await awsCredentials({
        workspace,
        config: rawConfig,
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
  const config = updateOverride ? rawOverride : rawConfig;

  _.merge(config, update);

  await writeConfig(
    config,
    updateOverride
      ? resolve(pkgDir, rawConfig.config_override_path!)
      : configPath,
  );

  if (stdOut) process.stdout.write(chalk.green.bold(' Done!\n\n'));

  return { configPath };
};
