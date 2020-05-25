'use strict'

// external deps
require('dotenv').config(`${__dirname}/../.env`)

// internal modules
const tomorrow = require('../server/lib/tomorrow.js')

// test suite
describe('tomorrow', () => {
  it('should fire off the callback', (done) => {
    let fn =  jest.fn()

    let result = tomorrow.register('example', fn, 500) 
    expect(tomorrow.cache['example']).toBe(result.intervalID)

    setTimeout(() => {
      expect(fn.mock.calls.length).toBe(1)
      expect(tomorrow.cache['example']).toBeUndefined()
      done()
    }, 1000)
  })

  it('should not fire off the callback', (done) => {
    let fn =  jest.fn()

    let result = tomorrow.register('example', fn, 500) 
    tomorrow.clear('example')
    expect(tomorrow.cache['example']).toBeUndefined()

    setTimeout(() => {
      expect(fn.mock.calls.length).toBe(0)
      expect(tomorrow.cache['example']).toBeUndefined()
      done()
    }, 1000)
  })
})
