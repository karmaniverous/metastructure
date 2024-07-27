import chalk from 'chalk';
import { $ } from 'execa';
import _ from 'lodash';
import { resolve } from 'path';
import { inspect } from 'util';

import { type Config } from './Config';

let awsEnv: Record<string, string> | undefined;
let awsProfile: string | undefined;

interface awsCredentialsParams {
  batch: string;
  config: Config;
  debug?: boolean;
  pkgDir: string;
  stdOut?: boolean;
}

export const awsCredentials = async ({
  batch,
  config,
  debug,
  pkgDir,
  stdOut,
}: awsCredentialsParams) => {
  const permissionSet = config.cli_params?.permission_set;

  if (permissionSet) {
    const profile = _.entries(
      config.sso?.reference?.account_permission_sets,
    ).find(([, permissionSets]) => permissionSets.includes(permissionSet))?.[0];

    if (profile) {
      if (stdOut)
        console.log(chalk.black.bold(`Authenticating AWS credentials...\n`));

      try {
        await $({
          cwd: pkgDir,
          env: {
            AWS_CONFIG_FILE: resolve(
              pkgDir,
              config.batches?.[batch]?.shared_config_path ?? '',
            ),
          },
          stdio: 'inherit',
        })`aws sso login --profile ${profile}`;

        if (stdOut) console.log(chalk.green.bold(`\nDone!\n`));
      } catch (error) {
        if (stdOut) console.log(chalk.red.bold(`\nFailed!\n`));
        throw error;
      }
    }
  } else {
    const profile = config.cli_params?.aws_profile;

    if (profile && (profile !== awsProfile || !awsEnv)) {
      if (stdOut)
        process.stdout.write(chalk.black.bold(`Acquiring AWS credentials...`));

      try {
        const { stdout } =
          await $`aws configure export-credentials --profile ${profile}`;

        const {
          AccessKeyId: AWS_ACCESS_KEY_ID,
          SecretAccessKey: AWS_SECRET_ACCESS_KEY,
          SessionToken: AWS_SESSION_TOKEN,
        } = JSON.parse(stdout.toString()) as Record<string, string>;

        awsEnv = {
          AWS_ACCESS_KEY_ID,
          AWS_SECRET_ACCESS_KEY,
          AWS_SESSION_TOKEN,
        };

        awsProfile = profile;

        if (stdOut) process.stdout.write(chalk.green.bold(` Done!\n\n`));

        if (debug) {
          console.log(chalk.cyan('*** AWS CREDENTIALS ***'));
          console.log(chalk.cyan(inspect(awsEnv, false, null)), '\n');
        }
      } catch (error) {
        if (stdOut) process.stdout.write(chalk.red.bold(` Failed!\n`));
        throw error;
      }
    }

    return awsEnv;
  }
};
