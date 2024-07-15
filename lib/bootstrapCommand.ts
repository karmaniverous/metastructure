import { Command } from '@commander-js/extra-typings';
import chalk from 'chalk';
import { $ as execa } from 'execa';
import { resolve } from 'path';

import { applyLicenseHeaders } from './applyLicenseHeaders';
import { formatFiles } from './formatFiles';
import { parseConfig } from './parseConfig';
import pkgDir from './pkgDir';
import { processTargets } from './processTargets';
import { updateConfig } from './updateConfig';

export const bootstrapCommand = new Command()
  .name('bootstrap')
  .description('Bootstraps AWS infrastructure.')
  .enablePositionalOptions()
  .passThroughOptions()
  .option('-c, --config-path <string>', 'Config file path relative to CWD.')
  .option('-l, --local-state', 'Use local state.')
  .option('-m, --migrate-state', 'Migrate state.')
  .action(async ({ configPath, localState, migrateState }) => {
    process.stdout.write(
      chalk.black.bold(
        `*** BOOTSTRAPPING AWS INFRASTRUCTURE${localState ? ' WITH LOCAL STATE' : ''} ***\n\n`,
      ),
    );

    try {
      // Load & parse project config.
      const config = await parseConfig({ configPath, stdOut: true });

      // Process templates.
      await processTargets({ localState, config, stdOut: true });

      // Configure shell client.
      const $ = execa({
        cwd: resolve(pkgDir, config.terraform.paths.bootstrap),
        shell: true,
        stdio: 'inherit',
      });

      // Initialize Terraform.
      await $`terraform init${migrateState ? ' -migrate-state' : ''}`;

      // Apply Terraform.
      await $`terraform apply`;

      // Update config with Terraform outputs.
      await updateConfig({ stdOut: true });

      // Apply license headers.
      await applyLicenseHeaders({ stdOut: true });

      // Format files.
      await formatFiles({ stdOut: true });
    } catch {
      /* empty */
    }

    process.stdout.write('\n');
  });
