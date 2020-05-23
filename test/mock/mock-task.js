'use strict'
// external deps
const debug = require('debug')('app:mock-task')
const faker = require('faker')

// internal deps
const Task = require('../../src/model/task.js')
const mockUser = require('./mock-user.js')

// interface
const getInput = async () => {
  const {user} = await mockUser.getUser()
  return {
    user,
    completed: false,
    description: faker.lorem.sentence(),
  }
}

// TODO: getTask
const getTask = async () => {
  let input = await getInput()
  let task = await Task.createTask(input)
  return {input, task}
}

module.exports = {getInput, getTask}
