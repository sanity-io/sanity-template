const path = require('path')
const api = require('../src')
const cli = require('../src/commands')

describe('check', () => {
  describe('CLI', () => {
    it('should not validate when missing manifest', async () => {
      const mockFn = jest.fn()
      const basedir = path.resolve(__dirname, './fixtures/sanity-template-empty')

      try {
        await cli.check(basedir, {})
      } catch (err) {
        mockFn(err)
      }

      expect(mockFn.mock.calls[0][0].message).toEqual('missing file: sanity-template.json')
    })

    it('should validate minimal manifest', async () => {
      const basedir = path.resolve(__dirname, './fixtures/sanity-template-minimal')
      await cli.check(basedir, {})
    })

    it('should validate simple manifest', async () => {
      const basedir = path.resolve(__dirname, './fixtures/sanity-template-simple')
      await cli.check(basedir, {})
    })

    it('should validate advanced manifest', async () => {
      const basedir = path.resolve(__dirname, './fixtures/sanity-template-advanced')
      await cli.check(basedir, {})
    })
  })

  describe('Node.js API', () => {
    it('should validate minimal manifest', async () => {
      const result = await api.check({
        basedir: path.resolve(__dirname, 'fixtures/sanity-template-minimal')
      })

      expect(result.errors.length).toBe(0)
    })

    it('should validate simple manifest', async () => {
      const result = await api.check({
        basedir: path.resolve(__dirname, 'fixtures/sanity-template-simple')
      })

      expect(result.errors.length).toBe(0)
    })

    it('should validate advanced manifest', async () => {
      const result = await api.check({
        basedir: path.resolve(__dirname, 'fixtures/sanity-template-advanced')
      })

      expect(result.errors.length).toBe(0)
    })
  })
})
