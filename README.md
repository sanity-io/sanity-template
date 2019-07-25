# sanity-template

Sanity template developer tools, documentation and specification.

```sh
npm install sanity-template-tools --save-dev
```

[![npm version](https://img.shields.io/npm/v/sanity-template-tools.svg?style=flat-square)](https://www.npmjs.com/package/sanity-template-tools)

`sanity-template-tools` exposes both a command line interface and a Node.js API.

### Specfication
WARNING: Not ready for public consumption
- [Template manifest specification (v0)](SPEC-MANIFEST-V0.md) 

### CLI

```sh
# Build template files from `template/` to `build/`
npx sanity-template build --template-values values.json

# The same, but in watch mode
npx sanity-template watch --template-values values.json
```

This will copy files from the `template` directory into the `build` (which should be gitignored). The files in the `build` directory will have template variables replaced (`<#<varName>#>`).

### Node.js API

#### `build`

The `build` method returns a `Promise` instance:

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

The `watch` method returns an RxJS `Observable` instance:

```js
const { watch } = require("sanity-template-tools");

watch({
  basedir: "path/to/basedir",
  templateValuesPath: "template-values.json"
}).subscribe({
  next: ({ type, file }) => console.log(`${type}: ${file}`),
  error: err => console.error(err)
});
```

## TODO

- [x] Watch mode
- [ ] Manifest validation
- [ ] Validate existence of dir paths (`sourceDir` and `targetDir`)
- [ ] Make params for dir paths (`sourceDir` and `targetDir`)

## License

[MIT](LICENSE) © [Sanity.io](https://www.sanity.io)
