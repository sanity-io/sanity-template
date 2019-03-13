const path = require("path");
const api = require("./");

const { readJsonFile } = require("./lib/fs");

module.exports = {
  async build(basedir, params) {
    return api.build({ basedir, templateValuesPath: params.templateValues });
  },

  async watch(basedir, params) {
    return api.watch({ basedir, templateValuesPath: params.templateValues });
  }
};
