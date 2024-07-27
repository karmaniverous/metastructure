#!/usr/bin/env node

import { Command, Option } from '@commander-js/extra-typings';
import chalk from 'chalk';
import { execa } from 'execa';
import _ from 'lodash';
import { resolve } from 'path';
import { inspect } from 'util';

import { applyLicenseHeaders } from '../../applyLicenseHeaders';
import { awsCredentials } from '../../awsCredentials';
import { type Config } from '../../Config';
import { detectNull } from '../../detectNull';
import { formatFiles } from '../../formatFiles';
import { generateWorkspace } from '../../generateWorkspace';
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
  .requiredOption('-w, --workspace <string>', 'Workspace name (required).')
  .option('-g, --generate', 'Generate workspace from config.')
  .option('-u, --update', 'Update config from workspace output.')
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
      workspace,
      configPath,
      debug,
      generate,
      localStateOff,
      localStateOn,
      permissionSet,
    } = cmd.opts();

    process.stdout.write(chalk.black.bold('Workspace: '));
    process.stdout.write(chalk.blue.bold(`${workspace}\n\n`));

    try {
      // Load & parse project config.
      const { config, pkgDir } = await parseConfig({
        assumeRole: detectNull(assumeRole),
        awsProfile: detectNull(awsProfile),
        workspace,
        debug,
        useLocalState: localStateOn ? true : localStateOff ? false : undefined,
        path: configPath,
        permissionSet: detectNull(permissionSet),
        stdOut: true,
      });

      if (config.cli_params && _.size(config.cli_params)) {
        console.log(chalk.black.bold('Generator Params'));

        const maxKeyLength =
          _.max(
            _.entries(config.cli_params).map(([key, value]) =>
              value ? key.length : 0,
            ),
          ) ?? 0;

        for (const [key, value] of _.entries(config.cli_params))
          if (value) {
            process.stdout.write(
              chalk.black(`${key}:`.padEnd(maxKeyLength + 2)),
            );
            process.stdout.write(
              chalk.blue(`${inspect(value, false, null)}\n`),
            );
          }

        console.log('');
      }

      // Save values to command for use in lifecycle hooks & subcommands.
      _.set(cmd, 'metaValues.config', config);
      _.set(cmd, 'metaValues.pkgDir', pkgDir);
      _.set(cmd, 'metaValues.terraformPaths', config.terraform.paths);

      // Process templates if not update command.
      if (generate)
        await generateWorkspace({
          workspace,
          config,
          pkgDir,
          stdOut: true,
        });
    } catch (error) {
      if (debug) throw error;
      else process.exit(1);
    }
  })
  .action(async (command, { workspace, debug }, cmd) => {
    if (!command.length) return;

    const {
      metaValues: { config, pkgDir },
    } = cmd as unknown as MetaCommand;

    try {
      if (!config.workspaces?.[workspace]) return;

      // Get script client.
      const $ = execa({
        cwd: resolve(pkgDir, config.workspaces[workspace].path),
        env: {
          ...(await awsCredentials({
            workspace,
            config,
            debug,
            pkgDir,
            stdOut: true,
          })),
          ...(debug ? { TF_LOG: 'DEBUG' } : {}),
        },
        shell: true,
      });

      // Check workspace & switch if necessary.
      const { stdout } = await $`terraform workspace show`;
      if (stdout !== workspace) {
        console.log(chalk.black.bold('Switching workspace...\n'));
        await $({
          stdio: 'inherit',
        })`terraform workspace select -or-create=true ${workspace}`;
      }

      console.log(chalk.black.bold('Running command...\n'));
      await $({
        stdio: 'inherit',
      })(command.join(' '));
      console.log(chalk.green.bold('\nDone!\n'));
    } catch (error) {
      console.log(chalk.red.bold('\nCommand failed!\n'));

      if (debug) throw error;
      else process.exit(1);
    }
  })
  .hook('postAction', async (cmd) => {
    const { workspace, configPath, debug, generate, update } = cmd.opts();

    const {
      metaValues: { pkgDir, terraformPaths: paths },
    } = cmd as unknown as MetaCommand;

    // Update config with Terraform outputs.
    if (update)
      await updateConfig({
        workspace,
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
