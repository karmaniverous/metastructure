import { Command } from '@commander-js/extra-typings';
import chalk from 'chalk';
import { packageDirectory } from 'pkg-dir';

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
    const {
      configPath: path,
      localState,
    }: typeof options & { configPath?: string } = cmd.optsWithGlobals();

    process.stdout.write(
      chalk.black.bold(
        `*** GENERATING INFRASTRUCTURE BATCH "${batch}" ***\n\n`,
      ),
    );

    try {
      // Load & parse project config.
      const { config, configPath } = await parseConfig({ path, stdOut: true });

      const pkgDir = (await packageDirectory({ cwd: configPath })) ?? '.';

      // Process templates.
      await generateBatch({ batch, localState, config, pkgDir, stdOut: true });

      // Apply license headers.
      await applyLicenseHeaders({ pkgDir, stdOut: true });

      // Format files.
      await formatFiles({ config, pkgDir, stdOut: true });
    } catch {
      /* empty */
    }

    process.stdout.write('\n');
  });
