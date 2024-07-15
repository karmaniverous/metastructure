import { Command } from '@commander-js/extra-typings';
import chalk from 'chalk';

import { applyLicenseHeaders } from './applyLicenseHeaders';
import { formatFiles } from './formatFiles';
import { parseConfig } from './parseConfig';
import { processTargets } from './processTargets';

export const configCommand = new Command()
  .name('config')
  .description('Process config.yml with config templates.')
  .enablePositionalOptions()
  .passThroughOptions()
  .option('-l, --local-state', 'Use local state.')
  .option('--throw-errors', 'Throw errors to the calling process.')
  .action(async ({ localState, throwErrors }) => {
    process.stdout.write(
      chalk.black.bold('*** CONFIGURING INFRASTRUCTURE PROJECT ***\n\n'),
    );

    try {
      // Load & parse project config.
      const config = await parseConfig({ stdOut: true });

      // Process templates.
      await processTargets({ localState, config, stdOut: true });

      // Apply license headers.
      await applyLicenseHeaders({ stdOut: true });

      // Format files.
      await formatFiles({ stdOut: true });
    } catch (error) {
      if (throwErrors) throw error;
    }

    process.stdout.write('\n');
  });
