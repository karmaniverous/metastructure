import { Command } from '@commander-js/extra-typings';
import { Handlebars } from '@karmaniverous/handlebars';
import chalk from 'chalk';
import { $ } from 'execa';
import fs from 'fs-extra';
import { resolve } from 'path';
import { packageDirectory } from 'pkg-dir';
import yaml from 'yaml';

import { type Config, ConfigSchema } from './config';
import templateConfigs from './templates/templateConfigs';

export const initCommand = new Command()
  .name('init')
  .description('Initializes project from config.yml.')
  .enablePositionalOptions()
  .passThroughOptions()
  .action(async () => {
    // Locate package root.
    const pkgDir = await packageDirectory();

    if (!pkgDir) {
      throw new Error('No package directory found');
    }

    // Load & parse project config.
    let config: Config;
    try {
      process.stdout.write(chalk.black.bold('Parsing config.yml...'));

      config = ConfigSchema.parse(
        yaml.parse(
          await fs.readFile(resolve(pkgDir, './iac/config.yml'), 'utf8'),
        ),
      );

      process.stdout.write(chalk.green.bold(' Done!\n\n'));
    } catch (error) {
      process.stdout.write(chalk.red.bold(' Parsing error!\n\n'));
      console.log(chalk.red(error), '\n');
      process.exit();
    }

    // Process templates.
    process.stdout.write(chalk.black.bold('Processing templates...\n'));

    for (const templateConfig of templateConfigs) {
      process.stdout.write(
        chalk.black.dim(`Generating ${templateConfig.path}...`),
      );

      try {
        // Load & compile template.
        const template = Handlebars.compile(
          await fs.readFile(
            resolve(pkgDir, 'src/init/templates', templateConfig.template),
            'utf8',
          ),
        );

        // Render template.
        const rendered = template({ ...config, config: templateConfig });

        // Write to file.
        await fs.outputFile(resolve(pkgDir, templateConfig.path), rendered);

        process.stdout.write(chalk.green.dim(' Done!\n'));
      } catch (error) {
        process.stdout.write(chalk.red(' Processing error!\n\n'));
        console.log(chalk.red(error), '\n');
        process.exit();
      }
    }

    process.stdout.write(chalk.green.bold('Done!\n\n'));

    // Apply notices.
    process.stdout.write(chalk.black.bold('Applying license headers...\n'));
    let licenseOutput = '';
    try {
      ({ stdout: licenseOutput } = await $`license-check-and-add add`);
    } catch {} // eslint-disable-line no-empty

    if (licenseOutput) console.log(chalk.black.dim(licenseOutput));

    process.stdout.write(chalk.green.bold('Done!\n\n'));

    // Format files.
    process.stdout.write(chalk.black.bold('Formatting files...\n'));

    const { stdout: formatOutput } =
      await $`terraform fmt -recursive ${resolve(pkgDir, 'iac')}`;

    console.log(chalk.black.dim(formatOutput));

    process.stdout.write(chalk.green.bold('Done!\n\n'));

    // Install Lefthook.
    process.stdout.write(chalk.black.bold('Installing Lefthook...\n'));

    const { stdout: lefthookOutput } = await $`npx lefthook install`;

    console.log(chalk.black.dim(lefthookOutput));

    process.stdout.write(chalk.green.bold('Done!\n\n'));
  });
