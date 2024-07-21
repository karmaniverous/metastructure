import { Command, Option } from '@commander-js/extra-typings';
import { $ as execa } from 'execa';
import { resolve } from 'path';

import { updateConfig } from '../../updateConfig';
import { type GlobalCliOptions, type MetaCommand } from '.';

export const applyCommand = new Command()
  .name('apply')
  .description('Apply batch & update config.')
  .enablePositionalOptions()
  .passThroughOptions()
  .option('-m, --migrate-state', 'migrate state')
  .addOption(
    new Option('-r, --reconfigure', 'reconfigure state').conflicts(
      'migrateState',
    ),
  )
  .action(async (options, cmd) => {
    const {
      batch,
      configPath,
      debug,
      migrateState,
      reconfigure,
    }: typeof options & GlobalCliOptions = cmd.optsWithGlobals();

    const {
      metaValues: { config, pkgDir },
    } = cmd as unknown as MetaCommand;

    try {
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
      await updateConfig({ batch, debug, path: configPath, stdOut: true });
    } catch (error) {
      if (debug) throw error;
    }
  });
