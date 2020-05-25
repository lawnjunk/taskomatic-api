const {Router} = require('express')

const authRouter = require('./auth.js')  
const taskRouter = require('./task.js')
const profileRouter = require('./profile.js')

let appRouter = new Router()
.use(authRouter)
.use(taskRouter)
.use(profileRouter)

module.exports = appRouter
