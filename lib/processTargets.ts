import { Handlebars } from '@karmaniverous/handlebars';
import chalk from 'chalk';
import fs from 'fs-extra';
import _ from 'lodash';
import { resolve } from 'path';

import { type Config } from './Config';
import { type ConsoleParams } from './ConsoleParams';
import pkgDir from './pkgDir';

interface processTargetsParams extends ConsoleParams {
  config?: Config;
  localState?: boolean;
}

export const processTargets = async ({
  config,
  stdOut,
  ...params
}: processTargetsParams = {}) => {
  if (stdOut) process.stdout.write(chalk.black.bold('Processing targets...\n'));

  if (config?.templates_path && _.size(config.targets))
    for (const [target, targetConfig] of _.entries(config.targets)) {
      if (stdOut)
        process.stdout.write(chalk.black.dim(`Generating ${target}...`));

      try {
        // Load & compile template.
        const template = Handlebars.compile(
          await fs.readFile(
            resolve(pkgDir, config.templates_path, targetConfig.template),
            'utf8',
          ),
          { noEscape: true },
        );

        // Render template.
        const rendered = template({
          ...config,
          config: targetConfig.config ?? {},
          params,
        });

        // Write to file.
        await fs.outputFile(resolve(pkgDir, target), rendered);

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
