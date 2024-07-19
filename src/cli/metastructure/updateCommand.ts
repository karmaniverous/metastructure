import { Command } from '@commander-js/extra-typings';
import chalk from 'chalk';
import _ from 'lodash';
import { packageDirectory } from 'pkg-dir';

import { applyLicenseHeaders } from '../../applyLicenseHeaders';
import { updateConfig } from '../../updateConfig';
import { type GlobalCliOptions } from '.';

export const updateCommand = new Command()
  .name('update')
  .description('Update config from batch output.')
  .enablePositionalOptions()
  .passThroughOptions()
  .argument('<batch>', 'batch name')
  .action(async (batch, options, cmd) => {
    const { debug, configPath: path }: typeof options & GlobalCliOptions =
      cmd.optsWithGlobals();

    process.stdout.write(
      chalk.black.bold(
        `*** UPDATING CONFIG FROM ${_.startCase(batch).toUpperCase()} BATCH ***\n\n`,
      ),
    );

    try {
      const { configPath } = await updateConfig({ batch, path, stdOut: true });

      // Apply license headers.
      await applyLicenseHeaders({
        pkgDir: (await packageDirectory({ cwd: configPath })) ?? '.',
        stdOut: true,
      });
    } catch (error) {
      if (debug) throw error;
    }

    process.stdout.write('\n');
  });
