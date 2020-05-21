'use strict'

// external deps
require('dotenv').config(`${__dirname}/../.env`)
const request = require('superagent')

// internal deps
const db = require('../src/lib/db.js')
const hmac = require('../src/lib/hmac.js')
const server = require('../src/lib/server.js')
const User = require('../src/model/user.js')

// module constants
let apiURL = process.env.API_URL
let mock = {
  firstName: 'slug', 
  lastName: 'byte', 
  username: 'slugbyte', 
  email: 'example@slugbyte.com',
  password: 'shark-in-the-dark',
}

// test suite
describe('/auth router', () => {
  beforeAll(server.start)
  afterAll(async () => {
    await db.deleteItem({id: 'user:' + mock.email})
    await server.stop()
  })

  it('should create a user', async () => {
    let res = await request.post(apiURL + '/auth').send(mock)

    expect(res.status).toBe(200)
    expect(res.body.token).toBeTruthy()

    let signature = await hmac.hashData(res.body, res.body.token)
    expect(res.headers['x-taskomatic-signature']).toBe(signature)
  })

  it('should fetch a user token', async () => {
    let res = await request.get(apiURL + '/auth')
    .auth(mock.email, mock.password)
    expect(res.status).toBe(200)
    expect(res.body.token).toBeTruthy()

    let signature = await hmac.hashData(res.body, res.body.token)
    expect(res.headers['x-taskomatic-signature']).toBe(signature)
  })
})
