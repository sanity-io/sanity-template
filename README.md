# sanity-template-tools

```sh
npm install sanity-template-tools -D
```

## Documentation

`sanity-template-tools` exposes both a command line interface and a Node.js API.

### Command line interface

```sh
npx sanity-template-tools build --template-values values.json
npx sanity-template-tools watch --template-values values.json
```

This will copy files from the `template` directory into the `build` (which should be gitignored). The files in the `build` directory will have template variables replaced (`<#<varName>#>`).

### Node.js API

#### `build`

```js
const { build } = require("sanity-template-tools");

build({
  basedir: "path/to/basedir",
  templateValuesPath: "template-values.json"
})
  .then(() => console.log("successfully built"))
  .catch(err => console.error(err));
```

#### `watch`

```js
const { watch } = require("sanity-template-tools");

watch({
  basedir: "path/to/basedir",
  templateValuesPath: "template-values.json"
}).catch(err => console.error(err));
```

## TODO

- [x] Watch mode
- [ ] Manifest validation
