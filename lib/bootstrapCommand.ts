import { Command } from '@commander-js/extra-typings';
import chalk from 'chalk';
import { $ } from 'execa';
import { resolve } from 'path';

import pkgDir from './pkgDir';

export const bootstrapCommand = new Command()
  .name('bootstrap')
  .description('Bootstraps AWS infrastructure.')
  .enablePositionalOptions()
  .passThroughOptions()
  .option('-l, --local-state', 'Use local state.')
  .action(async ({ localState }) => {
    process.stdout.write(
      chalk.black.bold(
        `*** BOOTSTRAPPING AWS INFRASTRUCTURE${localState ? ' WITH LOCAL STATE' : ''} ***\n\n`,
      ),
    );

    if (localState) {
      const $$ = $({
        cwd: resolve(pkgDir, 'src/contexts/bootstrap'),
        stdio: 'inherit',
      });

      await $$`nr cli config -l`;
      await $$`terraform init`;
      await $$`terraform apply`;
    }

    process.stdout.write('\n');
  });
