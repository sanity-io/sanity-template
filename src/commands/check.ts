import {Invalid, Valid} from '../manifest/common/error'
import * as v1 from '../manifest/v1'
import * as v2 from '../manifest/v2'

import path from 'path'

function tryRequire(dir: string) {
  try {
    return require(dir)
  } catch (err) {}
  return null
}

const MANIFEST_PATHS = ['./sanity-template.json', './.sanity-template/manifest.json']

export async function check({
  basedir
}: {
  basedir: string
}): Promise<Valid<v1.TemplateManifest> | Valid<v2.TemplateManifest> | Invalid> {
  if (!basedir) throw new Error('missing basedir')

  let manifest: any
  MANIFEST_PATHS.map(dir => path.resolve(basedir, dir)).some(dir => {
    manifest = tryRequire(dir)
    if (manifest) {
      return true
    }
  })

  if (!manifest) {
    throw new Error(
      `Unable to resolve template manifest from current working directory. Attempted to read from the following locations:\n - ${MANIFEST_PATHS.join(
        '\n - '
      )}`
    )
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
        errors: [{path: [], message: `invalid manifest version: ${manifest.version}`}],
        manifest
      }
  }
}
