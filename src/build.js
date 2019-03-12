const { isBinarySync } = require("istextorbinary");
const path = require("path");
const {
  copyFile,
  mkdirp,
  readDirRecursive,
  readFile,
  writeFile
} = require("./lib/fs");
const { replaceVars } = require("./lib/replaceVars");

async function buildFile(fromPath, toPath, templateValues) {
  const dir = path.dirname(toPath);

  await mkdirp(dir);

  const buf = await readFile(fromPath);
  const isBinary = isBinarySync(fromPath, buf);

  try {
    const contents = isBinary
      ? buf.toString("utf8")
      : replaceVars(fromPath, buf.toString("utf8"), templateValues || {});
    return writeFile(toPath, contents);
  } catch (err) {
    console.warn(
      `WARNING: Writing went wrong in: ${fromPath} (original error below)`
    );
    console.warn(err);
    return copyFile(fromPath, toPath);
  }
}

async function build({ basedir, templateValues }) {
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
