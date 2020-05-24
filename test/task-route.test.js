'use strict'

// external deps
require('dotenv').config(`${__dirname}/../.env`)
const request = require('superagent')

// internal deps
const server = require('../src/lib/server.js')
const mockTask = require('./mock/mock-task.js')
const Task = require('../src/model/task.js')
const mockUtil = require('./mock/mock-util.js')

// module contants
const apiURL = process.env.API_URL + '/task'

// test suite
describe('task router', () => {
  beforeAll(server.start)
  afterAll(server.stop)

  describe('POST /task', () => {
    it('should create a task', async () => {
      let input = await mockTask.getInput()
      let token = await input.user.createAuthToken()
      let res = await request.post(apiURL)
        .set('Authorization', 'Bearer ' + token)
        .send({description: input.description, completed: input.completed})

      expect(res.status).toBe(200)
      expect(res.body.id.startsWith('task')).toBe(true)
      expect(res.body.description).toBe(input.description)
    })
  })

  describe('POST /task/random', () => {
    it('should create a task', async () => {
      let input = await mockTask.getInput()
      let token = await input.user.createAuthToken()
      let res = await request.post(apiURL + '/random')
        .set('Authorization', 'Bearer ' + token)
        .send({description: input.description, completed: input.completed})

      expect(res.status).toBe(200)
      expect(res.body.id.startsWith('task')).toBe(true)
      expect(res.body.description).toBe(input.description)

      await new Promise((resolve) => {
        setTimeout(async () => {
          let task = await Task.fetchTaskById(res.body.id)
          expect(task.completed).toBeTruthy()
          resolve()
        }, 4000)
      })
    })
  })

  describe('GET /task/:id', () => {
    it('should retrieve a task', async () => {
      let mock = await mockTask.getTask()
      let token = await mock.input.user.createAuthToken()
      let res = await request.get(`${apiURL}/${mock.task.id}`)
        .set('Authorization', 'Bearer ' + token)
      expect(res.status).toBe(200)
      expect(res.body.id).toBe(mock.task.id)
      expect(res.body.description).toBe(mock.task.description)
    })
  })

  describe('GET /task', () => {
    it('should retrive all the users tasks', async () => {
      let mock = await mockTask.getTasks()
      let token = await mock.user.createAuthToken()
      let res = await request.get(apiURL)
        .set('Authorization', 'Bearer ' + token)
      expect(res.status).toBe(200)
      expect(res.body.length).toBe(3)
    })
  })

  describe('PUT /task/:id', () => {
    it('should update a task', async () => {
      let mock = await mockTask.getTask()
      let token = await mock.input.user.createAuthToken()
      let res = await request.put(`${apiURL}/${mock.task.id}`)
        .set('Authorization', 'Bearer ' + token)
        .send({completed: true})

      expect(res.status).toBe(200)
      expect(res.body.id).toBe(mock.task.id)
      expect(res.body.completed).toBeTruthy()
    })
  })

  describe('DELETE /task/:id', () => {
    it('should update a task', async () => {
      let mock = await mockTask.getTask()
      let token = await mock.input.user.createAuthToken()
      let res = await request.delete(`${apiURL}/${mock.task.id}`)
        .set('Authorization', 'Bearer ' + token)
      expect(res.status).toBe(200)
    })
  })

})
