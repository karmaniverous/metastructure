import { Handlebars } from '@karmaniverous/handlebars';
import chalk from 'chalk';
import fs from 'fs-extra';
import _ from 'lodash';
import { resolve } from 'path';

import { type Config } from './Config';
import { getErrorMessage } from './getErrorMessage';

interface GenerateWorkspaceParams {
  workspace: string;
  config: Config;
  pkgDir: string;
  stdOut?: boolean;
}

export const generateWorkspace = async ({
  workspace,
  config,
  pkgDir,
  stdOut,
}: GenerateWorkspaceParams) => {
  if (stdOut)
    process.stdout.write(
      chalk.black.bold(`Generating workspace '${workspace}'...`),
    );

  // Validate workspace.
  if (!config.workspaces?.[workspace]) {
    if (stdOut) process.stdout.write(chalk.red.bold(' Unknown workspace!\n\n'));
    throw new Error(`Unknown workspace: ${workspace}`);
  }

  if (
    config.workspaces[workspace].generators &&
    _.size(config.workspaces[workspace].generators)
  ) {
    // Load partials.
    const partialsConfig = {
      ...(config.partials ?? {}),
      ...(config.workspaces[workspace].partials ?? {}),
    };

    const [partialKeys, partialPaths] = _.zip(..._.entries(partialsConfig));

    if (_.size(partialKeys)) {
      if (stdOut)
        process.stdout.write(chalk.black.dim(`\nRegistering partials...`));

      try {
        const partials = await Promise.all(
          partialPaths.map((partialPath) =>
            fs.readFile(resolve(pkgDir, partialPath!), 'utf8'),
          ),
        );

        Handlebars.registerPartial(
          _.zipObject(
            partialKeys as string[],
            partials.map((partial) =>
              Handlebars.compile(partial, { noEscape: true }),
            ),
          ),
        );

        if (stdOut) process.stdout.write(chalk.green(' Done!\n'));
      } catch (error) {
        if (stdOut) {
          process.stdout.write(chalk.red(' Processing error!\n\n'));
          console.log(chalk.red(getErrorMessage(error)), '\n');
        }

        throw error;
      }
    }

    // Generate artifacts.
    for (const [targetPath, templatePath] of _.entries(
      config.workspaces[workspace].generators,
    )) {
      if (stdOut)
        process.stdout.write(chalk.black.dim(`\nGenerating ${targetPath}...`));

      try {
        // Load & compile template.
        const template = Handlebars.compile(
          await fs.readFile(resolve(pkgDir, templatePath), 'utf8'),
          { noEscape: true },
        );

        // Write to file.
        await fs.outputFile(resolve(pkgDir, targetPath), template(config));

        if (stdOut) process.stdout.write(chalk.green(' Done!'));
      } catch (error) {
        if (stdOut) {
          process.stdout.write(chalk.red(' Processing error!\n\n'));
          console.log(chalk.red(getErrorMessage(error)), '\n');
        }

        throw error;
      }
    }
  } else if (stdOut)
    process.stdout.write(chalk.black.dim(' No templates.\n\n'));

  if (stdOut) process.stdout.write(chalk.green.bold('\nDone!\n\n'));
};
