'use strict'

// external deps
require('dotenv').config(`${__dirname}/../.env`)
const request = require('superagent')

// internal deps
const db = require('../src/lib/db.js')
const hmac = require('../src/lib/hmac.js')
const server = require('../src/lib/server.js')
const User = require('../src/model/user.js')
const mockUtil = require('./mock/mock-util.js')
const mockUser = require('./mock/mock-user.js')
const util = require('../src/lib/util.js')

// module constants
let apiURL = process.env.API_URL + '/auth'

// test suite
describe('/auth router', () => {
  beforeAll(server.start)
  afterAll(async () => {
    await mockUtil.cleanup()
    await server.stop()
  })

  it('should create a user', async () => {
    let mock = await mockUser.getUser()
    let res = await request.post(apiURL).send(mock.input)

    expect(res.status).toBe(200)
    expect(res.body.token).toBeTruthy()

    let signature = await hmac.hashData(res.body, res.body.token)
    expect(res.headers['x-taskomatic-signature']).toBe(signature)
  })

  it('should fetch a user token', async () => {
    let mock = await mockUser.getUser()
    let res = await request.get(apiURL)
    .auth(mock.input.email, mock.input.password)
    expect(res.status).toBe(200)
    expect(res.body.token).toBeTruthy()

    let signature = await hmac.hashData(res.body, res.body.token)
    expect(res.headers['x-taskomatic-signature']).toBe(signature)
  })

  it('should update the password', async () => {
    let mock = await mockUser.getUser()
    let token = await mock.user.createAuthToken()
    let res = await request.put(apiURL)
      .set('Authorization', 'Bearer ' + token)
      .send({password: 'helloworld'})

    let user = await User.fetchByEmail(mock.user.email) 
    expect(user.passwordHash).not.toEqual(mock.passwordHash)
  })

  it('should verifyEmail', async () => {
    let mock = await mockUser.getUser()
    const email = util.base64Encode(mock.user.email)
    let res = await request.get(`${apiURL}/verify/${util.base64Encode(mock.user.email)}`)
      .redirects(0)
    .catch(err => err)
    expect(res.status).toBe(302)
    let user = await User.fetchByEmail(mock.user.email) 
    expect(user.verified).toBeTruthy()

  })

})
