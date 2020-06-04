'use strict' 

// external deps
const debug = require('debug')('app:task-route')
const {Router} = require('express')
const createError = require('http-errors')
const jsonParser = require('body-parser').json()

// internal modules 
const User = require('../model/user.js') 
const Task = require('../model/task.js')
const bearer = require('../middleware/bearer-auth.js')
const signing = require('../middleware/signing-middleare.js')
const asyncMiddleware = require('../middleware/async-middleware.js')
const tomorrow = require('../lib/tomorrow.js')
const mailTrigger = require('../lib/mail-trigger.js')

// module constants 
const taskRouter = new Router()

// interface
taskRouter.post('/task', bearer, jsonParser, signing, asyncMiddleware(async (req, res) => {
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
  await mailTrigger.notifyTaskCreate(user, task)
  //await mailer.notifyTaskCreate(user, task).catch(console.error) 
  res.signJSON(task)
  tomorrow.register(task.id, () => {
    mailTrigger.notifyTaskExpire(user, task).catch(console.error)
  })
}))

taskRouter.get('/task/:id', bearer, signing, asyncMiddleware(async (req, res) => {
  let task = await Task.fetchTaskById(req.params.id)
  res.signJSON(task)
}))

taskRouter.get('/task', bearer, signing, asyncMiddleware(async (req, res) => {
  let task = await Task.fetchTaskListByUserEmail(req.user.email)
  res.signJSON(task)
}))

taskRouter.put('/task/:id', bearer, jsonParser, signing, asyncMiddleware(async (req, res) => {
  let task = await Task.fetchTaskById(req.params.id)
  if(req.body.email){
    let user = await User.fetchByEmail(req.body.email)
    if(user == null)
      throw createError(401, 'invalid email')
    req.body.user = user
  } 

  let result = await task.update(req.body) 
  if (result.complted)
    await mailTrigger.notifyTaskComplete(user, result)
  if (!result.draft)
    tomorrow.clear(task.id)
  res.signJSON(result)
}))

taskRouter.delete('/task/:id', bearer , asyncMiddleware(async (req, res) => {
  let task = await Task.fetchTaskById(req.params.id)
  await task.delete()
  res.sendStatus(200)
}))

taskRouter.post('/task/random', bearer, jsonParser, signing, asyncMiddleware(async (req, res) => {
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
}))

module.exports = taskRouter
