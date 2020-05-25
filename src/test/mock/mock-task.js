'use strict'

// external deps
const debug = require('debug')('app:mock-task')
const faker = require('faker')

// internal deps
const Task = require('../../server/model/task.js')
const mockUser = require('./mock-user.js')
const mockUtil = require('./mock-util.js')

// interface
const simpleInput = () => ({
    completed: false,
    description: faker.lorem.sentence(),
})

const getInput = async () => {
  let {user} = await mockUser.getUser()
  return Object.assign({}, {user}, simpleInput())
}

const getTask = async () => {
  let input = await getInput()
  let task = await Task.createTask(input)
  return {input, task}
}

const getTasks = async (count=3) => {
  if(count < 1)
    throw new Error('_ERROR_ count must be positive int')
  let {user} = await mockUser.getUser()
  let inputs = []
  let tasks = []
  while(count>0){
    let input = Object.assign({}, {user}, simpleInput())
    let task = await Task.createTask(input)
    inputs.push(input)
    tasks.push(task)
    count--
  }
  return {user, tasks, inputs}
}

module.exports = {getInput, getTask, getTasks}
