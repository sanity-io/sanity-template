const path = require('path')
const api = require('../src')
const cli = require('../src/commands')
const {rimraf} = require('../src/lib/fs')

const fixturePath = p => path.join(__dirname, 'fixtures', p)

const clean = async () => {
  await rimraf(fixturePath('sanity-template-simple/build'))
  await rimraf(fixturePath('sanity-template-simple/template/node_modules'))
  await rimraf(fixturePath('sanity-template-simple/template/package-lock.json'))
  await rimraf(fixturePath('sanity-template-simple/template/studio/node_modules'))
  await rimraf(fixturePath('sanity-template-simple/template/studio/package-lock.json'))
}

// timeout: 5 mins
jest.setTimeout(1000 * 60 * 5)

beforeEach(clean)
afterEach(clean)

describe('lockfiles', () => {
  describe('CLI', () => {
    it('should genereate lockfiles for simple template', async () => {
      const basedir = fixturePath('sanity-template-simple')

      await cli.lockfiles(basedir, {
        templateValues: 'template-values.json'
      })

      const pkgLock = require(path.resolve(basedir, 'template/package-lock.json'))
      const studioPkgLock = require(path.resolve(basedir, 'template/studio/package-lock.json'))

      expect(pkgLock.name).toBe('sanity-simple')
      expect(studioPkgLock.name).toBe('sanity-simple-studio')
    })
  })

  describe('Node.js API', () => {
    it('should genereate lockfiles for simple template', async () => {
      const basedir = fixturePath('sanity-template-simple')

      await api.generateLockFiles({
        basedir,
        templateValuesPath: 'template-values.json'
      })

      const pkgLock = require(path.resolve(basedir, 'template/package-lock.json'))
      const studioPkgLock = require(path.resolve(basedir, 'template/studio/package-lock.json'))

      expect(pkgLock.name).toBe('sanity-simple')
      expect(studioPkgLock.name).toBe('sanity-simple-studio')
    })
  })
})
