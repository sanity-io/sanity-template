const {kebabCase} = require('lodash')

const {temporaryTransformPackage} = require('./utils/temporaryTransformPackage')
const {runNpmInstall} = require('./utils/runNpmInstall')

const path = require('path')

function generateLockFiles(basedir) {
  if (!basedir) {
    throw new Error('Missing basedir')
  }

  const manifest = require(path.join(basedir, 'sanity-template.json'))
  const prefix = kebabCase(manifest.title)

  const template = {
    name: `${prefix}`,
    dir: './template',
    path: path.resolve(basedir, 'template')
  }

  const deployments = manifest.deployments.map(deployment => ({
    name: `${prefix}-${deployment.id}`,
    dir: deployment.dir,
    path: path.resolve(template.path, deployment.dir)
  }))

  return Promise.all(
    [template, ...deployments].map(async info => {
      const packagePath = path.join(info.path, 'package.json')
      const restorePkg = temporaryTransformPackage(packagePath, pkg => ({
        ...pkg,
        name: info.name
      }))

      await runNpmInstall(info.path)
      restorePkg()
      return info
    })
  )
}

module.exports = generateLockFiles
