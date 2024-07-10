import { Command } from '@commander-js/extra-typings';

import { bootstrapCommand } from './bootstrapCommand';
import { configCommand } from './configCommand';

const cli = new Command()
  .name('nr cli')
  .description('AWS Infrastructure CLI tool.')
  .enablePositionalOptions()
  .passThroughOptions()
  .addCommand(configCommand)
  .addCommand(bootstrapCommand);

cli.parse();
