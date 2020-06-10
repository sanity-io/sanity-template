const path = require('path')
const api = require('../index')
const cli = require('../commands')
const {rimraf} = require('../utils/fs')

const fixturePath = p => path.join(__dirname, 'fixtures', p)

const clean = async () => rimraf(fixturePath('sanity-template-simple/build'))

beforeEach(clean)
afterEach(clean)

describe('build', () => {
  describe('CLI', () => {
    it('should build simple template', async () => {
      await cli.build(fixturePath('sanity-template-simple'), {
        templateValues: 'build-options.json'
      })
    })
  })

  describe('Node.js API', () => {
    it('should build simple template', async () => {
      const basedir = fixturePath('sanity-template-simple')

      await api.build({
        basedir,
        templateValuesPath: 'build-options.json'
      })

      const pkg = require(path.resolve(basedir, 'build/package.json'))
      const studioPkg = require(path.resolve(basedir, 'build/studio/package.json'))

      expect(pkg.name).toBe('sanity-simple')
      expect(studioPkg.name).toBe('sanity-simple-studio')
    })
  })
})
