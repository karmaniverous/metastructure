import { Command } from '@commander-js/extra-typings';
import chalk from 'chalk';

import { applyLicenseHeaders } from './applyLicenseHeaders';
import { formatFiles } from './formatFiles';
import { parseConfig } from './parseConfig';
import { processTemplates } from './processTemplates';

export const configCommand = new Command()
  .name('config')
  .description('Process config.yml with config templates.')
  .enablePositionalOptions()
  .passThroughOptions()
  .option('-l, --local-state', 'Use local state.')
  .action(async ({ localState }) => {
    process.stdout.write(
      chalk.black.bold('*** CONFIGURING INFRASTRUCTURE PROJECT ***\n\n'),
    );

    // Load & parse project config.
    const config = await parseConfig({ stdOut: true });

    // Process templates.
    await processTemplates({ localState, config, stdOut: true });

    // Apply license headers.
    await applyLicenseHeaders({ stdOut: true });

    // Format files.
    await formatFiles({ stdOut: true });

    process.stdout.write('\n');
  });
