const {Router} = require('express')

const authRouter = require('./auth.js')  
const taskRouter = require('./task.js')

let appRouter = new Router()
.use(authRouter)
.use(taskRouter)

module.exports = appRouter
