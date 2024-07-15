import { Command } from '@commander-js/extra-typings';
import chalk from 'chalk';

import { updateConfig } from './updateConfig';

export const updateCommand = new Command()
  .name('update')
  .description('Updates config.yml from Terraform output.')
  .enablePositionalOptions()
  .passThroughOptions()
  .option('--throw-errors', 'Throw errors to the calling process.')
  .action(async ({ throwErrors }) => {
    process.stdout.write(
      chalk.black.bold(`*** UPDATING config.yml FROM TERRAFORM OUTPUT ***\n\n`),
    );

    try {
      await updateConfig({ stdOut: true });
    } catch (error) {
      if (throwErrors) throw error;
    }

    process.stdout.write('\n');
  });
