const chalk = require('chalk')
const path = require('path')
const api = require('./')

const {readJsonFile} = require('./lib/fs')

module.exports = {
  async build (basedir, params) {
    return api.build({basedir, templateValuesPath: params.templateValues}).then(files => {
      files.forEach(file => console.log(`${chalk.green('build')} ${file}`))
    })
  },

  watch (basedir, params) {
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
  }
}
