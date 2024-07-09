import { Command } from '@commander-js/extra-typings';

import { bootstrapCommand } from './bootstrapCommand';
import { initCommand } from './initCommand';

const cli = new Command()
  .name('nr cli')
  .description('AWS Infrastructure CLI tool.')
  .enablePositionalOptions()
  .passThroughOptions()
  .addCommand(bootstrapCommand)
  .addCommand(initCommand);

cli.parse();
