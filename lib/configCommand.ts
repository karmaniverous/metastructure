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
  .option('-c, --config-path <string>', 'Config file path relative to CWD.')
  .option('-l, --local-state', 'Use local state.')
  .action(async ({ configPath, localState }) => {
    process.stdout.write(
      chalk.black.bold('*** CONFIGURING INFRASTRUCTURE PROJECT ***\n\n'),
    );

    try {
      // Load & parse project config.
      const config = await parseConfig({ configPath, stdOut: true });

      // Process templates.
      await processTargets({ localState, config, stdOut: true });

      // Apply license headers.
      await applyLicenseHeaders({ stdOut: true });

      // Format files.
      await formatFiles({ stdOut: true });
    } catch {
      /* empty */
    }

    process.stdout.write('\n');
  });
