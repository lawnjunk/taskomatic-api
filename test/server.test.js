'use strict'

// init env
require('dotenv').config(`${__dirname}/../.env`)

// extenal deps
const debug = require('debug')('app:test-server')
const request = require('superagent')

// internal deps
const server = require(`../src/lib/server.js`)

// module constants
const apiURL = process.env.API_URL

// test suite
describe('server.js', () => {

  describe('intial state', () => {
    it('should not be running', () => {
      expect(server.state.isOn).toBeFalsy()
      expect(server.state.httpServer).toBeNull()
      expect(server.state.app).toBeTruthy()
    })
  })

  describe('#start and #stop', () => {
    it('should start and stop the server', () => {
      return server.start()
        .then((state) => {
          expect(state.isOn).toBeTruthy()
          expect(state.httpServer).toBeTruthy()
          expect(state.app).toBeTruthy()
          return server.stop()
        }).then(state => {
          expect(state.isOn).toBeFalsy()
          expect(state.httpServer).toBeFalsy()
          expect(state.app).toBeTruthy()
        })
    })
  })

  describe('#start allready runnning or adder in use', () => {
    afterAll(() => server.stop())
    it('should fail to start if allready running', () => {
      return server.start()
      .then(() => server.start())
      .catch(err => {
        expect(err.message.startsWith('_BOOT_ERROR_')).toBeTruthy()
      })
    })
  })


  //describe('hello world', () => {
    //beforeAll(() => server.start())
    //afterAll(() => server.stop())

    //it('GET / should return a hello world', () => {
      //return request.get(`${apiURL}`)
      //.then(res => {
        //expect(res.status).toBe(200)
        //expect(res.body.test).toBe('hello world')
      //})
    //})
  //})
})
