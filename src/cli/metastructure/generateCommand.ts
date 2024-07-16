import { Command } from '@commander-js/extra-typings';
import chalk from 'chalk';

import { applyLicenseHeaders } from '../../applyLicenseHeaders';
import { formatFiles } from '../../formatFiles';
import { generateBatch } from '../../generateBatch';
import { parseConfig } from '../../parseConfig';

export const generateCommand = new Command()
  .name('generate')
  .description('Generate infrastructure batch.')
  .enablePositionalOptions()
  .passThroughOptions()
  .option('-l, --local-state', 'Use local state.')
  .argument('<batch>', 'Batch name.')
  .action(async (batch, options, cmd) => {
    const { configPath, localState }: typeof options & { configPath?: string } =
      cmd.optsWithGlobals();

    process.stdout.write(
      chalk.black.bold(
        `*** GENERATING INFRASTRUCTURE BATCH "${batch}" ***\n\n`,
      ),
    );

    try {
      // Load & parse project config.
      const config = await parseConfig({ configPath, stdOut: true });

      // Process templates.
      await generateBatch({ batch, localState, config, stdOut: true });

      // Apply license headers.
      await applyLicenseHeaders({ stdOut: true });

      // Format files.
      await formatFiles({ stdOut: true });
    } catch {
      /* empty */
    }

    process.stdout.write('\n');
  });
