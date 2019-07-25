const path = require('path')
const api = require('../src')
const cli = require('../src/commands')
const {rimraf} = require('../src/lib/fs')

const fixturePath = p => path.join(__dirname, 'fixtures', p)

const clean = async () => rimraf(fixturePath('sanity-template-simple/build'))

beforeEach(clean)
afterEach(clean)

describe('build', () => {
  describe('CLI', () => {
    it('should build simple template', async () => {
      await cli.build(fixturePath('sanity-template-simple'), {
        templateValues: 'template-values.json'
      })
    })
  })

  describe('Node.js API', () => {
    it('should build simple template', async () => {
      const basedir = fixturePath('sanity-template-simple')

      await api.build({
        basedir,
        templateValuesPath: 'template-values.json'
      })

      const pkg = require(path.resolve(basedir, 'build/package.json'))
      const studioPkg = require(path.resolve(basedir, 'build/studio/package.json'))

      expect(pkg.name).toBe('sanity-simple')
      expect(studioPkg.name).toBe('sanity-simple-studio')
    })
  })
})
