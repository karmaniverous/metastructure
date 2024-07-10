import { Handlebars } from '@karmaniverous/handlebars';
import chalk from 'chalk';
import fs from 'fs-extra';
import { resolve } from 'path';

import { type Config } from './Config';
import { type ConsoleParams } from './ConsoleParams';
import pkgDir from './pkgDir';

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

  if (config?.templates_path && config.templates?.length)
    for (const templateConfig of config.templates) {
      if (stdOut)
        process.stdout.write(
          chalk.black.dim(`Generating ${templateConfig.target}...`),
        );

      try {
        // Load & compile template.
        const template = Handlebars.compile(
          await fs.readFile(
            resolve(pkgDir, config.templates_path, templateConfig.template),
            'utf8',
          ),
          { noEscape: true },
        );

        // Render template.
        const rendered = template({
          ...config,
          config: templateConfig.config ?? {},
          params,
        });

        // Write to file.
        await fs.outputFile(resolve(pkgDir, templateConfig.target), rendered);

        if (stdOut) process.stdout.write(chalk.green.dim(' Done!\n'));
      } catch (error) {
        if (stdOut) process.stdout.write(chalk.red(' Processing error!\n\n'));
        console.log(chalk.red(error), '\n');
        process.exit();
      }
    }
  else if (stdOut) process.stdout.write(chalk.black.dim('No templates.\n'));

  if (stdOut) process.stdout.write(chalk.green.bold('Done!\n\n'));
};
