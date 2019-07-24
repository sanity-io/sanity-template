const chalk = require('chalk')
const path = require('path')
const api = require('./')

module.exports = {
  async build(basedir, params) {
    return api.build({basedir, templateValuesPath: params.templateValues}).then(files => {
      files.forEach(file => console.log(`${chalk.green('build')} ${file}`))
    })
  },

  watch(basedir, params) {
    return new Promise((resolve, reject) => {
      api.watch({basedir, templateValuesPath: params.templateValues}).subscribe({
        next: msg => {
          switch (msg.type) {
            case 'built':
              console.log(`${chalk.green('build')} ${msg.file}`)
              break
            case 'unlinked':
              console.log(`${chalk.red('delete')} ${msg.file}`)
              break
            default:
              console.log(`${msg.type} ${msg.file}`)
              break
          }
        },
        error: reject,
        complete: resolve
      })
    })
  },
  lockfiles: basedir => {
    console.log('Generating lockfiles by running npm install in template dirs…')
    return api.generateLockFiles({basedir}).then(directories => {
      console.log('Generated lockfiles in: ')
      directories.forEach(info =>
        console.log(`\t${chalk.green(path.join(info.dir, '/package-lock.json'))}`)
      )
    })
  }
}
