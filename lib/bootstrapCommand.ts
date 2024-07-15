import { Command } from '@commander-js/extra-typings';
import chalk from 'chalk';
import { $ as execa } from 'execa';
import { resolve } from 'path';

import pkgDir from './pkgDir';
import { updateConfig } from './updateConfig';

export const bootstrapCommand = new Command()
  .name('bootstrap')
  .description('Bootstraps AWS infrastructure.')
  .enablePositionalOptions()
  .passThroughOptions()
  .option('-l, --local-state', 'Use local state.')
  .option('-m, --migrate-state', 'Migrate state.')
  .option('--throw-errors', 'Throw errors to the calling process.')
  .action(async ({ localState, migrateState, throwErrors }) => {
    process.stdout.write(
      chalk.black.bold(
        `*** BOOTSTRAPPING AWS INFRASTRUCTURE${localState ? ' WITH LOCAL STATE' : ''} ***\n\n`,
      ),
    );

    try {
      const $ = execa({
        cwd: resolve(pkgDir, 'src/contexts/bootstrap'),
        shell: true,
        stdio: 'inherit',
      });

      await $`nr cli config --throw-errors${localState ? ' -l ' : ''}`;
      await $`terraform init${migrateState ? ' -migrate-state' : ''}`;
      await $`terraform apply`;

      await updateConfig({ stdOut: true });
    } catch (error) {
      if (throwErrors) throw error;
    }

    process.stdout.write('\n');
  });
