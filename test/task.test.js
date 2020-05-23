'use strict'

// external deps
require('dotenv').config(`${__dirname}/../.env`)

// internal deps
const db = require('../src/lib/db.js')
const Task = require('../src/model/task.js')
const mockTask = require('./mock/mock-task.js')
const mockUtil = require('./mock/mock-util.js')

// test suite
describe('task model', () => {
  beforeAll(db.initClient)
  afterAll(async () => {
    await mockUtil.cleanup()
    await db.quitClient()
  })

  describe('createTask', () => {
    it('should create a task', async () => {
      let {task, input} = await mockTask.getTask()
      expect(task.description).toEqual(input.description)
    })
  })

  describe('fetchTaskById', () => {
    it('should fetch a task', async () => {
      let {task: mock} = await mockTask.getTask()
      let task = await Task.fetchTaskById(mock.id)
      expect(task).toBeInstanceOf(Task) 
      expect(task).toEqual(mock)
    })

    it('should return null if id is bad', async () => {
      let task = await Task.fetchTaskById('hello world')
      expect(task).toBeNull()
    })
  })

  describe('fetchTaskListByUserEmail', () => {
    it('should fetch a task', async () => {
      let mock = await mockTask.getTasks()
      let tasks = await Task.fetchTaskListByUserEmail(mock.user.email)
      expect(tasks.length).toBe(3)
      tasks.forEach(task => {
        expect(task).toBeInstanceOf(Task)
      })
    })

    it('should return empty list if nothing found', async () => {
      let tasks = await Task.fetchTaskListByUserEmail('hello@world.earth')
      expect(tasks).toEqual([])
    })
  })

  describe('deleteTaskListByUserEmail', () => {
    it('should delete all the users tasks', async () => {
      let mock = await mockTask.getTasks()
      await Task.deleteTaskListByUserEmail(mock.user.email)
      let tasks = await Task.fetchTaskListByUserEmail(mock.user.email)
      expect(tasks).toEqual([])
    })
  })

  describe('#update', () => {
    it('should update the task', async () => {
      let {task: mock} = await mockTask.getTask()
      mock.description = 'hello world'
      let result = await mock.update() 
      expect(result.description).toBe('hello world')
      let task = await Task.fetchTaskById(mock.id)
      expect(task.description).toBe('hello world')
    })

    it('should update the task', async () => {
      let {task: mock} = await mockTask.getTask()
      let result = await mock.update({description: 'hello world'}) 
      expect(result.description).toBe('hello world')
      let task = await Task.fetchTaskById(mock.id)
      expect(task.description).toBe('hello world')
    })
  })

  describe('#delete', () => {
    it('should delete the task', async () => {
      let {task: mock} = await mockTask.getTask()
      await mock.delete()
      let task = await Task.fetchTaskById(mock.id)
      expect(task).toBeNull()
    })
  })
})

