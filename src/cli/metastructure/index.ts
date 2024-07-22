#!/usr/bin/env node

import { Command, Option } from '@commander-js/extra-typings';
import chalk from 'chalk';
import _ from 'lodash';
import { resolve } from 'path';
import { packageDirectory } from 'pkg-dir';

import { applyLicenseHeaders } from '../../applyLicenseHeaders';
import { type Config } from '../../Config';
import { detectNull } from '../../detectNull';
import { execa } from '../../execa';
import { formatFiles } from '../../formatFiles';
import { generateBatch } from '../../generateBatch';
import { parseConfig } from '../../parseConfig';
import { updateConfig } from '../../updateConfig';

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
  .option('-g, --generate', 'Generate batch from config.')
  .option('-u, --update', 'Update config from batch output.')
  .option('-p, --aws-profile <string>', 'AWS profile.')
  .option('-r, --assume-role <string>', 'Role to assume on target accounts.')
  .option('-s, --permission-set <string>', 'SSO permission set.')
  .option('-L, --local-state-on', 'Use local state (conflicts with -l).')
  .addOption(
    new Option(
      '-l, --local-state-off',
      'Use default state (conflicts with -L).',
    ).conflicts('localStateOn'),
  )
  .option('-c, --config-path <string>', 'Config file path relative to CWD.')
  .option('-d, --debug', 'Enable debug logging.')
  .argument('[command...]', 'Command to run within AWS authentication context.')
  .helpOption('-h, --help', 'Display command help.')
  .hook('preAction', async (cmd) => {
    const {
      assumeRole,
      awsProfile,
      batch,
      configPath: path,
      debug,
      generate,
      localStateOff,
      localStateOn,
      permissionSet,
    } = cmd.opts();

    process.stdout.write(chalk.black.bold('Batch: '));
    process.stdout.write(chalk.blue.bold(`${batch}\n\n`));

    try {
      // Load & parse project config.
      const { config, configPath } = await parseConfig({
        assumeRole: detectNull(assumeRole),
        awsProfile: detectNull(awsProfile),
        batch,
        debug,
        useLocalState: localStateOn ? true : localStateOff ? false : undefined,
        path,
        permissionSet: detectNull(permissionSet),
        stdOut: true,
      });

      _.set(cmd, 'metaValues.config', config);

      if (!config.batches?.[batch]) {
        console.log(chalk.red.bold('Unknown batch!\n'));
        throw new Error(`Unknown batch: ${batch}`);
      }

      const generatorParams = config.batches[batch].cli_defaults;

      if (generatorParams && _.size(generatorParams)) {
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
      if (generate)
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
  .action(async (command, { batch, debug }, cmd) => {
    if (!command.length) return;

    const {
      metaValues: { config, pkgDir },
    } = cmd as unknown as MetaCommand;

    try {
      if (!config.batches?.[batch]) return;

      // Get script client.
      const $ = await execa(
        {
          profile: config.batches[batch].cli_defaults?.aws_profile ?? undefined,
          stdOut: true,
        },
        {
          cwd: resolve(pkgDir, config.batches[batch].path),
          shell: true,
          stdio: 'inherit',
        },
      );

      // Execute command.
      console.log(chalk.black.bold('Running command...\n'));
      await $(command.join(' '));
      console.log(chalk.green.bold('\nDone!\n'));
    } catch (error) {
      console.log(chalk.red.bold('\nCommand failed!\n'));

      if (debug) throw error;
      else process.exit(1);
    }
  })
  .hook('postAction', async (cmd) => {
    const { batch, configPath, debug, generate, update } = cmd.opts();

    const {
      metaValues: { pkgDir, terraformPaths: paths },
    } = cmd as unknown as MetaCommand;

    // Update config with Terraform outputs.
    if (update)
      await updateConfig({
        batch,
        debug,
        configPath,
        stdOut: true,
      });

    if (generate ?? update) {
      // Apply license headers.
      await applyLicenseHeaders({ pkgDir, stdOut: true });

      // Format files.
      await formatFiles({ paths, pkgDir, stdOut: true });
    }
  });

cli.parse();

export type GlobalCliOptions = ReturnType<typeof cli.opts>;
