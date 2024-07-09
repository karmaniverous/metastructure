import { Command } from '@commander-js/extra-typings';

import { initCommand } from './init';

const cli = new Command()
  .name('nr cli')
  .description('AWS Infrastructure CLI tool.')
  .enablePositionalOptions()
  .passThroughOptions()
  .addCommand(initCommand);

cli.parse();
