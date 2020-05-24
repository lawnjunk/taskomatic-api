'use strict'

// external deps
const debug = require('debug')

// internal deps
const mailer = require('../src/lib/mailer.js')
const mockUtil = require('./mock/mock-util.js')
const mockUser = require('./mock/mock-user.js')
const mockTask = require('./mock/mock-task.js')

// test suite
describe('mailer', () => {
  beforeAll(mockUtil.init)
  afterAll(async () => {
    await mockUtil.cleanup()
    await mockUtil.quit()
  })

  it('verifyUserEmail', async () => {
    let {user} = await mockUser.getUser()
    let result = await mailer.verifyUserEmail(user)
    expect(result.response.includes('250 Accepted'))
  })
  
  it('notifyTaskCreate', async () => {
    let {task, input} = await mockTask.getTask()
    let {user} = input
    let result = await mailer.notifyTaskCreate(user, task)
    expect(result.response.includes('250 Accepted'))
  })

  it('notifyTaskExpire', async () => {
    let {task, input} = await mockTask.getTask()
    let {user} = input
    let result = await mailer.notifyTaskExpire(user, task)
    expect(result.response.includes('250 Accepted'))
  })

  it('notifyTaskComplete', async () => {
    let {task, input} = await mockTask.getTask()
    let {user} = input
    let result = await mailer.notifyTaskComplete(user, task)
    expect(result.response.includes('250 Accepted'))
  })
})

