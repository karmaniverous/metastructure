import chalk from 'chalk';
import { $ } from 'execa';

import { ConsoleParams } from './ConsoleParams';

export const installLefthook = async ({ stdOut }: ConsoleParams) => {
  if (stdOut)
    process.stdout.write(chalk.black.bold('Installing Lefthook...\n'));

  const { stdout: lefthookOutput } = await $`npx lefthook install`;

  if (stdOut) {
    console.log(chalk.black.dim(lefthookOutput));
    process.stdout.write(chalk.green.bold('Done!\n'));
  }
};
