// external deps
require('dotenv').config(`${__dirname}/../.env`)

// internal deps
const db = require('../src/lib/db.js')
const User = require('../src/model/user.js')
const mockUser = require('./mock/mock-user.js')

describe('User Model', () => {
  beforeAll(db.initClient)
  //afterAll(db.deleteItem({id: 'user:example@slugbyte.com'})
  afterAll(db.quitClient)

  it('should create a user', async () => {
    let {user, input} = await mockUser.getUser()
    expect(user.id).toBe('user:' + input.email)
  })

  it('should find a user', async () => {
    const {user: mock} = await mockUser.getUser()
    let user = await User.findByID(mock.id)
    expect(user instanceof User).toBeTruthy()
    expect(user.id).toBe(mock.id)
  })

  it('should create and validate token', async () => {
    const {user} = await mockUser.getUser()
    let token = await user.createAuthToken()
    expect(token.length > 100).toBeTruthy()

    let validUser = await user.verifyAuthToken(token)
    expect(validUser.id).toBe(user.id)

    await user.verifyAuthToken("bad token")
    .catch(err => {
      expect(err.message.startsWith('_AUTH_ERROR_')).toBeTruthy()
    })
  })

  it('should validate the correct password', async () => {
    let {user, input} = await mockUser.getUser()
    let validUser = await user.verifyPassword(input.password)
    expect(validUser.id).toBe(user.id)

    await user.verifyPassword('bad password')
    .catch(err => {
      expect(err.message.startsWith('_AUTH_ERROR_')).toBeTruthy()
      expect(err.status).toBe(401)
    })
  })

})
