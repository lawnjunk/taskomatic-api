// external deps
require('dotenv').config(`${__dirname}/../.env`)

// internal deps
const db = require('../src/lib/db.js')
const User = require('../src/model/user.js')

let mock = {
  firstName: 'slug', 
  lastName: 'byte', 
  username: 'slugbyte',
  email: 'example@slugbyte.com',
  id: 'user:example@slugbyte.com',
  password: 'checkthestickynoteonmydesk',
}

describe('User Model', () => {
  beforeAll(db.initClient)
  //afterAll(db.deleteItem({id: 'user:example@slugbyte.com'})
  afterAll(db.quitClient)

  it('should create a user', async () => {
    let user = await User.createUser(Object.assign({}, mock, {id: null}))
    expect(user.id).toBe(mock.id)
  })

  it('shold find a user', async () => {
    let user = await User.findByID(mock.id)
    expect(user instanceof User).toBeTruthy()
  })

  it('should create and validate token', async () => {
    let user = await User.findByID(mock.id)
    let token = await user.createAuthToken()
    expect(token.length > 100).toBeTruthy()

    let validUser = await user.verifyAuthToken(token)
    expect(validUser.id).toBe(mock.id)

    await user.verifyAuthToken("bad token")
    .catch(err => {
      expect(err.message.startsWith('_AUTH_ERROR_')).toBeTruthy()
    })
  })

  it('should validate the correct password', async () => {
    let user = await User.findByID(mock.id)
    let validUser = await user.verifyPassword(mock.password)
    expect(validUser.id).toBe(mock.id)

    await user.verifyPassword('bad password')
    .catch(err => {
      expect(err.message.startsWith('_AUTH_ERROR_')).toBeTruthy()
      expect(err.status).toBe(401)
    })
  })

})
