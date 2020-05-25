'use strict'

// external deps
require('dotenv').config(`${__dirname}/../.env`)
const request = require('superagent')

// internal modules
const server = require('../src/lib/server.js')
const mockUtil = require('./mock/mock-util.js')
const mockUser = require('./mock/mock-user.js')

// module constants
const apiURL = `${process.env.API_URL}/profile`

// test suite
describe('profile router', () => {
  beforeAll(server.start)
  afterEach(mockUtil.cleanup)
  afterAll(server.stop)

  describe('GET /profile/self', () => {
    it('should return a users profile', async () => {
      const {user} = await mockUser.getUser()
      const token = await user.createAuthToken()
      const res = await request(apiURL + '/whoami')  
        .set('Authorization', 'Bearer ' + token)
      
      expect(res.status).toBe(200)
      expect(res.body.id).toBe(user.id)
    })
  })

  describe('PUT /profile/self', () => {
    it.only('should update profile information', async () => {
      let {user} = await mockUser.getUser()
      let token = await user.createAuthToken()
      let res = await request.put(apiURL + '/self')
        .set('Authorization', 'Bearer ' + token)
        .send({username: 'snailshell44', firstName: 'Sam'})
      expect(res.body.username).toBe('snailshell44')
      expect(res.body.firstName).toBe('Sam')
      expect(res.body.id).toBe(user.id)
    })
  })

  describe('GET /profile', () => {
    it('shuld return 3 profiles', async () => {
      const mocks = await Promise.all(new Array(3).fill(1).map(() => mockUser.getUser()))
      let token = await mocks[0].user.createAuthToken()
      const res = await request(apiURL)  
        .set('Authorization', 'Bearer ' + token)
      
      let ids = new Set(mocks.map(m => m.user.id))
      expect(res.status).toBe(200)
      expect(res.body.length).toBe(3)
      res.body.forEach(user => {
        expect(ids.has(user.id)).toBeTruthy()
      })
    })
  })

})
