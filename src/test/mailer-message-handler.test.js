'use strict'

// external deps
require('dotenv').config(`${__dirname}/../.env`)
const debug = require('debug')

// internal deps
const mailHandler = require('../mailer/message-handler.js')
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
    let message = JSON.stringify({
      action: 'VERIFY_USER_EMAIL',
      data: {user},
    })
    let result = await mailHandler(message)
    expect(result.response.includes('250 Accepted'))
  })
  
  it('notifyTaskCreate', async () => {
    let {task, input} = await mockTask.getTask()
    let {user} = input
    let message = JSON.stringify({
      action: 'NOTIFY_TASK_CREATE', 
      data: {user, task},
    })
    let result = await mailHandler(message)
    expect(result.response.includes('250 Accepted'))
  })

  it('notifyTaskExpire', async () => {
    let {task, input} = await mockTask.getTask()
    let {user} = input
    let message = JSON.stringify({
      action: 'NOTIFY_TASK_EXPIRE',
      data: {user, task},
    })
    let result = await mailHandler(message)
    expect(result.response.includes('250 Accepted'))
  })

  it('notifyTaskComplete', async () => {
    let {task, input} = await mockTask.getTask()
    let {user} = input
    let message = JSON.stringify({
      action: 'NOTIFY_TASK_COMPLETE',   
      data: {user, task}
    })
    let result = await mailHandler(message)
    expect(result.response.includes('250 Accepted'))
  })
})

