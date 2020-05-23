'use strict'

// external deps
require('dotenv').config(`${__dirname}/../.env`)

// internal deps
const db = require('../src/lib/db.js')
const Task = require('../src/model/task.js')
const mockTask = require('./mock/mock-task.js')

// test suite
describe('task model', () => {
  beforeAll(db.initClient)
  afterAll(async () => {
    await db.quitClient()
  })

  describe('createTask', () => {
    it('should create a task', async () => {
      let {task, input} = await mockTask.getTask()
      console.log(task)
      expect(task.description).toEqual(input.description)
    })
  })
})
