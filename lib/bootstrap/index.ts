import { Command } from '@commander-js/extra-typings';
import chalk from 'chalk';

export const bootstrapCommand = new Command()
  .name('bootstrap')
  .description('Bootstraps AWS infrastructure.')
  .enablePositionalOptions()
  .passThroughOptions()
  .requiredOption(
    '-a, --access-key <string>',
    'Terraform Init user AWS Access Key',
  )
  .requiredOption(
    '-s, --secret-key <string>',
    'Terraform Init user AWS Access Key',
  )
  .action(({ accessKey, secretKey }) => {
    process.stdout.write(
      chalk.black.bold('*** BOOTSTRAPPING AWS INFRASTRUCTURE ***\n\n'),
    );

    process.stdout.write(chalk.black.bold('AWS Access Key: '));
    process.stdout.write(chalk.black.dim(`${accessKey}\n`));

    process.stdout.write(chalk.black.bold('AWS Secret Key: '));
    process.stdout.write(chalk.black.dim(`${secretKey}\n`));

    process.stdout.write('\n');
  });
