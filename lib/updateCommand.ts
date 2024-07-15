import { Command } from '@commander-js/extra-typings';
import chalk from 'chalk';

import { updateConfig } from './updateConfig';

export const updateCommand = new Command()
  .name('update')
  .description('Updates config.yml from Terraform output.')
  .enablePositionalOptions()
  .passThroughOptions()
  .action(async () => {
    process.stdout.write(
      chalk.black.bold(`*** UPDATING config.yml FROM TERRAFORM OUTPUT ***\n\n`),
    );

    try {
      await updateConfig({ stdOut: true });
    } catch {
      /* empty */
    }

    process.stdout.write('\n');
  });
