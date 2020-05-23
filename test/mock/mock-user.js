// extern deps
const debug = require('debug')('app:mock-user')
const faker = require('faker')

// internal deps
const User = require('../../src/model/user.js')

// module state
let cache = []

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
  cache.push(user)
  return {user, input}
}

const cleanup = async () => {
  debug('cleanup')
  await Promise.all(cache.map(async (user) => {
    await user.delete()
  }))
  cache = []
}

module.exports = {getInput, getUser, cleanup}
