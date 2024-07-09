import { Command } from '@commander-js/extra-typings';

import { bootstrapCommand } from './bootstrap';
import { initCommand } from './init';

const cli = new Command()
  .name('nr cli')
  .description('AWS Infrastructure CLI tool.')
  .enablePositionalOptions()
  .passThroughOptions()
  .addCommand(bootstrapCommand)
  .addCommand(initCommand);

cli.parse();
