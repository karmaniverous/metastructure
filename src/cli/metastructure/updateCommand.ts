import { Command } from '@commander-js/extra-typings';

import { updateConfig } from '../../updateConfig';
import { type GlobalCliOptions } from '.';

export const updateCommand = new Command()
  .name('update')
  .description('Update config from batch output.')
  .enablePositionalOptions()
  .passThroughOptions()
  .helpOption('-h, --help', 'Display command help.')
  .action(async (options, cmd) => {
    const {
      batch,
      debug,
      configPath: path,
    }: typeof options & GlobalCliOptions = cmd.optsWithGlobals();

    try {
      await updateConfig({
        batch,
        debug,
        path,
        stdOut: true,
      });
    } catch (error) {
      if (debug) throw error;
      else process.exit(1);
    }
  });
