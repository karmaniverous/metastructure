import fs from 'fs-extra';
import { resolve } from 'path';
import yaml from 'yaml';

import { Config, configSchema } from './Config';
import { pkgDir } from './pkgDir';

const resolveConfigPath = async (path?: string) => {
  let resolvedPath: string | undefined;

  if (path) {
    resolvedPath = resolve(path);
  } else {
    resolvedPath = resolve(pkgDir, '.metastructure.yml');

    if (await fs.exists(resolvedPath)) {
      try {
        const { configPath } = yaml.parse(
          await fs.readFile(resolvedPath, 'utf8'),
        ) as Partial<Config>;

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
