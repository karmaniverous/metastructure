import { Handlebars } from '@karmaniverous/handlebars';
import chalk from 'chalk';
import fs from 'fs-extra';
import { resolve } from 'path';

import { type Config } from './Config';
import { type ConsoleParams } from './ConsoleParams';
import pkgDir from './pkgDir';
import templateConfigs from './templateConfigs';

interface ProcessTemplatesParams extends ConsoleParams {
  config?: Config;
  localState?: boolean;
}

export const processTemplates = async ({
  config,
  stdOut,
  ...params
}: ProcessTemplatesParams = {}) => {
  if (stdOut)
    process.stdout.write(chalk.black.bold('Processing templates...\n'));

  for (const templateConfig of templateConfigs) {
    if (stdOut)
      process.stdout.write(
        chalk.black.dim(`Generating ${templateConfig.path}...`),
      );

    try {
      // Load & compile template.
      const template = Handlebars.compile(
        await fs.readFile(
          resolve(pkgDir, 'lib/templates', templateConfig.template),
          'utf8',
        ),
      );

      // Render template.
      const rendered = template({ ...config, config: templateConfig, params });

      // Write to file.
      await fs.outputFile(resolve(pkgDir, templateConfig.path), rendered);

      if (stdOut) process.stdout.write(chalk.green.dim(' Done!\n'));
    } catch (error) {
      if (stdOut) process.stdout.write(chalk.red(' Processing error!\n\n'));
      console.log(chalk.red(error), '\n');
      process.exit();
    }
  }

  if (stdOut) process.stdout.write(chalk.green.bold('Done!\n\n'));
};
