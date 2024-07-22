import fs from 'fs-extra';
import { isPlainObject } from 'is-what';
import _ from 'lodash';
import { dirname, resolve } from 'path';
import { packageDirectory } from 'pkg-dir';
import { Document, parse, parseDocument, YAMLMap } from 'yaml';

import { type Config } from './Config';

const resolveConfigPath = async (path?: string) => {
  let resolvedPath: string | undefined;

  if (path) {
    resolvedPath = resolve(path);
  } else {
    const pkgDir = (await packageDirectory()) ?? '.';

    resolvedPath = resolve(pkgDir, '.metastructure.yml');

    if (await fs.exists(resolvedPath)) {
      try {
        const { configPath } = parse(
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

const readConfigDoc = async (configPath: string) =>
  parseDocument(await fs.readFile(configPath, 'utf8'));

export const readConfig = async (path?: string) => {
  const configPath = await resolveConfigPath(path);

  const rawConfig = parse(await fs.readFile(configPath, 'utf8')) as Config;

  const pkgDir = (await packageDirectory({ cwd: dirname(configPath) })) ?? '.';

  for (const batch of _.values(rawConfig.batches))
    if (batch.cli_defaults_path)
      batch.cli_defaults = _.merge(
        batch.cli_defaults ?? {},
        (parse(
          await fs.readFile(resolve(pkgDir, batch.cli_defaults_path), 'utf8'),
        ) as NonNullable<Config['batches']>[string]['cli_defaults']) ?? {},
      );

  return { rawConfig, configPath };
};

export const writeConfig = async (config: Config, configPath: string) => {
  const doc = await readConfigDoc(configPath);

  updateYamlDoc(doc, config);

  await fs.writeFile(configPath, doc.toString({ doubleQuotedAsJSON: true }));
};

function updateYamlDoc(doc: Document.Parsed, update: object | object[]) {
  for (const key in update) {
    const value = _.get(update, key) as object | object[];
    if (isPlainObject(value)) {
      if (!doc.has(key)) doc.set(key, new YAMLMap());
      updateYamlDoc(doc.get(key) as Document.Parsed, value);
    } else {
      doc.set(key, value);
    }
  }
}
