import chalk from 'chalk';
import { $ } from 'execa';
import { inspect } from 'util';

let awsEnv: Record<string, string> | undefined;
let awsProfile: string | undefined;

interface awsCredentialsParams {
  debug?: boolean;
  profile?: string;
  stdOut?: boolean;
}

export const awsCredentials = async ({
  debug,
  profile,
  stdOut,
}: awsCredentialsParams) => {
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
      if (stdOut) process.stdout.write(chalk.red.bold(` Failed!\n\n`));
      throw error;
    }
  }

  return awsEnv;
};