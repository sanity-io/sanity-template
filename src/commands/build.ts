import path from 'path'
import {readJsonFile} from './utils/fs'

import {buildFile} from './utils/buildFile'
import {LEGACY_MANIFEST_PATH, MANIFEST_PATHS, resolveManifestPath} from './utils/resolveManifestPath'
import {readSourceFiles} from './utils/readSourceFiles'
import {toArray} from 'rxjs/operators'

export async function build({
  basedir,
  templateValuesPath
}: {
  basedir: string
  templateValuesPath?: string
}) {
  let templateValues = {}

  if (templateValuesPath) {
    templateValues = await readJsonFile(path.resolve(basedir, templateValuesPath))
  }

  if (!basedir) {
    throw new Error('Missing basedir')
  }

  const manifestPath = resolveManifestPath(basedir)
  if (!manifestPath) {
    console.error(
      'Unable to resolve manifest from directory: %s. Not found: %s',
      basedir,
      MANIFEST_PATHS.join(', ')
    )
  }

  const templateDir =
    manifestPath === LEGACY_MANIFEST_PATH ? path.resolve(basedir, 'template') : basedir

  const buildDir = path.resolve(basedir, 'build')

  const files = await readSourceFiles(templateDir).pipe(toArray()).toPromise()

  for (const f of files) {
    await buildFile(path.resolve(templateDir, f), path.resolve(buildDir, f), templateValues)
  }

  return files
}
