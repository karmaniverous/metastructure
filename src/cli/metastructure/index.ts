#!/usr/bin/env node

import { Command } from '@commander-js/extra-typings';
import _ from 'lodash';
import { packageDirectory } from 'pkg-dir';

import { applyLicenseHeaders } from '../../applyLicenseHeaders';
import { type Config } from '../../Config';
import { formatFiles } from '../../formatFiles';
import { generateBatch } from '../../generateBatch';
import { parseConfig } from '../../parseConfig';
import { applyCommand } from './applyCommand';
import { updateCommand } from './updateCommand';

/**
 * Enables passing of values to lifecycle hooks & subcommands.
 */
export interface MetaCommand extends Command {
  metaValues: {
    config: Config;
    pkgDir: string;
    terraformPaths: string | string[];
  };
}

const cli = new Command()
  .name('metastructure')
  .description('Generate & manage infrastructure artifacts.')
  .enablePositionalOptions()
  .passThroughOptions()
  .requiredOption('-b, --batch <string>', 'batch name')
  .option('-p, --aws-profile <string>', 'AWS profile')
  .option('-s, --permission-set <string>', 'SSO permission set')
  .option('-l, --local-state', 'use local state')
  .option('-c, --config-path <string>', 'config file path relative to CWD')
  .option('-d, --debug', 'enable debug logging.')
  .addCommand(applyCommand)
  .addCommand(updateCommand)
  .action(() => {
    _.noop();
  })
  .hook('preAction', async (cmd) => {
    const [action] = cmd.args;

    const {
      awsProfile,
      batch,
      configPath: path,
      debug,
      localState,
    } = cmd.opts();

    try {
      // Load & parse project config.
      const { config, configPath } = await parseConfig({
        debug,
        path,
        stdOut: true,
      });
      _.set(cmd, 'metaValues.terraformPaths', config.terraform.paths);

      const pkgDir = (await packageDirectory({ cwd: configPath })) ?? '.';
      _.set(cmd, 'metaValues.pkgDir', pkgDir);

      // Process templates if not update command.
      if (action !== 'update')
        await generateBatch({
          awsProfile,
          batch,
          localState,
          config,
          pkgDir,
          stdOut: true,
        });
    } catch (error) {
      if (debug) throw error;
    }
  })
  .hook('postAction', async (cmd) => {
    const {
      metaValues: { pkgDir, terraformPaths: paths },
    } = cmd as unknown as MetaCommand;

    // Apply license headers.
    await applyLicenseHeaders({ pkgDir, stdOut: true });

    // Format files.
    await formatFiles({ paths, pkgDir, stdOut: true });

    process.stdout.write('\n');
  });

cli.parse();

export type GlobalCliOptions = ReturnType<typeof cli.opts>;
