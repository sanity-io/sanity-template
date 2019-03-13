const fs = require("fs");
const path = require("path");
const { from, of } = require("rxjs");
const { concatMap, filter, map, switchMap } = require("rxjs/operators");
const { buildFile } = require("./lib/buildFile");
const { watchFiles } = require("./lib/watchFiles");
const { readJsonFile } = require("./lib/fs");

async function watch(opts) {
  return new Promise((resolve, reject) => {
    if (!opts.basedir) {
      throw new Error("Missing basedir");
    }

    const templateDir = path.resolve(opts.basedir, "template");
    const buildDir = path.resolve(opts.basedir, "build");

    const templateValuesPath = path.resolve(
      opts.basedir,
      opts.templateValuesPath
    );

    const templateValuesPathChange$ = watchFiles(templateValuesPath);

    const templateValues$ = templateValuesPathChange$.pipe(
      concatMap(() => from(readJsonFile(templateValuesPath)))
    );

    const templateFile$ = templateValues$.pipe(
      switchMap(templateValues =>
        watchFiles(templateDir, {
          ignored: /\/node_modules\//
        }).pipe(
          filter(({ file }) => fs.statSync(file).isFile()),
          map(({ file }) => ({
            file: path.relative(templateDir, file),
            templateValues
          }))
        )
      )
    );

    builtFile$ = templateFile$.pipe(
      concatMap(({ file, templateValues }) => {
        const fromPath = path.resolve(templateDir, file);
        const toPath = path.resolve(buildDir, file);
        return from(
          buildFile(fromPath, toPath, templateValues).then(() => file)
        );
      })
    );

    builtFile$.subscribe({
      next: console.log,
      error: reject,
      complete: resolve
    });
  });
}

module.exports = watch;
