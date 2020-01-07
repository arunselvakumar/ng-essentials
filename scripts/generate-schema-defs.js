const { resolve, extname } = require('path');
const { writeFileSync } = require('fs');
const { compileFromFile } = require('json-schema-to-typescript');
const { resolveConfig } = require('prettier');

const glob = require('glob');
const chalk = require('chalk');

const log = console.log;
const rootPath = resolve(__dirname, '..');
const configFilePath = {
  prettier: resolve(rootPath, '.prettierrc')
};
const tsDefExtension = '.d.ts';

async function generate(filesGlob) {
  log(chalk.cyan.bold('creating schemas:\n'));

  const prettierConfig = await resolveConfig(configFilePath.prettier);
  const json2schemaConfig = { style: prettierConfig };
  const schemaFiles = glob.sync(filesGlob);

  return Promise.all(
    schemaFiles.map(async (schemaFile, idx) => {
      const definitionFile = schemaFile.replace(extname(schemaFile), tsDefExtension);
      writeFileSync(definitionFile, await compileFromFile(schemaFile, json2schemaConfig));
      return definitionFile;
    })
  );
}

generate('src/**/schema.json').then(createdFiles => {
  log(chalk.blue(`${createdFiles.join(' ✅\n')} ✅`));
  log(chalk.bold.greenBright('\nDone!'));
});
