const path = require('path')
const v1 = require('../manifest/v1')
const v2 = require('../manifest/v2')

async function check({basedir}) {
  if (!basedir) throw new Error('missing basedir')

  let manifest

  try {
    manifest = require(path.resolve(basedir, 'sanity-template.json'))
  } catch (requireErr) {
    throw new Error('missing file: sanity-template.json')
  }

  switch (manifest.version) {
    case 0:
    case 1:
      return v1.parse(manifest)
    case 2:
      return v2.parse(manifest)
    default:
      return {
        type: 'invalid',
        errors: [{path: [], message: `invalid manifest version: ${manifest.version}`}]
      }
  }
}

module.exports = check
