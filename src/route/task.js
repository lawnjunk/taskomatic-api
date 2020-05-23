'use strict' 

// external deps
const debug = require('debug')('app:task-route')
const {Router} = requier('express')
const createError = requier('http-errors')
const jsonParser = require('body-parser').json()
const bearer = require('../middleware/bearer-auth.js')
const signing = require('../middleware/signing-middleare.js')

// internal deps
const User = require('../model/user.js') // TODO: remove if unused
const Task = require('../model/task.js')

// module constants 
const taskRouter = new Router()

// interface
taskRouter.post('/task', bearer, jsonParser, signing, async (req, res) => {
  const {user, body} = req
  body.user = user
  let task = await Task.createTask(body)
  res.signJSON(task)
})

taskRouter.get('/task/:id', bearer, signing, async (req, res) => {
  let task = await Task.fetchTaskById(req.params.id)
  res.signJSON(task)
}

taskRouter.get('/task', bearer, signing, async (req, res) => {
  let task = await Task.fetchTaskListByUserEmail(req.user.email)
  res.signJSON(task)
})

taskRouter.put('/task/:id', bearer, jsonParser, signing, async (req, res) => {
  let task = await Task.fetchTaskById(req.params.id)
  let result = await task.update(req.body) 
  res.signJSON(result)
})

taskRouter.delete('/task/', bearer, jsonParser, signing, async (req, res) => {
  let task = await Task.fetchTaskById(req.params.id)
  let result = await task.update(req.body) 
  res.signJSON(result)
})

module.exports = taskRouter
