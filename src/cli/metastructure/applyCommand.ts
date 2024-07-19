import { Command, Option } from '@commander-js/extra-typings';
import chalk from 'chalk';
import { $ as execa } from 'execa';
import { resolve } from 'path';
import { packageDirectory } from 'pkg-dir';

import { applyLicenseHeaders } from '../../applyLicenseHeaders';
import { formatFiles } from '../../formatFiles';
import { generateBatch } from '../../generateBatch';
import { parseConfig } from '../../parseConfig';
import { updateConfig } from '../../updateConfig';
import { type GlobalCliOptions } from '.';

export const applyCommand = new Command()
  .name('apply')
  .description('Generate & apply infrastructure batch.')
  .enablePositionalOptions()
  .passThroughOptions()
  .option('-l, --local-state', 'use local state')
  .option('-m, --migrate-state', 'migrate state')
  .addOption(
    new Option('-r, --reconfigure', 'reconfigure state').conflicts(
      'migrateState',
    ),
  )
  .argument('<batch>', 'Batch name.')
  .action(async (batch, options, cmd) => {
    const {
      configPath: path,
      debug,
      localState,
      migrateState,
      reconfigure,
    }: typeof options & GlobalCliOptions = cmd.optsWithGlobals();

    process.stdout.write(
      chalk.black.bold(
        `*** APPLYING BATCH "${batch}"${localState ? ' WITH LOCAL STATE' : ''} ***\n\n`,
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

      if (!config.batches?.[batch]) throw new Error('Unknown batch!');

      // Configure shell client.
      const $ = execa({
        cwd: resolve(pkgDir, config.batches[batch].path),
        shell: true,
        stdio: 'inherit',
      });

      // Initialize Terraform.
      await $`terraform init${migrateState ? ' -migrate-state' : ''}${reconfigure ? ' -reconfigure' : ''}`;

      // Apply Terraform.
      await $`terraform apply`;

      // Update config with Terraform outputs.
      await updateConfig({ batch, path: configPath, stdOut: true });

      // Apply license headers.
      await applyLicenseHeaders({ pkgDir, stdOut: true });

      // Format files.
      await formatFiles({ config, pkgDir, stdOut: true });
    } catch (error) {
      if (debug) throw error;
    }

    process.stdout.write('\n');
  });
