import { Handlebars } from '@karmaniverous/handlebars';
import chalk from 'chalk';
import fs from 'fs-extra';
import _ from 'lodash';
import { resolve } from 'path';

import { type Config } from './Config';
import { getErrorMessage } from './getErrorMessage';

interface GenerateBatchParams {
  batch: string;
  config: Config;
  localState?: boolean;
  pkgDir: string;
  stdOut?: boolean;
}

export const generateBatch = async ({
  batch,
  config,
  localState,
  pkgDir,
  stdOut,
}: GenerateBatchParams) => {
  if (stdOut)
    process.stdout.write(chalk.black.bold(`Generating batch '${batch}'...`));

  // Validate batch.
  if (!config.batches?.[batch]) {
    if (stdOut) process.stdout.write(chalk.red.bold(' Unknown batch!\n\n'));
    process.exit(1);
  }

  if (_.size(config.batches[batch].generators))
    for (const [targetPath, templatePath] of _.entries(
      config.batches[batch].generators,
    )) {
      if (stdOut)
        process.stdout.write(chalk.black.dim(`\nGenerating ${targetPath}...`));

      try {
        // Load & compile template.
        const template = Handlebars.compile(
          await fs.readFile(resolve(pkgDir, templatePath), 'utf8'),
          { noEscape: true },
        );

        // Render template.
        const rendered = template({
          ...config,
          params: { batch, localState },
        });

        // Write to file.
        await fs.outputFile(resolve(pkgDir, targetPath), rendered);

        if (stdOut) process.stdout.write(chalk.green(' Done!'));
      } catch (error) {
        if (stdOut) {
          process.stdout.write(chalk.red(' Processing error!\n\n'));
          console.log(chalk.red(getErrorMessage(error)), '\n');
        }

        throw error;
      }
    }
  else if (stdOut) process.stdout.write(chalk.black.dim(' No templates.\n\n'));

  if (stdOut) process.stdout.write(chalk.green.bold('\nDone!\n\n'));
};
