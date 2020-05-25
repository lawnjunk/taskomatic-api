'use strict'

// external deps
require('dotenv').config({path: `${__dirname}/../.env`})

// internal deps
const hmac = require('../server/lib/hmac.js')

describe('hmac', () => {
  describe('hashData and verify', () => {
    it('should hash and verify valid data',  async () => {
      let hash = await hmac.hashData({a: 'one', b: 'two'}, 'TOP SECRET')
      expect(typeof hash).toBe('string')
      expect(hash.length).toBe(64)

      let data = await hmac.verify({a: 'one', b: 'two'}, hash, 'TOP SECRET')
      expect(data.a).toBe('one')
      expect(data.b).toBe('two')

      await hmac.verify({a: 'one', b: 'two'}, hash, 'BAD SECRET')
      .catch(err => {
        expect(err.message.startsWith('_HMAC_ERROR_')).toBeTruthy()
      })

      await hmac.verify({a: 'two', c: 'one'}, hash, 'TOP SECRET')
      .catch(err => {
        expect(err.message.startsWith('_HMAC_ERROR_')).toBeTruthy()
      })
    })
  })
})

