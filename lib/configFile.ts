import { parse } from 'dotenv';
import fs from 'fs-extra';
import { resolve } from 'path';
import yaml from 'yaml';

import { Config, configSchema } from './Config';
import pkgDir from './pkgDir';

const resolveConfigPath = async (path?: string) => {
  let resolvedPath: string | undefined;

  if (path) {
    resolvedPath = resolve(path);
  } else {
    const rcPath = resolve(pkgDir, '.infrarc');

    if (await fs.exists(rcPath)) {
      try {
        const { CONFIG_PATH } = parse(await fs.readFile(rcPath, 'utf8'));
        if (CONFIG_PATH) resolvedPath = resolve(pkgDir, CONFIG_PATH);
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
