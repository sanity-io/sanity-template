const chalk = require('chalk')
const path = require('path')
const api = require('./index')

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

  async lockfiles(basedir) {
    console.log('Generating lockfiles by running npm install in template dirs…')
    const directories = await api.generateLockFiles({basedir})

    console.log('Generated lockfiles in: ')
    directories.forEach(info =>
      console.log(`\t${chalk.green(path.join(info.dir, '/package-lock.json'))}`)
    )
  },

  async check(basedir) {
    const result = await api.check({basedir})

    if (result.type === 'invalid') {
      console.error(
        'Errors in sanity-template.json:\n%s',
        result.errors
          .map(
            err => `\t${err.path.join('') || '<root>'}: ${err.message.split('\n').join(`\n\t\t`)}`
          )
          .join('\n')
      )
      process.exit(1)
    }

    // success
    console.log(chalk.green(`✓ template directory is valid: ${basedir}`))
  }
}
