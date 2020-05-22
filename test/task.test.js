'use strict'

// external deps
require('dotenv').config(`${__dirname}/../.env`)

// internal deps
const db = require('../src/lib/db.js')
const Task = require('../src/model/task.js')
const User = require('../src/model/user.js')

// test suite
describe('task model', () => {
  beforeAll(db.initClient)
  afterAll(await () => {
    await db.quit()
  })

  describe('createTask', () => {
    beforeAll(async () => {
    })
  })
})
