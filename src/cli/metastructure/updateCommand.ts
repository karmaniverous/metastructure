import { Command } from '@commander-js/extra-typings';
import chalk from 'chalk';
import { packageDirectory } from 'pkg-dir';

import { applyLicenseHeaders } from '../../applyLicenseHeaders';
import { updateConfig } from '../../updateConfig';

export const updateCommand = new Command()
  .name('update')
  .description('Update config from batch output.')
  .enablePositionalOptions()
  .passThroughOptions()
  .argument('<batch>', 'Batch name.')
  .action(async (batch, options, cmd) => {
    const { configPath: path }: typeof options & { configPath?: string } =
      cmd.optsWithGlobals();

    process.stdout.write(
      chalk.black.bold(`*** UPDATING CONFIG FROM BATCH ${batch} ***\n\n`),
    );

    try {
      const { configPath } = await updateConfig({ batch, path, stdOut: true });

      // Apply license headers.
      await applyLicenseHeaders({
        pkgDir: (await packageDirectory({ cwd: configPath })) ?? '.',
        stdOut: true,
      });
    } catch {
      /* empty */
    }

    process.stdout.write('\n');
  });
