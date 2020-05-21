// external deps
require('dotenv').config(`${__dirname}/../.env`)

// internal deps
const db = require('../src/lib/db.js')
const User = require('../src/model/user.js')

describe('User Model', () => {
  beforeAll(db.initClient)
  afterAll(db.quitClient)

  it('should create a user', () => {
    return User.createUser({
      firstName: 'slug', 
      lastName: 'byte', 
      username: 'slugbyte',
      email: 'example@slugbyte.com',
      password: 'checkthestickynoteonmydesk',
    })
  })


})
