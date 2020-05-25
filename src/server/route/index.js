'use strict'

// external deps
const {Router} = require('express')

// internal modules
const authRouter = require('./auth.js')  
const taskRouter = require('./task.js')
const profileRouter = require('./profile.js')

// interface
let appRouter = new Router()
.use(authRouter)
.use(taskRouter)
.use(profileRouter)

module.exports = appRouter
