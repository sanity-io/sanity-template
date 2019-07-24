const path = require('path')
const {exec} = require('./exec')

const npmbinary = path.resolve(__dirname, '..', '..', 'node_modules', '.bin', 'npm')

exports.runNpmInstall = directory =>
  exec(npmbinary, ['install', '--prefix', directory, '--ignore-scripts', '--prefer-offline'], {
    cwd: directory
  })
