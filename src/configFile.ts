import fs from 'fs-extra';
import _ from 'lodash';
import { resolve } from 'path';
import { packageDirectory } from 'pkg-dir';
import { Document, parse, parseDocument, stringify, YAMLMap } from 'yaml';

import { type Config, configSchema } from './Config';

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

  return {
    config: configSchema.parse(parse(await fs.readFile(configPath, 'utf8'))),
    configPath,
  };
};

export const writeConfig = async (config: Config, configPath: string) => {
  const doc = await readConfigDoc(configPath);

  updateYamlDoc(doc, config);

  await fs.writeFile(configPath, doc.toString({ doubleQuotedAsJSON: true }));
};

function updateYamlDoc(doc: Document.Parsed, update: object | object[]) {
  for (const key in update) {
    const value = _.get(update, key) as object | object[];
    if (_.isPlainObject(value)) {
      if (!doc.has(key)) doc.set(key, new YAMLMap());
      updateYamlDoc(doc.get(key) as Document.Parsed, value);
    } else {
      doc.set(key, value);
    }
  }
}
