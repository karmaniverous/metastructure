import { Command } from '@commander-js/extra-typings';

import { bootstrapCommand } from './bootstrapCommand';
import { configCommand } from './configCommand';
import { updateCommand } from './updateCommand';

const cli = new Command()
  .name('nr cli')
  .description('AWS Infrastructure CLI tool.')
  .enablePositionalOptions()
  .passThroughOptions()
  .addCommand(configCommand)
  .addCommand(bootstrapCommand)
  .addCommand(updateCommand);

cli.parse();
