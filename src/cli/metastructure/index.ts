#!/usr/bin/env node

import { Command } from '@commander-js/extra-typings';
import chalk from 'chalk';
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
  .description('Generate & manage infrastructure code.')
  .enablePositionalOptions()
  .passThroughOptions()
  .requiredOption('-b, --batch <string>', 'Batch name (required).')
  .option('-p, --aws-profile <string>', 'AWS profile.')
  .option('-s, --permission-set <string>', 'SSO permission set.')
  .option('-l, --local-state', 'Use local state.')
  .option('-c, --config-path <string>', 'Config file path relative to CWD.')
  .option('-d, --debug', 'Enable debug logging.')
  .helpOption('-h, --help', 'Display command help.')
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
      permissionSet,
    } = cmd.opts();

    process.stdout.write(chalk.black.bold('Batch: '));
    process.stdout.write(chalk.blue.bold(`${batch}\n\n`));

    try {
      // Load & parse project config.
      const { config, configPath } = await parseConfig({
        awsProfile,
        debug,
        localState,
        path,
        permissionSet,
        stdOut: true,
      });

      const generatorParams = config.batches?.[batch].cli_defaults;

      if (_.size(generatorParams)) {
        console.log(chalk.black.bold('Generator Params'));

        const maxKeyLength =
          _.max(
            _.entries(generatorParams).map(([key, value]) =>
              value ? key.length : 0,
            ),
          ) ?? 0;

        for (const [key, value] of _.entries(generatorParams))
          if (value) {
            process.stdout.write(
              chalk.black(`${key}:`.padEnd(maxKeyLength + 2)),
            );
            process.stdout.write(chalk.blue(`${value.toString()}\n`));
          }

        console.log('');
      }
      _.set(cmd, 'metaValues.terraformPaths', config.terraform.paths);

      const pkgDir = (await packageDirectory({ cwd: configPath })) ?? '.';
      _.set(cmd, 'metaValues.pkgDir', pkgDir);

      // Process templates if not update command.
      if (action !== 'update')
        await generateBatch({
          batch,
          config,
          pkgDir,
          stdOut: true,
        });
    } catch (error) {
      if (debug) throw error;
      else process.exit(1);
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
  });

cli.parse();

export type GlobalCliOptions = ReturnType<typeof cli.opts>;
