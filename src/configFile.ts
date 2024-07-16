import fs from 'fs-extra';
import { resolve } from 'path';
import yaml from 'yaml';
import { z } from 'zod';

import { Config, configSchema } from './Config';
import { pkgDir } from './pkgDir';

const rcSchema = z.object({ configPath: z.string() }).strict();
export type RC = z.infer<typeof rcSchema>;

const resolveConfigPath = async (path?: string) => {
  let resolvedPath: string | undefined;

  if (path) {
    resolvedPath = resolve(path);
  } else {
    const rcPath = resolve(pkgDir, '.metastructure.yml');

    if (await fs.exists(rcPath)) {
      try {
        const { configPath } = yaml.parse(
          await fs.readFile(rcPath, 'utf8'),
        ) as RC;

        if (configPath) resolvedPath = resolve(pkgDir, configPath);
      } catch {
        /* empty */
      }
    }
  }

  if (!resolvedPath) throw new Error('Unable to resolve config path.');

  if (!(await fs.exists(resolvedPath)))
    throw new Error('Config file does not exist.');

  return resolvedPath;
};

export const readConfigFile = async (path?: string) =>
  configSchema.parse(
    yaml.parse(await fs.readFile(await resolveConfigPath(path), 'utf8')),
  );

export const writeConfigFile = async (config: Config, path?: string) => {
  await fs.writeFile(
    await resolveConfigPath(path),
    yaml.stringify(config, { doubleQuotedAsJSON: true }),
  );
};
