import { Command } from '@commander-js/extra-typings';
import chalk from 'chalk';

import { applyLicenseHeaders } from './applyLicenseHeaders';
import { formatFiles } from './formatFiles';
import { updateConfig } from './updateConfig';

export const updateCommand = new Command()
  .name('update')
  .description('Updates config.yml from Terraform output.')
  .enablePositionalOptions()
  .passThroughOptions()
  .option('-c, --config-path <string>', 'Config file path relative to CWD.')
  .action(async ({ configPath }) => {
    process.stdout.write(
      chalk.black.bold(`*** UPDATING config.yml FROM TERRAFORM OUTPUT ***\n\n`),
    );

    try {
      await updateConfig({ configPath, stdOut: true });

      // Apply license headers.
      await applyLicenseHeaders({ stdOut: true });

      // Format files.
      await formatFiles({ configPath, stdOut: true });
    } catch {
      /* empty */
    }

    process.stdout.write('\n');
  });
