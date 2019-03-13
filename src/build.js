const path = require("path");
const { readDirRecursive } = require("./lib/fs");
const { buildFile } = require("./lib/buildFile");

async function build({ basedir, templateValuesPath }) {
  let templateValues = {};

  if (templateValuesPath) {
    templateValues = await readJsonFile(
      path.resolve(basedir, templateValuesPath)
    );
  }

  if (!basedir) {
    throw new Error("Missing basedir");
  }

  const templateDir = path.resolve(basedir, "template");
  const buildDir = path.resolve(basedir, "build");

  console.log(`Read template directory...`);
  const files = await readDirRecursive(templateDir);

  // Ignore paths containing `/node_modules/`
  const includeFiles = files.filter(file => !file.match(/\/node_modules\//));

  const relativeFiles = includeFiles.map(f => path.relative(templateDir, f));

  console.log(`Start copying files...`);
  for (const f of relativeFiles) {
    await buildFile(
      path.resolve(templateDir, f),
      path.resolve(buildDir, f),
      templateValues
    );
  }

  console.log(`Copied ${relativeFiles.length} files`);
}

module.exports = build;
