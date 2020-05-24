'use strict' 

// external deps
const debug = require('debug')('app:task-route')
const {Router} = require('express')
const createError = require('http-errors')
const jsonParser = require('body-parser').json()
const bearer = require('../middleware/bearer-auth.js')
const signing = require('../middleware/signing-middleare.js')

// internal deps
const User = require('../model/user.js') 
const Task = require('../model/task.js')

// module constants 
const taskRouter = new Router()

// interface
taskRouter.post('/task', bearer, jsonParser, signing, async (req, res) => {
  const {user, body} = req
  if(req.body.email){
    let user = await User.fetchByEmail(req.body.email)
    if(user == null)
      throw createError(401, 'invalid email')
    req.body.user = user
  } else {
    req.body.user = req.user
  }

  let task = await Task.createTask(body)
  res.signJSON(task)
})

taskRouter.get('/task/:id', bearer, signing, async (req, res) => {
  let task = await Task.fetchTaskById(req.params.id)
  res.signJSON(task)
})

taskRouter.get('/task', bearer, signing, async (req, res) => {
  let task = await Task.fetchTaskListByUserEmail(req.user.email)
  res.signJSON(task)
})

taskRouter.put('/task/:id', bearer, jsonParser, signing, async (req, res) => {
  let task = await Task.fetchTaskById(req.params.id)
  if(req.body.email){
    let user = await User.fetchByEmail(req.body.email)
    if(user == null)
      throw createError(401, 'invalid email')
    req.body.user = user
  } 

  let result = await task.update(req.body) 
  res.signJSON(result)
})

taskRouter.delete('/task/:id', bearer , async (req, res) => {
  let task = await Task.fetchTaskById(req.params.id)
  await task.delete()
  res.sendStatus(200)
})

taskRouter.post('/task/random', bearer, jsonParser, signing, async (req, res) => {
  debug('POST /task/random')
  const {user, body} = req
  body.user = user
  let task = await Task.createTask(body)
  setTimeout(async () => {
    debug('hahahahhaha')
    await task.update({completed: true})
    .catch(console.error)
  }, (Math.floor((Math.random() * 2)) * 1000) + 1000)
  res.signJSON(task)
})

module.exports = taskRouter
