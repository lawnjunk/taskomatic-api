'use strict'
// external deps
const debug = require('debug')('app:mock-task')
const faker = require('faker')

// internal deps
const Task = require('../../src/model/task.js')
const mockUser = require('./mock-user.js')

// module state
let cache = []

// interface
const getInput = async () => {
  const {user} = await mockUser.getUser()
  return {
    user,
    completed: false,
    description: faker.lorem.sentence(),
  }
}

const getTask = async () => {
  let input = await getInput()
  let task = await Task.createTask(input)
  cache.push(task)
  return {input, task}
}

const cleanup = async () => {
  debug('cleanup')
  await mockUser.cleanup()
  let deletedLists = {}
  await Promise.all(cache.map(async (task) => {
    if(!deletedLists[task.listID]){
      await task.deleteList()
      deletedLists[task.listID] = true
    }
  })).catch(console.error)
  cache = []
}

module.exports = {getInput, getTask, cleanup}
