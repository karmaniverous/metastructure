import { Command } from '@commander-js/extra-typings';
import chalk from 'chalk';
import { packageDirectory } from 'pkg-dir';

import { applyLicenseHeaders } from '../../applyLicenseHeaders';
import { formatFiles } from '../../formatFiles';
import { generateBatch } from '../../generateBatch';
import { parseConfig } from '../../parseConfig';
import { type GlobalCliOptions } from '.';

export const generateCommand = new Command()
  .name('generate')
  .description('Generate infrastructure batch.')
  .enablePositionalOptions()
  .passThroughOptions()
  .option('-l, --local-state', 'use local state')
  .argument('<batch>', 'batch name')
  .action(async (batch, options, cmd) => {
    const {
      configPath: path,
      debug,
      localState,
    }: typeof options & GlobalCliOptions = cmd.optsWithGlobals();

    process.stdout.write(
      chalk.black.bold(
        `*** GENERATING INFRASTRUCTURE BATCH "${batch}" ***\n\n`,
      ),
    );

    try {
      // Load & parse project config.
      const { config, configPath } = await parseConfig({
        debug,
        path,
        stdOut: true,
      });

      const pkgDir = (await packageDirectory({ cwd: configPath })) ?? '.';

      // Process templates.
      await generateBatch({ batch, localState, config, pkgDir, stdOut: true });

      // Apply license headers.
      await applyLicenseHeaders({ pkgDir, stdOut: true });

      // Format files.
      await formatFiles({ config, pkgDir, stdOut: true });
    } catch (error) {
      if (debug) throw error;
    }

    process.stdout.write('\n');
  });
