'use strict'

// extern deps
const debug = require('debug')('app:mock-user')
const faker = require('faker')

// internal deps
const User = require('../../server/model/user.js')
const mockUtil = require('./mock-util.js')

// module state
// interface
const getInput = () => ({
  username: faker.internet.userName() + faker.internet.userName(),
  password: faker.internet.password() + faker.internet.password(),
  email: faker.internet.email(),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
})

const getUser = async () => {
  let input = getInput()
  let user = await User.createUser(input)
  return {user, input}
}

module.exports = {getInput, getUser}
