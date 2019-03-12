const path = require("path");
const build = require("./build");
const { readJsonFile } = require("./lib/fs");

module.exports = {
  async build(basedir, params) {
    let templateValues = {};
    if (params.templateValues) {
      templateValues = await readJsonFile(
        path.resolve(basedir, params.templateValues)
      );
    }
    return build({ basedir, templateValues });
  }
};
