import path from 'path'
import {readJsonFile} from './utils/fs'

import {buildFile} from './utils/buildFile'

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

  const templateDir = path.resolve(basedir, 'template')
  const buildDir = path.resolve(basedir, 'build')

  const files = await readDirRecursive(templateDir)

  // Ignore paths containing `/node_modules/`
  const includeFiles = files.filter(file => !file.match(/\/node_modules\//))

  // Get relative paths
  const relativeFiles = includeFiles.map(f => path.relative(templateDir, f))

  for (const f of relativeFiles) {
    await buildFile(path.resolve(templateDir, f), path.resolve(buildDir, f), templateValues)
  }

  return relativeFiles
}
