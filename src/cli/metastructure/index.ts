#!/usr/bin/env node

import { Command } from '@commander-js/extra-typings';

import { applyCommand } from './applyCommand';
import { generateCommand } from './generateCommand';
import { updateCommand } from './updateCommand';

const cli = new Command()
  .name('metastructure')
  .description('Generate & manage infrastructure artifacts.')
  .enablePositionalOptions()
  .passThroughOptions()
  .option('-c, --config-path <string>', 'config file path relative to CWD')
  .option('-d, --debug <string>', 'enable debug logging.')
  .addCommand(generateCommand)
  .addCommand(applyCommand)
  .addCommand(updateCommand);

cli.parse();

export type GlobalCliOptions = ReturnType<typeof cli.opts>;
